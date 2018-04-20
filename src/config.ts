export const ServiceUrl: string = process.env.FEED_URL || ''
if (!ServiceUrl) {
  throw new Error('feed url is not configured')
}
