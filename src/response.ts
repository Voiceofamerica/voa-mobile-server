export class Response {
  public readonly statusCode: number
  public readonly body: string
  public readonly headers: {
    'Content-Type': 'application/json'
  }

  constructor(res, err?) {
    this.statusCode = err ? 400 : 200
    this.body = err ? err.message : JSON.stringify(res)
  }
}
