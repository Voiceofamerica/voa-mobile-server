export interface IArticle {
  id: number
  site: number
  zone: number
  type: string //a-article, v-video or p-photogallery)
  pubDate: string
  lastUpdated: string
  url: string
  twitter: string // Short alternative of the article url. Can be used for Twitter like web site on so on.
  title: string
  introduction: string
  content: string
  authors: { // author array
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
    duration: number // seconds
    mime: string // audio/mp3
    url: string
    date: string
  }
  video: {
    videoDescription: string
    guid: string
    relType: number // Defines relation between article and video => 0=SameItem, 1=MainImage,2=EmbededInContent
    id: number
    width: number
    height: number
    duration: number // seconds
    url: string
    thumbnail: string
  }
  relatedStories: { // story array
    storyTitle: string
    id: number
    pubDate: string
    type: string //a-article, v-video or p-photogallery)
    url: string
    twitter: string // Short alternative of the article url. Can be used for Twitter like web site on so on.
    thumbnailUrl: string
  }[]
}