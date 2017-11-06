import { getArticles } from './parser'
import { Response } from './response'

export async function articles(event, context, callback) {
  let err, articlesArray

  try {
    articlesArray = await getArticles()
  } catch (ex) {
    err = ex
  } finally {
    callback(null, new Response(articlesArray, err))
  }
}
