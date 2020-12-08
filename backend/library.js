import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'
import { request, getRepoVersions } from './libs/request-lib'

const { RELEAZER_TABLE } = process.env

export async function main (event, context) {
  const { id, name } = event.queryStringParameters
  const libId = id.toString()
  const userId = event.requestContext.identity.cognitoIdentityId

  const getLibParams = {
    TableName: RELEAZER_TABLE,
    Key: {
      PK: 'LIBRARIES',
      SK: `#LIBRARY#${libId}`
    },
    ProjectionExpression: 'avatar, libraryName, libraryUrl, lastUpdated, versions'
  }

  const followerTransaction = {
    TransactItems: [
      {
        Put: {
          TableName: RELEAZER_TABLE,
          Item: {
            PK: `LIBRARY#${libId}`,
            SK: `#FOLLOWING#${userId}`,
            followedLibrary: libId,
            followingUser: userId,
            timestamp: Date.now()
          },
          ConditionExpression: 'attribute_not_exists(SK)',
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      },
      {
        Update: {
          TableName: RELEAZER_TABLE,
          Key: {
            PK: `USER#${userId}`,
            SK: `#METADATA#${userId}`
          },
          UpdateExpression: 'SET following = following + :i',
          ExpressionAttributeValues: {
            ':i': 1
          },
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      },
      {
        Update: {
          TableName: RELEAZER_TABLE,
          Key: {
            PK: 'LIBRARIES',
            SK: `#LIBRARY#${libId}`
          },
          UpdateExpression: 'SET followers = followers + :i',
          ExpressionAttributeValues: {
            ':i': 1
          },
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      }
    ]
  }

  try {
    const libraryInDb = await dynamoDbLib.call('get', getLibParams)

    if (libraryInDb.Item) {
      await dynamoDbLib.call('transactWrite', followerTransaction)
      return success({ ok: true, wasInDb: true, data: libraryInDb.Item })
    } else {
      const libraryFromGithub = await request(`/repos/${name}`)
      if (libraryFromGithub.message === 'Not Found') return failure({ ok: false, message: 'Not found' })
      const versions = await getRepoVersions(name)

      const addLibraryParams = {
        TableName: RELEAZER_TABLE,
        Item: {
          PK: `LIBRARIES`,
          SK: `#LIBRARY#${libId}`,
          libraryId: libId,
          libraryName: libraryFromGithub.name,
          fullname: libraryFromGithub.full_name,
          libraryUrl: libraryFromGithub.html_url,
          description: libraryFromGithub.description,
          homepage: libraryFromGithub.homepage,
          avatar: libraryFromGithub.owner.avatar_url,
          followers: 0,
          lastUpdated: Date.now(),
          versions: [ ...versions ]
        }
      }
      await dynamoDbLib.call('put', addLibraryParams)
      await dynamoDbLib.call('transactWrite', followerTransaction)
      return success({ ok: true, wasInDb: false, data: addLibraryParams.Item })
    }
  } catch (e) {
    return failure({ ok: false, error: e })
  }
}
