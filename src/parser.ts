import { IArticle } from 'voa-core-shared'
import { IRssEnvolope, IFeed, IFeedUrl } from './rss-interfaces/irssenvolope'
import { RssArticle, IRssArticle } from './rss-interfaces/irssarticle'
import { promisify } from 'bluebird'
import { parseString } from 'xml2js'
import * as request from 'request-promise-native'
// import { IArticle } from 'voa-core-shared'

const parseStringAsync = promisify(parseString)

export async function getArticles(): Promise<IArticle[]> {
  return await getParsedContent<IRssArticle, IArticle>(new RssArticle())
}

async function getParsedContent<TSource, TResult>(
  feed: IFeed<TSource, TResult>
): Promise<TResult[]> {
  const response = await getFeedContent(feed)
  const data = await parseXmlContent(response)
  const source = feed.mapData(data)
  return feed.adaptData(source)
}

async function parseXmlContent(feedContent): Promise<IRssEnvolope> {
  return await parseStringAsync(feedContent, {
    explicitArray: false,
    mergeAttrs: true,
  })
}

async function getFeedContent(feedUrlProvider: IFeedUrl) {
  return await request(feedUrlProvider.feedUrl)
}
