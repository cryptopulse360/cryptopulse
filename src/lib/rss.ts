import { getAllArticles } from './mdx'
import { siteConfig } from './constants'

export interface RssItem {
  title: string
  link: string
  guid: string
  description: string
  author: string
  pubDate: string
  categories: string[]
}

/**
 * Generate RSS items from articles
 */
export function generateRssItems(): RssItem[] {
  const articles = getAllArticles()
  const baseUrl = siteConfig.url
  
  return articles.map(article => ({
    title: article.title,
    link: `${baseUrl}/articles/${article.slug}/`,
    guid: `${baseUrl}/articles/${article.slug}/`,
    description: article.description,
    author: `${siteConfig.author} (${article.author})`,
    pubDate: article.publishedAt.toUTCString(),
    categories: article.tags
  }))
}

/**
 * Generate complete RSS feed XML
 */
export function generateRssXml(): string {
  const items = generateRssItems()
  const baseUrl = siteConfig.url
  const buildDate = new Date().toUTCString()
  
  // Get the latest article date for lastBuildDate
  const articles = getAllArticles()
  const latestArticleDate = articles.length > 0 
    ? articles[0].publishedAt.toUTCString()
    : buildDate
  
  const rssItems = items.map(item => {
    const categories = item.categories.map(category => 
      `    <category>${escapeXml(category)}</category>`
    ).join('\n')
    
    return `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${item.link}</link>
    <guid isPermaLink="true">${item.guid}</guid>
    <description>${escapeXml(item.description)}</description>
    <author>${escapeXml(item.author)}</author>
    <pubDate>${item.pubDate}</pubDate>
${categories}
  </item>`
  }).join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <managingEditor>${escapeXml(siteConfig.author)}</managingEditor>
    <webMaster>${escapeXml(siteConfig.author)}</webMaster>
    <lastBuildDate>${latestArticleDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}${siteConfig.seo.defaultImage}</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
${rssItems}
  </channel>
</rss>`
}

/**
 * Escape XML special characters
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Validate RSS item structure
 */
export function validateRssItem(item: RssItem): boolean {
  // Check required fields
  if (!item.title || !item.link || !item.guid || !item.description || !item.pubDate) {
    return false
  }
  
  // Validate URL format
  try {
    new URL(item.link)
    new URL(item.guid)
  } catch {
    return false
  }
  
  // Validate date format
  if (isNaN(Date.parse(item.pubDate))) {
    return false
  }
  
  // Validate categories is array
  if (!Array.isArray(item.categories)) {
    return false
  }
  
  return true
}

/**
 * Get RSS feed metadata
 */
export function getRssFeedMetadata() {
  const articles = getAllArticles()
  const buildDate = new Date()
  const latestArticleDate = articles.length > 0 ? articles[0].publishedAt : buildDate
  
  return {
    title: siteConfig.name,
    description: siteConfig.description,
    link: siteConfig.url,
    language: 'en-us',
    managingEditor: siteConfig.author,
    webMaster: siteConfig.author,
    lastBuildDate: latestArticleDate.toUTCString(),
    pubDate: buildDate.toUTCString(),
    ttl: 60,
    itemCount: articles.length,
    imageUrl: `${siteConfig.url}${siteConfig.seo.defaultImage}`
  }
}