import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'

const { RELEAZER_TABLE } = process.env

export async function main (event, context) {
  const { id } = event.queryStringParameters
  const userId = event.requestContext.identity.cognitoIdentityId
  const libId = id.toString()

  const deleteParams = {
    TableName: RELEAZER_TABLE,
    Key: {
      PK: 'LIBRARIES',
      SK: `#LIBRARY#${libId}`
    },
    ConditionExpression: 'followers < :i',
    ExpressionAttributeValues: {
      ':i': 1
    }
  }

  const unfollowerTransaction = {
    TransactItems: [
      {
        Delete: {
          TableName: RELEAZER_TABLE,
          Key: {
            PK: `LIBRARY#${libId}`,
            SK: `#FOLLOWING#${userId}`
          },
          ConditionExpression: 'attribute_exists(SK)',
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
          UpdateExpression: 'SET following = following - :i',
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
          UpdateExpression: 'SET followers = followers - :i',
          ExpressionAttributeValues: {
            ':i': 1
          },
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      }
    ]
  }

  try {
    await dynamoDbLib.call('transactWrite', unfollowerTransaction)
    await dynamoDbLib.call('delete', deleteParams)
    return success({ ok: true, message: 'Library unfollowed' })
  } catch (e) {
    return failure({ ok: false, error: e.message })
  }
}
