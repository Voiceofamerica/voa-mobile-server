import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { makeExecutableSchema } from 'graphql-tools'
import { getData } from './resolverHelpers'
import { QueryParams } from '@voiceofamerica/voa-core-shared/dist/interfaces/queryParams'
import { GraphQLEnumType } from 'graphql'
import { EnumValues } from 'enum-values'

enum ContentType {
  Article = 'a',
  Video = 'v',
  PhotoGallery = 'p',
}

enum ArticleVideoRelationship {
  SameItem = '0',
  MainImage = '1',
  EmbededInContent = '2',
}

function convertContentTypeToQueryParams(type: [keyof typeof ContentType]) {
  const articleType = type.map(t => ContentType[t]).join('')
  return { Type: articleType }
}

function wrapAsArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item]
}

export const resolvers: IResolvers = <IResolvers>{
  Query: {
    articles: async (
      obj: any,
      args: { source: string; type: [keyof typeof ContentType] },
      context: any
    ) => {
      return await getArticles(args.source, args.type)
    },
    articleById: async (
      obj: any,
      args: { source: string; type: [keyof typeof ContentType]; id: number },
      context: any
    ) => {
      const queryParams = { ArticleId: args.id }
      const data = await getArticles(args.source, args.type, queryParams)
      return data[0]
    },
    zones: async (obj: any, args: { source: string }, context: any) => {
      return await getZones(args.source)
    },
    articlesByZoneId: async (
      obj: any,
      args: { source: string; type: [keyof typeof ContentType]; zoneId: number },
      context: any
    ) => {
      const queryParams = { ZoneId: args.zoneId }
      return await getArticles(args.source, args.type, queryParams)
    },
    search: async (
      obj: any,
      args: { source: string; keywords: string; zoneId: number },
      context: any
    ) => {
      const queryParams = { q: args.keywords }
      const data = await search(args.source, queryParams)

      if (args.zoneId !== 0) {
        return data.filter((i: any) => i.zone === args.zoneId)
      }

      return data
    },
    breakingNews: async (obj: any, args: { source: string }, context: any) => {
      return await getBreakingNews(args.source)
    },
  },
  Article: {
    type: (obj: any, args: any, context: any) => {
      return EnumValues.getNameFromValue(ContentType, obj.type)
    },
    authors: (obj: any, args: any, context: any) => {
      return obj.authors ? wrapAsArray(obj.authors.author) : []
    },
    relatedStories: (obj: any, args: any, context: any) => {
      return obj.relatedStories ? wrapAsArray(obj.relatedStories.story) : []
    },
  },
  RelatedStory: {
    type: (obj: any, args: any, context: any) => {
      return EnumValues.getNameFromValue(ContentType, obj.type)
    },
  },
  Video: {
    relType: (obj: any, args: any, context: any) => {
      return EnumValues.getNameFromValue(ArticleVideoRelationship, obj.relType)
    },
  },
}

async function search(source: string, queryParams: QueryParams) {
  return await getData('search', source, queryParams)
}

async function getBreakingNews(source: string) {
  return await getData('breakingnews', source)
}

async function getArticles(
  source: string,
  type: [keyof typeof ContentType],
  queryParams?: QueryParams
) {
  const typeParams = convertContentTypeToQueryParams(type)
  Object.assign(typeParams, queryParams)
  return await getData('articles', source, typeParams)
}

async function getZones(source: string) {
  return await getData('zones', source)
}
