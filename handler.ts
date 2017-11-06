import { Packet } from '_debugger';
import { getArticles } from "./parser";

class Response {
  public readonly statusCode: number
  public readonly body: string
  public readonly headers: {
    'Content-Type': 'application/json',
  }

  constructor(res, err?) {
    this.statusCode = err ? 400 : 200
    this.body = err ? err.message : JSON.stringify(res)
  }
}

export async function articles(event, context, callback) {
  let err, articlesArray

  try {
    articlesArray = await getArticles()
  } catch(ex) {
    err = ex
  } finally {
    callback(null, new Response(articlesArray, err))
  }
}