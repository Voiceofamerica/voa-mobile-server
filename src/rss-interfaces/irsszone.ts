const feedUrl = `http://www.rferl.org/mobapp/zones.xml`

// Feed Parameters
/** SiteID integer null Identifier of the website. When parameter is not present, id of
 * the site will be identified automatically from domain name.
 * ZoneID integer null Parent zone identifier. When parameter is set - returns list of
 * zones that are direct children of given zone.
 * example: zoneid=1
 * style xsl|css null For debugging: Prevents some browsers from detection RSS as RSS feed
 * and appends either CSS or XSL stylesheet. */

export interface IRssZone {
  id: number
  site: number
  /** Date and time of last zone content modification */
  hash: string
  /** If zone is article zone or zone for gallery or video
   * (values are a,v,p or its combinations) */
  type: string
  /** If zone is Broadcast zone */
  broadcast: boolean
  name: string
}
