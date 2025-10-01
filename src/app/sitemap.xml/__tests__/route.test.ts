import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../route'
import { getAllArticles, getAllTags } from '@/lib/mdx'

// Mock the MDX functions
vi.mock('@/lib/mdx', () => ({
  getAllArticles: vi.fn(),
  getAllTags: vi.fn()
}))

// Mock the constants
vi.mock('@/lib/constants', () => ({
  siteConfig: {
    url: 'https://cryptopulse.example.com',
    name: 'CryptoPulse',
    description: 'Test description'
  }
}))

const mockGetAllArticles = vi.mocked(getAllArticles)
const mockGetAllTags = vi.mocked(getAllTags)

describe('Sitemap API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock current date to make tests deterministic
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return XML sitemap with correct headers', async () => {
    mockGetAllArticles.mockReturnValue([])
    mockGetAllTags.mockReturnValue([])

    const response = await GET()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/xml')
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600')
  })

  it('should include static pages in sitemap', async () => {
    mockGetAllArticles.mockReturnValue([])
    mockGetAllTags.mockReturnValue([])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain('<loc>https://cryptopulse.example.com</loc>')
    expect(xml).toContain('<loc>https://cryptopulse.example.com/articles/</loc>')
    expect(xml).toContain('<loc>https://cryptopulse.example.com/tags/</loc>')
    expect(xml).toContain('<priority>1.0</priority>')
  })

  it('should include article pages in sitemap', async () => {
    const mockArticles = [
      {
        slug: 'bitcoin-analysis',
        title: 'Bitcoin Analysis',
        description: 'Analysis of Bitcoin',
        content: 'Content here',
        author: 'Crypto Expert',
        publishedAt: new Date('2024-01-10T00:00:00Z'),
        updatedAt: new Date('2024-01-12T00:00:00Z'),
        tags: ['bitcoin'],
        heroImage: '/bitcoin.jpg',
        readingTime: 5,
        featured: true
      }
    ]
    
    mockGetAllArticles.mockReturnValue(mockArticles)
    mockGetAllTags.mockReturnValue(['bitcoin'])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<loc>https://cryptopulse.example.com/articles/bitcoin-analysis/</loc>')
    expect(xml).toContain('<lastmod>2024-01-12T00:00:00.000Z</lastmod>')
    expect(xml).toContain('<changefreq>monthly</changefreq>')
    expect(xml).toContain('<priority>0.9</priority>') // Featured article
  })

  it('should include tag pages in sitemap', async () => {
    mockGetAllArticles.mockReturnValue([])
    mockGetAllTags.mockReturnValue(['bitcoin', 'ethereum', 'defi'])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<loc>https://cryptopulse.example.com/tags/bitcoin/</loc>')
    expect(xml).toContain('<loc>https://cryptopulse.example.com/tags/ethereum/</loc>')
    expect(xml).toContain('<loc>https://cryptopulse.example.com/tags/defi/</loc>')
  })

  it('should handle special characters in tag names', async () => {
    mockGetAllArticles.mockReturnValue([])
    mockGetAllTags.mockReturnValue(['defi & nft'])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<loc>https://cryptopulse.example.com/tags/defi%20%26%20nft/</loc>')
  })

  it('should handle errors gracefully', async () => {
    mockGetAllArticles.mockImplementation(() => {
      throw new Error('Test error')
    })

    const response = await GET()
    
    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Error generating sitemap')
  })

  it('should use publishedAt when updatedAt is not available', async () => {
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

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<lastmod>2024-01-10T00:00:00.000Z</lastmod>')
    expect(xml).toContain('<priority>0.8</priority>') // Non-featured article
  })

  it('should generate valid XML structure', async () => {
    mockGetAllArticles.mockReturnValue([])
    mockGetAllTags.mockReturnValue([])

    const response = await GET()
    const xml = await response.text()
    
    // Check XML structure
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain('</urlset>')
    
    // Check that each URL has required elements
    const urlMatches = xml.match(/<url>[\s\S]*?<\/url>/g)
    if (urlMatches) {
      urlMatches.forEach(urlBlock => {
        expect(urlBlock).toContain('<loc>')
        expect(urlBlock).toContain('<lastmod>')
        expect(urlBlock).toContain('<changefreq>')
        expect(urlBlock).toContain('<priority>')
      })
    }
  })
})