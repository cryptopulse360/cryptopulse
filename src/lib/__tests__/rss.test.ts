import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  generateRssItems, 
  generateRssXml, 
  escapeXml, 
  validateRssItem,
  getRssFeedMetadata 
} from '../rss'
import { getAllArticles } from '../mdx'
import { afterEach } from 'node:test'

// Mock the MDX functions
vi.mock('../mdx', () => ({
  getAllArticles: vi.fn()
}))

// Mock the constants
vi.mock('../constants', () => ({
  siteConfig: {
    url: 'https://cryptopulse.example.com',
    name: 'CryptoPulse',
    description: 'Test crypto news site',
    author: 'CryptoPulse Team',
    seo: {
      defaultImage: '/images/og-default.jpg'
    }
  }
}))

const mockGetAllArticles = vi.mocked(getAllArticles)

describe('RSS Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock current date to make tests deterministic
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('generateRssItems', () => {
    it('should generate RSS items from articles', () => {
      const mockArticles = [
        {
          slug: 'bitcoin-analysis',
          title: 'Bitcoin Market Analysis',
          description: 'Deep dive into Bitcoin trends',
          content: 'Article content here',
          author: 'John Crypto',
          publishedAt: new Date('2024-01-10T00:00:00Z'),
          tags: ['bitcoin', 'analysis'],
          heroImage: '/bitcoin.jpg',
          readingTime: 5,
          featured: true
        },
        {
          slug: 'ethereum-update',
          title: 'Ethereum Network Update',
          description: 'Latest Ethereum developments',
          content: 'Article content here',
          author: 'Jane Blockchain',
          publishedAt: new Date('2024-01-08T00:00:00Z'),
          tags: ['ethereum', 'technology'],
          heroImage: '/ethereum.jpg',
          readingTime: 3,
          featured: false
        }
      ]
      
      mockGetAllArticles.mockReturnValue(mockArticles)

      const items = generateRssItems()
      
      expect(items).toHaveLength(2)
      expect(items[0]).toEqual({
        title: 'Bitcoin Market Analysis',
        link: 'https://cryptopulse.example.com/articles/bitcoin-analysis/',
        guid: 'https://cryptopulse.example.com/articles/bitcoin-analysis/',
        description: 'Deep dive into Bitcoin trends',
        author: 'CryptoPulse Team (John Crypto)',
        pubDate: 'Wed, 10 Jan 2024 00:00:00 GMT',
        categories: ['bitcoin', 'analysis']
      })
    })

    it('should handle empty articles array', () => {
      mockGetAllArticles.mockReturnValue([])

      const items = generateRssItems()
      
      expect(items).toHaveLength(0)
    })
  })

  describe('generateRssXml', () => {
    it('should generate valid RSS XML', () => {
      const mockArticles = [
        {
          slug: 'test-article',
          title: 'Test Article',
          description: 'Test description',
          content: 'Test content',
          author: 'Test Author',
          publishedAt: new Date('2024-01-10T00:00:00Z'),
          tags: ['test'],
          heroImage: '/test.jpg',
          readingTime: 5,
          featured: false
        }
      ]
      
      mockGetAllArticles.mockReturnValue(mockArticles)

      const xml = generateRssXml()
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
      expect(xml).toContain('<channel>')
      expect(xml).toContain('</channel>')
      expect(xml).toContain('</rss>')
      expect(xml).toContain('<title>CryptoPulse</title>')
      expect(xml).toContain('<description>Test crypto news site</description>')
    })

    it('should include article items in RSS', () => {
      const mockArticles = [
        {
          slug: 'bitcoin-news',
          title: 'Bitcoin & Ethereum News',
          description: 'Latest crypto news with <special> characters',
          content: 'Content here',
          author: 'Crypto Writer',
          publishedAt: new Date('2024-01-10T00:00:00Z'),
          tags: ['bitcoin', 'ethereum'],
          heroImage: '/news.jpg',
          readingTime: 4,
          featured: false
        }
      ]
      
      mockGetAllArticles.mockReturnValue(mockArticles)

      const xml = generateRssXml()
      
      expect(xml).toContain('<item>')
      expect(xml).toContain('<title>Bitcoin &amp; Ethereum News</title>')
      expect(xml).toContain('<description>Latest crypto news with &lt;special&gt; characters</description>')
      expect(xml).toContain('<link>https://cryptopulse.example.com/articles/bitcoin-news/</link>')
      expect(xml).toContain('<category>bitcoin</category>')
      expect(xml).toContain('<category>ethereum</category>')
      expect(xml).toContain('<pubDate>Wed, 10 Jan 2024 00:00:00 GMT</pubDate>')
    })

    it('should handle empty articles array', () => {
      mockGetAllArticles.mockReturnValue([])

      const xml = generateRssXml()
      
      expect(xml).toContain('<channel>')
      expect(xml).toContain('<title>CryptoPulse</title>')
      expect(xml).not.toContain('<item>')
    })

    it('should include RSS metadata', () => {
      mockGetAllArticles.mockReturnValue([])

      const xml = generateRssXml()
      
      expect(xml).toContain('<language>en-us</language>')
      expect(xml).toContain('<managingEditor>CryptoPulse Team</managingEditor>')
      expect(xml).toContain('<webMaster>CryptoPulse Team</webMaster>')
      expect(xml).toContain('<ttl>60</ttl>')
      expect(xml).toContain('<atom:link href="https://cryptopulse.example.com/rss.xml" rel="self" type="application/rss+xml" />')
      expect(xml).toContain('<image>')
      expect(xml).toContain('<url>https://cryptopulse.example.com/images/og-default.jpg</url>')
    })
  })

  describe('escapeXml', () => {
    it('should escape XML special characters', () => {
      const input = 'Test & <script>alert("xss")</script> "quotes" \'apostrophes\''
      const expected = 'Test &amp; &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &quot;quotes&quot; &#39;apostrophes&#39;'
      
      expect(escapeXml(input)).toBe(expected)
    })

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('')
    })

    it('should handle string without special characters', () => {
      const input = 'Normal text without special characters'
      expect(escapeXml(input)).toBe(input)
    })
  })

  describe('validateRssItem', () => {
    it('should validate correct RSS item', () => {
      const validItem = {
        title: 'Test Article',
        link: 'https://example.com/article/',
        guid: 'https://example.com/article/',
        description: 'Test description',
        author: 'Test Author',
        pubDate: 'Wed, 10 Jan 2024 00:00:00 GMT',
        categories: ['test', 'article']
      }
      
      expect(validateRssItem(validItem)).toBe(true)
    })

    it('should reject item with missing required fields', () => {
      const invalidItem = {
        title: 'Test Article',
        link: 'https://example.com/article/',
        // Missing guid, description, pubDate
        author: 'Test Author',
        categories: ['test']
      } as any
      
      expect(validateRssItem(invalidItem)).toBe(false)
    })

    it('should reject item with invalid URL', () => {
      const invalidItem = {
        title: 'Test Article',
        link: 'not-a-valid-url',
        guid: 'https://example.com/article/',
        description: 'Test description',
        author: 'Test Author',
        pubDate: 'Wed, 10 Jan 2024 00:00:00 GMT',
        categories: ['test']
      }
      
      expect(validateRssItem(invalidItem)).toBe(false)
    })

    it('should reject item with invalid date', () => {
      const invalidItem = {
        title: 'Test Article',
        link: 'https://example.com/article/',
        guid: 'https://example.com/article/',
        description: 'Test description',
        author: 'Test Author',
        pubDate: 'invalid-date',
        categories: ['test']
      }
      
      expect(validateRssItem(invalidItem)).toBe(false)
    })

    it('should reject item with non-array categories', () => {
      const invalidItem = {
        title: 'Test Article',
        link: 'https://example.com/article/',
        guid: 'https://example.com/article/',
        description: 'Test description',
        author: 'Test Author',
        pubDate: 'Wed, 10 Jan 2024 00:00:00 GMT',
        categories: 'not-an-array'
      } as any
      
      expect(validateRssItem(invalidItem)).toBe(false)
    })
  })

  describe('getRssFeedMetadata', () => {
    it('should return correct metadata with articles', () => {
      const mockArticles = [
        {
          slug: 'latest-article',
          title: 'Latest Article',
          description: 'Most recent article',
          content: 'Content',
          author: 'Author',
          publishedAt: new Date('2024-01-12T00:00:00Z'),
          tags: ['latest'],
          heroImage: '/latest.jpg',
          readingTime: 3,
          featured: false
        }
      ]
      
      mockGetAllArticles.mockReturnValue(mockArticles)

      const metadata = getRssFeedMetadata()
      
      expect(metadata).toEqual({
        title: 'CryptoPulse',
        description: 'Test crypto news site',
        link: 'https://cryptopulse.example.com',
        language: 'en-us',
        managingEditor: 'CryptoPulse Team',
        webMaster: 'CryptoPulse Team',
        lastBuildDate: 'Fri, 12 Jan 2024 00:00:00 GMT',
        pubDate: 'Mon, 15 Jan 2024 10:00:00 GMT',
        ttl: 60,
        itemCount: 1,
        imageUrl: 'https://cryptopulse.example.com/images/og-default.jpg'
      })
    })

    it('should handle empty articles array', () => {
      mockGetAllArticles.mockReturnValue([])

      const metadata = getRssFeedMetadata()
      
      expect(metadata.itemCount).toBe(0)
      expect(metadata.lastBuildDate).toBe('Mon, 15 Jan 2024 10:00:00 GMT')
    })
  })
})