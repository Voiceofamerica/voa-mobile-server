import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { makeExecutableSchema } from 'graphql-tools'
import { getData } from './resolverHelpers'
import { QueryParams } from '@voiceofamerica/voa-core-shared/dist/interfaces/queryParams'
import { GraphQLEnumType } from 'graphql'
import { EnumValues } from 'enum-values'
import { Audience } from './enums'
import { memoize, uniqBy } from 'lodash'

enum ContentType {
  Article = 'a',
  Video = 'v',
  PhotoGallery = 'p',
  Clip = 'c',
}

enum ArticleVideoRelationship {
  SameItem = '0',
  MainImage = '1',
  EmbededInContent = '2',
}

enum ProgramType {
  Clip = 'c',
  Feature = 'f',
  BroadcastProgram = 'b',
  Video = 'v',
}

function convertContentTypeToQueryParams(type: [keyof typeof ContentType]) {
  const articleType = type.map(t => ContentType[t]).join('')
  return { Type: articleType }
}

function wrapAsArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item]
}

interface IContentQueryParams {
  source: keyof typeof Audience
  type: [keyof typeof ContentType]
  id?: number
  zoneId?: number
  count?: number
  topNews?: boolean
}

interface IProgramQueryParams {
  source: keyof typeof Audience
  type: [keyof typeof ProgramType]
  zoneId?: number
}

function filterByZoneId(data: any[], zoneId?: number): any[] {
  if (zoneId) {
    return data.filter((i: any) => {
      return parseInt(i.zone) === zoneId
    })
  }
  return data
}

const noOp = memoize(() => {
  return []
})

export const resolvers: IResolvers = <IResolvers>{
  Query: {
    content: async (obj: any, args: IContentQueryParams, context: any) => {
      return await getContent(args)
    },
    zones: async (obj: any, args: { source: keyof typeof Audience }, context: any) => {
      return await getZones(Audience[args.source])
    },
    search: async (
      obj: any,
      args: { source: keyof typeof Audience; keywords: string; zoneId?: number },
      context: any
    ) => {
      const queryParams = { q: args.keywords }
      const data = await search(Audience[args.source], queryParams)
      return filterByZoneId(data, args.zoneId)
    },
    breakingNews: async (
      obj: any,
      args: { source: keyof typeof Audience },
      context: any
    ) => {
      return await getBreakingNews(Audience[args.source])
    },
    program: async (obj: any, args: IProgramQueryParams, context: any) => {
      const programType = args.type.join(',')
      const containsBroadcastProgram = programType.includes('BroadcastProgram')

      if (containsBroadcastProgram && Audience[args.source] === Audience.fa) {
        const broadcastData = await liveVideo(Audience[args.source])
        if (broadcastData.length > 0) {
          broadcastData[0].url =
            'https://voa-lh.akamaihd.net/i/voapnn_7@72817/master.m3u8'
        }
        return broadcastData
      }

      const data = await videoSchedule(Audience[args.source])
      return filterByZoneId(data, args.zoneId)
    },
  },
  Article: {
    type: (obj: any) => {
      return EnumValues.getNameFromValue(ContentType, obj.type)
    },
    authors: (obj: any) => {
      return obj.authors ? wrapAsArray(obj.authors.author) : []
    },
    relatedStories: (obj: any) => {
      return obj.relatedStories ? wrapAsArray(obj.relatedStories.story) : []
    },
    photoGallery: (obj: any, args: any, context: any) => {
      return obj.photogallery ? wrapAsArray(obj.photogallery) : []
    },
  },
  Program: {
    type: (obj: any) => {
      return EnumValues.getNameFromValue(ProgramType, obj.type)
    },
  },
  PhotoGallery: {
    photoGalleryTitle: (obj: any) => {
      return obj.photogalleryTitle
    },
    photoGalleryDescription: (obj: any) => {
      return obj.photogalleryDescription
    },
    relType: (obj: any) => {
      return EnumValues.getNameFromValue(ArticleVideoRelationship, obj.relType)
    },
    photo: (obj: any) => {
      return obj ? wrapAsArray(obj.photo) : []
    },
  },
  RelatedStory: {
    type: (obj: any) => {
      return EnumValues.getNameFromValue(ContentType, obj.type)
    },
  },
  Video: {
    relType: (obj: any) => {
      return EnumValues.getNameFromValue(ArticleVideoRelationship, obj.relType)
    },
  },
}

async function getContent(args: IContentQueryParams) {
  const noopTopNews = !(args.topNews || false) || args.zoneId
  const contentType = args.type.join(',')

  const getTopNews = noopTopNews
    ? noOp
    : memoize(async () => getData('topstories', Audience[args.source]))

  const queryParams = convertContentTypeToQueryParams(args.type)

  if (args.id) {
    Object.assign(queryParams, {
      ArticleId: args.id,
    })
  }

  if (args.zoneId) {
    Object.assign(queryParams, {
      ZoneId: args.zoneId,
    })
  }

  if (args.count) {
    Object.assign(queryParams, {
      Count: args.count,
    })
  }

  const getArticles = memoize(async () =>
    getData('articles', Audience[args.source], queryParams)
  )

  const containsAudioClip = contentType.includes('Clip')
  const getAudioClips = !containsAudioClip
    ? noOp
    : memoize(async () => {
        // overwrite type parameters for audio clips to defaults 'cf'
        queryParams.Type = 'cf'
        return await getData('audioclips', Audience[args.source], queryParams)
      })

  const convertAudioClipsToArticle = memoize(async () => {
    const audioData = await getAudioClips()
    // tslint:disable-next-line
    return audioData.map(a => convertAudioClipsToArticleHelper(a))
  })

  const [articles, topNews, articleClips] = await Promise.all([
    getArticles(),
    getTopNews(),
    convertAudioClipsToArticle(),
  ])

  const content = articles.concat(articleClips)
  // sort by date, desc
  // merge audio clips, de-dupe by article.audio url

  let data = topNews.concat(content)
  data = uniqBy(data, i => i.id)

  return args.id
    ? data.filter(i => parseInt(i.id) === args.id)
    : data.slice(0, args.count)
}

function convertAudioClipsToArticleHelper(source: {}): {} {
  return source
}

async function liveVideo(source: Audience) {
  return await getData('livevideo', source)
}

async function videoSchedule(source: Audience) {
  return await getData('videoscheduler', source)
}

async function search(source: Audience, queryParams: QueryParams) {
  return await getData('search', source, queryParams)
}

async function getBreakingNews(source: Audience) {
  return await getData('breakingnews', source)
}

async function getZones(source: Audience) {
  return await getData('zones', source)
}
