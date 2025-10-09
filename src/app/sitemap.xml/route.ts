import { NextResponse } from 'next/server'
import { getAllArticles, getAllTags } from '@/lib/mdx'
import { siteConfig } from '@/lib/constants'

export async function GET() {
  try {
    const articles = getAllArticles()
    const tags = getAllTags()
    
    const baseUrl = siteConfig.url
    const currentDate = new Date().toISOString()
    
    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: `${baseUrl}/articles/`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: `${baseUrl}/tags/`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: `${baseUrl}/about/`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6'
      },
      {
        url: `${baseUrl}/contact/`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6'
      },
      {
        url: `${baseUrl}/privacy/`,
        lastmod: currentDate,
        changefreq: 'yearly',
        priority: '0.3'
      },
      {
        url: `${baseUrl}/disclaimer/`,
        lastmod: currentDate,
        changefreq: 'yearly',
        priority: '0.3'
      }
    ]
    
    // Article pages
    const articlePages = articles.map(article => ({
      url: `${baseUrl}/articles/${article.slug}/`,
      lastmod: (article.updatedAt || article.publishedAt).toISOString(),
      changefreq: 'monthly',
      priority: article.featured ? '0.9' : '0.8'
    }))
    
    // Tag pages
    const tagPages = tags.map(tag => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag)}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    }))
    
    const allPages = [...staticPages, ...articlePages, ...tagPages]
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}