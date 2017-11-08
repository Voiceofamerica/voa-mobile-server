import { Response } from './response'


async function someAsyncOperation(): Promise<string> {
  return 'Execute any database or HTTP request as you would in your middletier server.'
}

export async function myAction(event, context, callback) {
  let err, myContent

  try {
    myContent = await someAsyncOperation()
  } catch (ex) {
    err = ex
  } finally {
    callback(null, new Response(myContent, err))
  }
}
