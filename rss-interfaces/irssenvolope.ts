export interface IRssEnvolope {
  rss: {
    channel: {
      title,
      link,
      description,
      language,
      copyright,
      lastBuildDate,
      item: []
    }
  }
}

