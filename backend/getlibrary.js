import * as dynamoDbLib from './libs/dynamodb-lib'
import { success, failure } from './libs/response-lib'
const { LIBRARIES_TABLE } = process.env

export async function main (event, context) {
  const { id } = event.queryStringParameters
  const libId = id.toString()

  const getParams = {
    TableName: LIBRARIES_TABLE,
    Key: {
      libraryId: libId
    }
  }

  try {
    const result = await dynamoDbLib.call('get', getParams)
    if (result.Item) {
      const libraryObj = {
        avatar: result.Item.avatar,
        description: result.Item.description,
        fullname: result.Item.fullname,
        name: result.Item.name,
        homepage: result.Item.homepage,
        libraryId: result.Item.libraryId,
        url: result.Item.url,
        versions: result.Item.versions
      }
      return success({ ok: true, data: libraryObj })
    }
  } catch (e) {
    return failure({ ok: false, error: e.message })
  }
}
