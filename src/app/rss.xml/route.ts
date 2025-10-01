import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/mdx'
import { siteConfig } from '@/lib/constants'

export async function GET() {
  try {
    const articles = getAllArticles()
    const baseUrl = siteConfig.url
    const buildDate = new Date().toUTCString()
    
    // Get the latest article date for lastBuildDate
    const latestArticleDate = articles.length > 0 
      ? articles[0].publishedAt.toUTCString()
      : buildDate
    
    const rssItems = articles.map(article => {
      const articleUrl = `${baseUrl}/articles/${article.slug}/`
      const pubDate = article.publishedAt.toUTCString()
      
      // Escape HTML content for RSS
      const description = escapeXml(article.description)
      const title = escapeXml(article.title)
      const author = escapeXml(article.author)
      
      // Create categories from tags
      const categories = article.tags.map(tag => 
        `    <category>${escapeXml(tag)}</category>`
      ).join('\n')
      
      return `  <item>
    <title>${title}</title>
    <link>${articleUrl}</link>
    <guid isPermaLink="true">${articleUrl}</guid>
    <description>${description}</description>
    <author>${siteConfig.author} (${author})</author>
    <pubDate>${pubDate}</pubDate>
${categories}
  </item>`
    }).join('\n')
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <managingEditor>${siteConfig.author}</managingEditor>
    <webMaster>${siteConfig.author}</webMaster>
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

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}