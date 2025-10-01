import { getAllArticles, getAllTags } from './mdx'
import { siteConfig } from './constants'

export interface SitemapUrl {
  url: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
}

/**
 * Generate all URLs for the sitemap
 */
export function generateSitemapUrls(): SitemapUrl[] {
  const articles = getAllArticles()
  const tags = getAllTags()
  const baseUrl = siteConfig.url
  const currentDate = new Date().toISOString()
  
  // Static pages with their priorities and update frequencies
  const staticPages: SitemapUrl[] = [
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
  const articlePages: SitemapUrl[] = articles.map(article => ({
    url: `${baseUrl}/articles/${article.slug}/`,
    lastmod: (article.updatedAt || article.publishedAt).toISOString(),
    changefreq: 'monthly' as const,
    priority: article.featured ? '0.9' : '0.8'
  }))
  
  // Tag pages
  const tagPages: SitemapUrl[] = tags.map(tag => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}/`,
    lastmod: currentDate,
    changefreq: 'weekly' as const,
    priority: '0.7'
  }))
  
  return [...staticPages, ...articlePages, ...tagPages]
}

/**
 * Generate XML sitemap content
 */
export function generateSitemapXml(): string {
  const urls = generateSitemapUrls()
  
  const urlElements = urls.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
}

/**
 * Validate sitemap URL structure
 */
export function validateSitemapUrl(url: SitemapUrl): boolean {
  // Check required fields
  if (!url.url || !url.lastmod || !url.changefreq || !url.priority) {
    return false
  }
  
  // Validate URL format
  try {
    new URL(url.url)
  } catch {
    return false
  }
  
  // Validate date format
  if (isNaN(Date.parse(url.lastmod))) {
    return false
  }
  
  // Validate changefreq values
  const validChangefreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
  if (!validChangefreq.includes(url.changefreq)) {
    return false
  }
  
  // Validate priority range
  const priority = parseFloat(url.priority)
  if (isNaN(priority) || priority < 0 || priority > 1) {
    return false
  }
  
  return true
}