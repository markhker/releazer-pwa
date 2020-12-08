import { success, failure } from './libs/response-lib'
import { request } from './libs/request-lib'

export async function main (event, context) {
  const { name } = event.queryStringParameters

  try {
    const library = await request(`/repos/${name}`)
    console.log('library: ', library)
    if (library.message === 'Not Found') {
      return failure({ ok: false, error: 'Library not found' })
    } else {
      return success({ ok: true, id: library.id })
    }
  } catch (error) {
    return failure({ ok: false, error: error.message })
  }
}
