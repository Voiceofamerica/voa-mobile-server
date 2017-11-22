import * as request from 'request-promise-native'
const url = require('url')

export const resolvers = {
  Query: {
    articles: async (obj: any, args: any, context: any) => {
      return await getArticles(args.source)
    },
    articleById: async (obj: any, args: any, context: any) => {
      return await getArticles(args.source, args.id)
    },
  },
  Article: {
    relatedStories: (obj: any, args: any, context: any) => {
      return obj.relatedStories
    },
  },
}

const serviceUrl = `https://jtd40stvs5.execute-api.us-east-1.amazonaws.com/dev/`
// const serviceUrl = `http://localhost:3007`

async function getArticles(source: string, id?: number) {
  const queryParams: { [name: string]: string | number } = { source: source }
  if (id) {
    queryParams['ArticleId'] = id
  }

  const data = await getData(serviceUrl, 'articles', queryParams)
  if (id) {
    return data[0]
  }
  console.log(data)
  return data
}

async function getData(baseUrl: string, dataUrl: 'articles', queryParams: any) {
  console.log(queryParams)
  const feedUrl = url.resolve(baseUrl, dataUrl)
  return await request(feedUrl, { qs: queryParams, json: true })
}
