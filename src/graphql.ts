// import { Response } from './response'

// async function someAsyncOperation(): Promise<string> {
//   return 'Execute any database or HTTP request as you would in your middletier server.'
// }

// export async function myAction(event, context, callback) {
//   let err, myContent

//   try {
//     myContent = await someAsyncOperation()
//   } catch (ex) {
//     err = ex
//   } finally {
//     callback(null, new Response(myContent, err))
//   }
// }

import { makeExecutableSchema } from 'graphql-tools'
import { graphqlLambda, graphiqlLambda } from 'graphql-server-lambda'

import { articleSchema } from 'voa-core-shared'

import { resolvers } from './resolvers'
import { GraphQLSchema } from 'graphql/type/schema'
import { DocumentNode } from 'graphql'

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: articleSchema,
  resolvers,
  logger: console,
})

export function graphqlHandler(event: any, context: any, callback: any) {
  console.log(articleSchema)
  console.log('hello gql')
  function callbackFilter(error: any, output: any) {
    output.headers['Access-Control-Allow-Origin'] = '*'
    callback(error, output)
  }

  const handler = graphqlLambda({ schema: myGraphQLSchema })
  return handler(event, context, callbackFilter)
}

export function graphiqlHandler() {
  return graphiqlLambda({
    endpointURL: '/dev/graphql',
  })
}
