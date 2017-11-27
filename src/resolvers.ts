import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { makeExecutableSchema } from 'graphql-tools'
import { getData } from './resolverHelpers'
import { QueryParams } from 'voa-core-shared/dist/interfaces/queryParams'

export const resolvers: IResolvers = <IResolvers>{
  Query: {
    articles: async (obj: any, args: { source: string }, context: any) => {
      return await getArticles(args.source)
    },
    articleById: async (obj: any, args: { source: string; id: number }, context: any) => {
      const queryParams = { ArticleId: args.id }
      const data = await getArticles(args.source, queryParams)
      return data[0]
    },
    zones: async (obj: any, args: { source: string }, context: any) => {
      return await getZones(args.source)
    },
    articlesByZoneId: async (
      obj: any,
      args: { source: string; zoneId: number },
      context: any
    ) => {
      const queryParams = { ZoneId: args.zoneId }
      return await getArticles(args.source, queryParams)
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
    relatedStories: (obj: any, args: any, context: any) => {
      return obj.relatedStories
    },
  },
}

async function search(source: string, queryParams: QueryParams) {
  return await getData('search', source, queryParams)
}

async function getBreakingNews(source: string) {
  return await getData('breakingnews', source)
}

async function getArticles(source: string, queryParams?: QueryParams) {
  return await getData('articles', source, queryParams)
}

async function getZones(source: string) {
  return await getData('zones', source)
}
