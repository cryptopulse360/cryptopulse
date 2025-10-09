import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateSitemapUrls, generateSitemapXml, validateSitemapUrl } from '../sitemap'
import { getAllArticles, getAllTags } from '../mdx'
import { afterEach } from 'node:test'

// Mock the MDX functions
vi.mock('../mdx', () => ({
  getAllArticles: vi.fn(),
  getAllTags: vi.fn()
}))

// Mock the constants
vi.mock('../constants', () => ({
  siteConfig: {
    url: 'https://cryptopulse.example.com',
    name: 'CryptoPulse',
    description: 'Test description'
  }
}))

const mockGetAllArticles = vi.mocked(getAllArticles)
const mockGetAllTags = vi.mocked(getAllTags)

describe('Sitemap Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock current date to make tests deterministic
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('generateSitemapUrls', () => {
    it('should generate URLs for static pages', () => {
      mockGetAllArticles.mockReturnValue([])
      mockGetAllTags.mockReturnValue([])

      const urls = generateSitemapUrls()
      
      expect(urls).toContainEqual({
        url: 'https://cryptopulse.example.com',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'daily',
        priority: '1.0'
      })
      
      expect(urls).toContainEqual({
        url: 'https://cryptopulse.example.com/articles/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'daily',
        priority: '0.9'
      })
    })

    it('should generate URLs for articles', () => {
      const mockArticles = [
        {
          slug: 'test-article',
          title: 'Test Article',
          description: 'Test description',
          content: 'Test content',
          author: 'Test Author',
          publishedAt: new Date('2024-01-10T00:00:00Z'),
          updatedAt: new Date('2024-01-12T00:00:00Z'),
          tags: ['test'],
          heroImage: '/test.jpg',
          readingTime: 5,
          featured: true
        }
      ]
      
      mockGetAllArticles.mockReturnValue(mockArticles)
      mockGetAllTags.mockReturnValue(['test'])

      const urls = generateSitemapUrls()
      
      expect(urls).toContainEqual({
        url: 'https://cryptopulse.example.com/articles/test-article/',
        lastmod: '2024-01-12T00:00:00.000Z',
        changefreq: 'monthly',
        priority: '0.9' // Featured article
      })
    })

    it('should use publishedAt when updatedAt is not available', () => {
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
      mockGetAllTags.mockReturnValue(['test'])

      const urls = generateSitemapUrls()
      
      expect(urls).toContainEqual({
        url: 'https://cryptopulse.example.com/articles/test-article/',
        lastmod: '2024-01-10T00:00:00.000Z',
        changefreq: 'monthly',
        priority: '0.8' // Non-featured article
      })
    })

    it('should generate URLs for tag pages', () => {
      mockGetAllArticles.mockReturnValue([])
      mockGetAllTags.mockReturnValue(['bitcoin', 'ethereum', 'defi'])

      const urls = generateSitemapUrls()
      
      expect(urls).toContainEqual({
        url: 'https://cryptopulse.example.com/tags/bitcoin/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'weekly',
        priority: '0.7'
      })
      
      expect(urls).toContainEqual({
        url: 'https://cryptopulse.example.com/tags/ethereum/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'weekly',
        priority: '0.7'
      })
    })

    it('should handle special characters in tag names', () => {
      mockGetAllArticles.mockReturnValue([])
      mockGetAllTags.mockReturnValue(['defi & nft', 'crypto/trading'])

      const urls = generateSitemapUrls()
      
      expect(urls).toContainEqual({
        url: 'https://cryptopulse.example.com/tags/defi%20%26%20nft/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'weekly',
        priority: '0.7'
      })
    })
  })

  describe('generateSitemapXml', () => {
    it('should generate valid XML sitemap', () => {
      mockGetAllArticles.mockReturnValue([])
      mockGetAllTags.mockReturnValue([])

      const xml = generateSitemapXml()
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
      expect(xml).toContain('</urlset>')
      expect(xml).toContain('<loc>https://cryptopulse.example.com</loc>')
    })

    it('should include all URL elements', () => {
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
      mockGetAllTags.mockReturnValue(['test'])

      const xml = generateSitemapXml()
      
      expect(xml).toContain('<loc>https://cryptopulse.example.com/articles/test-article/</loc>')
      expect(xml).toContain('<lastmod>2024-01-10T00:00:00.000Z</lastmod>')
      expect(xml).toContain('<changefreq>monthly</changefreq>')
      expect(xml).toContain('<priority>0.8</priority>')
    })
  })

  describe('validateSitemapUrl', () => {
    it('should validate correct sitemap URL', () => {
      const validUrl = {
        url: 'https://example.com/page/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'daily' as const,
        priority: '0.8'
      }
      
      expect(validateSitemapUrl(validUrl)).toBe(true)
    })

    it('should reject URL with missing fields', () => {
      const invalidUrl = {
        url: 'https://example.com/page/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'daily' as const
        // Missing priority
      } as any
      
      expect(validateSitemapUrl(invalidUrl)).toBe(false)
    })

    it('should reject invalid URL format', () => {
      const invalidUrl = {
        url: 'not-a-valid-url',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'daily' as const,
        priority: '0.8'
      }
      
      expect(validateSitemapUrl(invalidUrl)).toBe(false)
    })

    it('should reject invalid date format', () => {
      const invalidUrl = {
        url: 'https://example.com/page/',
        lastmod: 'invalid-date',
        changefreq: 'daily' as const,
        priority: '0.8'
      }
      
      expect(validateSitemapUrl(invalidUrl)).toBe(false)
    })

    it('should reject invalid changefreq value', () => {
      const invalidUrl = {
        url: 'https://example.com/page/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'invalid' as any,
        priority: '0.8'
      }
      
      expect(validateSitemapUrl(invalidUrl)).toBe(false)
    })

    it('should reject invalid priority value', () => {
      const invalidUrl = {
        url: 'https://example.com/page/',
        lastmod: '2024-01-15T10:00:00.000Z',
        changefreq: 'daily' as const,
        priority: '1.5' // Out of range
      }
      
      expect(validateSitemapUrl(invalidUrl)).toBe(false)
    })
  })
})