import { IRssArticleEnvelope } from './irssarticle'

export interface IFeedUrl {
  feedUrl: string
}

export interface IFeed<TSource, TResult> extends IFeedUrl {
  mapData: IMapFunction<TSource>
  adaptData: IAdaptFunction<TSource, TResult>
  feedUrl: string
}

type IMapFunction<T> = (data: IRssEnvolope) => T[]
type IAdaptFunction<TSource, TResult> = (source: TSource[]) => TResult[]

export interface IRssEnvolope {
  rss: {
    channel: {
      title
      link
      description
      language
      copyright
      lastBuildDate
      item: IRssArticleEnvelope[]
    }
  }
}
