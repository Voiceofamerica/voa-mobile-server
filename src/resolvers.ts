import * as request from 'request-promise-native'
const url = require('url')

export const resolvers = {
  Query: {
    articles: async (obj: any, args: any, context: any) => {
      return await getArticles(args.source)
    },
  },
}

const serviceUrl = `https://jtd40stvs5.execute-api.us-east-1.amazonaws.com/dev/`

async function getArticles(source: string) {
  const data = await getData(serviceUrl, 'articles', { source: source })
  return data
}

async function getData(baseUrl: string, dataUrl: 'articles', queryParams: any) {
  console.log(queryParams)
  const feedUrl = url.resolve(baseUrl, dataUrl)
  return await request(feedUrl, { qs: queryParams, json: true })
}
