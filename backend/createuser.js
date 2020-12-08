import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'

const { RELEAZER_TABLE } = process.env

export async function main (event, context) {
  const data = JSON.parse(event.body)
  const userId = event.requestContext.identity.cognitoIdentityId

  const queryParams = {
    TableName: RELEAZER_TABLE,
    IndexName: 'InvertedIndex',
    KeyConditionExpression: 'SK = :sk',
    ExpressionAttributeValues: {
      ':sk': `#FOLLOWING#${userId}`
    }
  }

  const newUserParams = {
    TableName: RELEAZER_TABLE,
    Item: {
      PK: `USER#${userId}`,
      SK: `#METADATA#${userId}`,
      userId,
      email: data.email,
      createdAt: Date.now(),
      userRoles: ['user'],
      following: 0
    }
  }

  try {
    const following = await dynamoDbLib.call('query', queryParams)
    let keys = [
      {
        PK: `USER#${userId}`,
        SK: `#METADATA#${userId}`
      }
    ]
    for (let library of following.Items) {
      keys = [ ...keys,
        {
          PK: 'LIBRARIES',
          SK: `#LIBRARY#${library.followedLibrary}`
        }
      ]
    }

    const requestItemsParams = {
      RequestItems: {
        [RELEAZER_TABLE]: {
          Keys: keys,
          ProjectionExpression: 'email, following, userRoles, avatar, libraryName, libraryUrl, libraryId, lastUpdated, versions'
        }
      }
    }
    const result = await dynamoDbLib.call('batchGet', requestItemsParams)
    if (result.Responses['releazer-table'].length > 0) {
      return success({ ok: true, isNewUser: false, data: result.Responses['releazer-table'] })
    } else {
      const newUser = await dynamoDbLib.call('put', newUserParams)
      return success({ ok: true, isNewUser: true, data: newUserParams.Item })
    }
  } catch (e) {
    return failure({ ok: false, error: e.message })
  }
}
