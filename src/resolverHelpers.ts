import * as request from 'request-promise-native'
import { ServiceUrl } from './config'
import { QueryParams } from 'voa-core-shared/dist/interfaces/queryParams'
const url = require('url')

export async function getData(
  dataUrl: 'articles' | 'zones' | 'search' | 'breakingnews',
  source: string,
  additionalParams?: QueryParams
) {
  console.log(source)
  const queryParams: QueryParams = { source: source }
  Object.assign(queryParams, additionalParams)
  return await getDataHelper(ServiceUrl, dataUrl, queryParams)
}

async function getDataHelper(baseUrl: string, dataUrl: string, queryParams: any) {
  console.log(queryParams)
  const feedUrl = url.resolve(baseUrl, dataUrl)
  return await request(feedUrl, { qs: queryParams, json: true })
}
