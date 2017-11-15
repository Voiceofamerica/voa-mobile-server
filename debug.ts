import { graphqlHandler } from './handler'

graphqlHandler({}, {}, function(err: any, res: any) {
  console.log(res)
})
