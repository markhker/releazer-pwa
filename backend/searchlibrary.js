import { success, failure } from './libs/response-lib'
import { request } from './libs/request-lib'

export async function main (event, context) {
  const { q } = event.queryStringParameters

  try {
    const libraryResults = await request(`/search/repositories?q=${q}`)
    let filteredResults = []
    if (libraryResults.items.length) {
      for (const item of libraryResults.items) {
        const fullName = item.full_name
        filteredResults.push(fullName)
      }
    } else {
      return failure({ ok: false, error: 'No results' })
    }
    console.log('libraryResults: ', filteredResults)
    return success({ ok: true, searchResults: filteredResults })
  } catch (error) {
    return failure({ ok: false, error: error.message })
  }
}
