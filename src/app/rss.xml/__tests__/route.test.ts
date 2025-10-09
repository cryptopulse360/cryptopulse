import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../route'
import { getAllArticles } from '@/lib/mdx'

// Mock the MDX functions
vi.mock('@/lib/mdx', () => ({
  getAllArticles: vi.fn()
}))

// Mock the constants
vi.mock('@/lib/constants', () => ({
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

describe('RSS API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock current date to make tests deterministic
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return RSS XML with correct headers', async () => {
    mockGetAllArticles.mockReturnValue([])

    const response = await GET()
    
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml')
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600')
  })

  it('should generate valid RSS structure', async () => {
    mockGetAllArticles.mockReturnValue([])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('</channel>')
    expect(xml).toContain('</rss>')
  })

  it('should include RSS metadata', async () => {
    mockGetAllArticles.mockReturnValue([])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<title>CryptoPulse</title>')
    expect(xml).toContain('<link>https://cryptopulse.example.com</link>')
    expect(xml).toContain('<description>Test crypto news site</description>')
    expect(xml).toContain('<language>en-us</language>')
    expect(xml).toContain('<managingEditor>CryptoPulse Team</managingEditor>')
    expect(xml).toContain('<webMaster>CryptoPulse Team</webMaster>')
    expect(xml).toContain('<ttl>60</ttl>')
    expect(xml).toContain('<atom:link href="https://cryptopulse.example.com/rss.xml" rel="self" type="application/rss+xml" />')
  })

  it('should include RSS image', async () => {
    mockGetAllArticles.mockReturnValue([])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<image>')
    expect(xml).toContain('<url>https://cryptopulse.example.com/images/og-default.jpg</url>')
    expect(xml).toContain('<title>CryptoPulse</title>')
    expect(xml).toContain('<link>https://cryptopulse.example.com</link>')
    expect(xml).toContain('<width>144</width>')
    expect(xml).toContain('<height>144</height>')
    expect(xml).toContain('</image>')
  })

  it('should include article items', async () => {
    const mockArticles = [
      {
        slug: 'bitcoin-news',
        title: 'Bitcoin & Market News',
        description: 'Latest Bitcoin news with <special> characters',
        content: 'Article content here',
        author: 'John Crypto',
        publishedAt: new Date('2024-01-10T00:00:00Z'),
        tags: ['bitcoin', 'news'],
        heroImage: '/bitcoin.jpg',
        readingTime: 5,
        featured: true
      },
      {
        slug: 'ethereum-update',
        title: 'Ethereum Update',
        description: 'Ethereum network developments',
        content: 'Ethereum content',
        author: 'Jane Blockchain',
        publishedAt: new Date('2024-01-08T00:00:00Z'),
        tags: ['ethereum'],
        heroImage: '/ethereum.jpg',
        readingTime: 3,
        featured: false
      }
    ]
    
    mockGetAllArticles.mockReturnValue(mockArticles)

    const response = await GET()
    const xml = await response.text()
    
    // Check first article
    expect(xml).toContain('<item>')
    expect(xml).toContain('<title>Bitcoin &amp; Market News</title>')
    expect(xml).toContain('<link>https://cryptopulse.example.com/articles/bitcoin-news/</link>')
    expect(xml).toContain('<guid isPermaLink="true">https://cryptopulse.example.com/articles/bitcoin-news/</guid>')
    expect(xml).toContain('<description>Latest Bitcoin news with &lt;special&gt; characters</description>')
    expect(xml).toContain('<author>CryptoPulse Team (John Crypto)</author>')
    expect(xml).toContain('<pubDate>Wed, 10 Jan 2024 00:00:00 GMT</pubDate>')
    expect(xml).toContain('<category>bitcoin</category>')
    expect(xml).toContain('<category>news</category>')
    
    // Check second article
    expect(xml).toContain('<title>Ethereum Update</title>')
    expect(xml).toContain('<link>https://cryptopulse.example.com/articles/ethereum-update/</link>')
    expect(xml).toContain('<category>ethereum</category>')
  })

  it('should escape XML special characters', async () => {
    const mockArticles = [
      {
        slug: 'special-chars',
        title: 'Article with & < > " \' characters',
        description: 'Description with <script>alert("xss")</script>',
        content: 'Content',
        author: 'Test & Author',
        publishedAt: new Date('2024-01-10T00:00:00Z'),
        tags: ['test & tag'],
        heroImage: '/test.jpg',
        readingTime: 2,
        featured: false
      }
    ]
    
    mockGetAllArticles.mockReturnValue(mockArticles)

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<title>Article with &amp; &lt; &gt; &quot; &#39; characters</title>')
    expect(xml).toContain('<description>Description with &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</description>')
    expect(xml).toContain('<author>CryptoPulse Team (Test &amp; Author)</author>')
    expect(xml).toContain('<category>test &amp; tag</category>')
  })

  it('should handle empty articles array', async () => {
    mockGetAllArticles.mockReturnValue([])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<channel>')
    expect(xml).toContain('<title>CryptoPulse</title>')
    expect(xml).not.toContain('<item>')
    expect(xml).toContain('</channel>')
  })

  it('should use latest article date for lastBuildDate', async () => {
    const mockArticles = [
      {
        slug: 'latest-article',
        title: 'Latest Article',
        description: 'Most recent',
        content: 'Content',
        author: 'Author',
        publishedAt: new Date('2024-01-12T00:00:00Z'),
        tags: ['latest'],
        heroImage: '/latest.jpg',
        readingTime: 3,
        featured: false
      },
      {
        slug: 'older-article',
        title: 'Older Article',
        description: 'Older content',
        content: 'Content',
        author: 'Author',
        publishedAt: new Date('2024-01-08T00:00:00Z'),
        tags: ['old'],
        heroImage: '/old.jpg',
        readingTime: 2,
        featured: false
      }
    ]
    
    mockGetAllArticles.mockReturnValue(mockArticles)

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<lastBuildDate>Fri, 12 Jan 2024 00:00:00 GMT</lastBuildDate>')
  })

  it('should handle errors gracefully', async () => {
    mockGetAllArticles.mockImplementation(() => {
      throw new Error('Test error')
    })

    const response = await GET()
    
    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Error generating RSS feed')
  })

  it('should include proper RSS dates', async () => {
    mockGetAllArticles.mockReturnValue([])

    const response = await GET()
    const xml = await response.text()
    
    expect(xml).toContain('<pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>')
    expect(xml).toContain('<lastBuildDate>Mon, 15 Jan 2024 10:00:00 GMT</lastBuildDate>')
  })
})