import fetch from 'node-fetch'
import * as semver from 'semver'

import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'
import { getRepoVersions } from './libs/request-lib'

const { RELEAZER_TABLE, ONE_SIGNAL_API_URL, ONE_SIGNAL_API_KEY, ONE_SIGNAL_APP_ID } = process.env

export async function main (event, context) {
  const getParams = {
    TableName: RELEAZER_TABLE,
    KeyConditionExpression: 'PK = :pk AND SK < :sk',
    ExpressionAttributeValues: {
      ':pk': 'LIBRARIES',
      ':sk': '#LIBRARY$'
    },
    ProjectionExpression: 'fullname, versions, libraryId, followers, libraryName'
  }

  const RELEASE_TYPES = {
    alpha: 'Alpha Pre-Release 💣',
    beta: 'Beta Pre-Release 🚧',
    canary: 'Canary Pre-Release 🐤',
    rc: 'Release Candidate ✈️',
    other: 'Other ReleaseE ‍🤷',
    patch: 'Fix Release 🐛',
    minor: 'Feature Release ✨',
    major: 'Major Release 🏆'
  }

  const releaseType = version =>
    version.includes('alpha') ? 'alpha'
      : version.includes('beta') ? 'beta'
        : version.includes('canary') ? 'canary'
          : version.includes('rc') ? 'rc'
            : version.includes('-') ? 'other'
              : semver.patch(version) !== 0 ? 'patch'
                : semver.minor(version) !== 0 ? 'minor'
                  : 'major'

  const getReleaseType = version => {
    return RELEASE_TYPES[releaseType(version)]
  }

  const sendNotification = (notification, to) => {
    return fetch(`${ONE_SIGNAL_API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'app_id': ONE_SIGNAL_APP_ID,
        'filters': [
          {
            'field': 'email',
            'value': to
          }
        ],
        ...notification
      })
    })
      .then(res => res.json())
      .then(data => {
        return data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  const notificateFollowers = async (library, newVersion) => {
    try {
      const libraryParams = {
        TableName: RELEAZER_TABLE,
        KeyConditionExpression: 'PK = :pk AND SK < :sk',
        ExpressionAttributeValues: {
          ':pk': `LIBRARY#${library.libraryId}`,
          ':sk': '#FOLLOWING$'
        },
        ProjectionExpression: 'followingUser'
      }

      const followingUsersIds = await dynamoDbLib.call('query', libraryParams)
      let keys = []

      for (let user of followingUsersIds.Items) {
        keys = [ ...keys,
          {
            PK: `USER#${user.followingUser}`,
            SK: `#METADATA#${user.followingUser}`
          }
        ]
      }

      const requestUsersParams = {
        RequestItems: {
          [RELEAZER_TABLE]: {
            Keys: keys,
            ProjectionExpression: 'email, following'
          }
        }
      }

      const usersEmails = await dynamoDbLib.call('batchGet', requestUsersParams)
      console.log('usersEmails: ', usersEmails.Responses['releazer-table'])

      for (let userData of usersEmails.Responses['releazer-table']) {
        if (userData.following > 0) {
          const email = userData.email
          const notification = {
            'headings': { 'en': `🔥New ${library.libraryName} Release 🚀` },
            'contents': { 'en': `📦 ${newVersion} ${getReleaseType(newVersion)}` },
            'web_push_topic': `New ${library.libraryName}`
          }
          if (email) {
            const notif = await sendNotification(notification, email)
            console.log('email: ', email)
            console.log('notification: ', notif)
          }
        }
      }
    } catch (e) {
      return failure({ ok: false, error: e.message })
    }
  }

  const resolveNewVersions = (oldVersions, currentVersions) =>
    currentVersions.filter(version => !oldVersions.includes(version))

  try {
    const libraries = await dynamoDbLib.call('query', getParams)
    console.log('libraries: ', libraries)
    if (libraries.Items) {
      for (let library of libraries.Items) {
        const currentVersions = await getRepoVersions(library.fullname)
        const oldVersions = library.versions
        const newVersions = resolveNewVersions(oldVersions, currentVersions)

        if (newVersions.length) {
          const libId = library.libraryId.toString()
          const versions = [ ...newVersions, ...library.versions ]
          const updateLibraryParams = {
            TableName: RELEAZER_TABLE,
            Key: {
              PK: 'LIBRARIES',
              SK: `#LIBRARY#${libId}`
            },
            UpdateExpression: 'SET versions = :versions, lastUpdated = :lastUpdated',
            ExpressionAttributeValues: {
              ':versions': versions,
              ':lastUpdated': Date.now()
            },
            ReturnValues: 'ALL_NEW'
          }
          await dynamoDbLib.call('update', updateLibraryParams)

          for (let newVersion of newVersions) {
            if (library.followers > 0) {
              await notificateFollowers(library, newVersion)
              console.log('newVersion: ', newVersion)
            }
          }
        }
      }
      return success({ ok: true })
    }
  } catch (e) {
    return failure({ ok: false, error: e.message })
  }
}
