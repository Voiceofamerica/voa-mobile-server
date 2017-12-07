import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { makeExecutableSchema } from 'graphql-tools'
import { getData } from './resolverHelpers'
import { QueryParams } from '@voiceofamerica/voa-core-shared/dist/interfaces/queryParams'
import { GraphQLEnumType } from 'graphql'
import { EnumValues } from 'enum-values'
import { Audience } from './enums'

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
  id: number
  zoneId: number
  count: number
}

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
      args: { source: keyof typeof Audience; keywords: string; zoneId: number },
      context: any
    ) => {
      const queryParams = { q: args.keywords }
      const data = await search(Audience[args.source], queryParams)

      if (args.zoneId !== 0) {
        return data.filter((i: any) => i.zone === args.zoneId)
      }

      return data
    },
    breakingNews: async (
      obj: any,
      args: { source: keyof typeof Audience },
      context: any
    ) => {
      return await getBreakingNews(Audience[args.source])
    },
    program: async (obj: any, args: IContentQueryParams, context: any) => {
      return await getContent(args)
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
      return obj.photogallery
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
  const queryParams = convertContentTypeToQueryParams(args.type)
  if (args.id > 0) {
    Object.assign(queryParams, { ArticleId: args.id })
  }

  if (args.zoneId > 0) {
    Object.assign(queryParams, { ZoneId: args.zoneId })
  }

  if (args.count > 0) {
    Object.assign(queryParams, { Count: args.count })
  }

  return await getData('articles', Audience[args.source], queryParams)

  // TODO: merge topnews (including zoneid filter)
  // limit by count
  // de-dupe by articleId
  // merge audio clips, de-dupe by article.audio url
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
