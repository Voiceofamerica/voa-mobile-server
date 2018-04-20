import * as request from 'request-promise-native'
import { URL } from 'url'
import { ServiceUrl } from './config'
import { QueryParams } from '@voiceofamerica/voa-core-shared/dist/interfaces/queryParams'
const url = require('url')
import { Audience } from './enums'
import * as _ from 'lodash'

export async function getData(
  dataUrl:
    | 'articles'
    | 'zones'
    | 'search'
    | 'breakingnews'
    | 'topstories'
    | 'scheduler'
    | 'videoscheduler'
    | 'liveaudio'
    | 'livevideo'
    | 'audioclips',
  source: Audience,
  additionalParams?: QueryParams
) {
  const queryParams: QueryParams = { source: source }
  if (additionalParams) {
    additionalParams = <QueryParams>_.pickBy(additionalParams, _.identity)
  }
  Object.assign(queryParams, additionalParams)
  const data = await getDataHelper(ServiceUrl, dataUrl, queryParams)
  console.log(dataUrl + ': ' + JSON.stringify(queryParams) + ': ' + data.length)
  return data.filter(i => i)
}

async function getDataHelper(
  baseUrl: string,
  dataUrl: string,
  queryParams: any
): Promise<any[]> {
  const feedUrl = url.resolve(baseUrl, dataUrl)
  return await request(feedUrl, { qs: queryParams, json: true })
}

const pathRgx = /\/(.{36})((?:_tv)?)((?:_[^\._]+)*)\.(.*)/
export function mapImageUrl(imgUrl: string | undefined, params: string) {
  if (!imgUrl) {
    return imgUrl
  }

  const parsedUrl = new URL(imgUrl)
  const pathParts = pathRgx.exec(parsedUrl.pathname)
  if (pathParts === null) {
    return imgUrl
  }

  const guid = pathParts[1]
  const tv = pathParts[2]
  const mods = pathParts[3]
  const ext = pathParts[4]
  parsedUrl.pathname = `${guid}${tv}_${params}${mods}.${ext}`
  return parsedUrl.toString()
}
