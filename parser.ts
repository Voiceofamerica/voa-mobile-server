import { IRssEnvolope } from './rss-interfaces/irssenvolope';
import { ArticlesFeedUrl, IRssArticle } from './rss-interfaces/irssarticle';
import { promisify } from 'bluebird'
import { parseString } from 'xml2js'
import * as request from 'request-promise-native';
//import { IArticle } from 'voa-core-shared'

const parseStringAsync = promisify(parseString)


export async function getArticles(): Promise<IRssArticle[]> {
  let res = await request(ArticlesFeedUrl)
  let data: IRssEnvolope = await parseStringAsync(res, {explicitArray: false, mergeAttrs: true})
  return data.rss.channel.item.map(i => i.article)
}



