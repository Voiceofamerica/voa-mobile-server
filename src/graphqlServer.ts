import { resolvers } from './resolvers'
import { makeExecutableSchema } from 'graphql-tools'
import { graphqlLambda, graphiqlLambda } from 'graphql-server-lambda'

import { schema } from '@voiceofamerica/voa-core-shared'

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  logger: console,
})

export function graphqlHandler(event: any, context: any, callback: any) {
  function callbackFilter(error: any, output: any) {
    output.headers['Access-Control-Allow-Origin'] = '*'
    callback(error, output)
  }

  const handler = graphqlLambda({ schema: executableSchema })
  return handler(event, context, callbackFilter)
}
