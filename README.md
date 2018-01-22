# VOA Mobile Server
> GraphQL server that makes VOA feed data available for GraphQL consumers

## Develop
- `npm install`
- `npm run offline` or `npm run offline -- --stage prod` or `npm run offline:local`
- Explore API with https://github.com/andev-software/graphql-ide

## Publish
- Logged in AWS CLI client, configured with AWS Lambda access (`brew install awscli`)
- Ensure `env.yml` is configured correctly. **DO NOT store secrets in this file.**
- `npm run deploy`

**Note:** To store secrets implement `https://github.com/marcy-terui/serverless-crypt` or similar

## Further Reading
- https://github.com/creditkarma/graphql-loader

## Endpoints
* dev: https://ncgi56w1eb.execute-api.us-east-1.amazonaws.com/dev
* prod: https://wqhcmo9hpa.execute-api.us-east-1.amazonaws.com/prod