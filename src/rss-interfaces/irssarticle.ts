import { IArticle } from 'voa-core-shared'
import { IFeed, IRssEnvolope, IFeedUrl } from './irssenvolope'

export class RssArticle implements IFeed<IRssArticle, IArticle> {
  readonly feedUrl = 'https://www.rferl.org/mobapp/articles.xml'

  mapData(data: IRssEnvolope): IRssArticle[] {
    return data.rss.channel.item.map(i => i.article)
  }

  adaptData(source: IRssArticle[]): IArticle[] {
    return [] as IArticle[]
  }
}

export interface IRssArticleEnvelope {
  article: IRssArticle
}

export interface IRssArticle {
  id: number
  site: number
  zone: number
  /** a-article, v-video or p-photogallery */
  type: string
  pubDate: string
  lastUpdated: string
  url: string
  /** Short alternative of the article url.
   * Can be used for Twitter like web site on so on. */
  twitter: string
  title: string
  introduction: string
  content: string
  /** author array */
  authors: {
    name: {
      first: string
      middle: string
      last: string
    }
    email: string
    description: string
    id: number
  }[]
  image: {
    imageTitle: string
    id: number
    type: string
    url: string
  }
  audio: {
    audioTitle: string
    audioDescription: string
    id: number
    /** seconds */
    duration: number
    /** audio/mp3 */
    mime: string
    url: string
    date: string
  }
  video: {
    videoDescription: string
    guid: string
    /** Defines relation between article and video
     * 0=SameItem, 1=MainImage,2=EmbededInContent */
    relType: number
    id: number
    width: number
    height: number
    /** seconds */
    duration: number
    url: string
    thumbnail: string
  }
  /** story array */
  relatedStories: {
    storyTitle: string
    id: number
    pubDate: string
    /** a-article, v-video or p-photogallery */
    type: string
    url: string
    /** Short alternative of the article url.
     * Can be used for Twitter like web site on so on. */
    twitter: string
    thumbnailUrl: string
  }[]
}
