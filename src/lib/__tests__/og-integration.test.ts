import { describe, it, expect, vi } from 'vitest';
import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Article } from '@/types/article';

// Mock the og-image module
vi.mock('../og-image', () => ({
  generateArticleOGImage: vi.fn((article: Article) => 
    `http://localhost:3000/api/og?title=${encodeURIComponent(article.title)}`
  ),
  generatePageOGImage: vi.fn((title: string, description?: string) => 
    `http://localhost:3000/api/og?title=${encodeURIComponent(title)}${description ? `&description=${encodeURIComponent(description)}` : ''}`
  ),
  getFallbackOGImage: vi.fn(() => 
    'http://localhost:3000/api/og?title=CryptoPulse'
  ),
}));

describe('OG Image Integration', () => {
  const mockArticle: Article = {
    slug: 'test-article',
    title: 'Test Bitcoin Article',
    description: 'A test article about Bitcoin',
    content: 'Test content',
    author: 'John Doe',
    publishedAt: new Date('2024-01-01'),
    tags: ['bitcoin', 'crypto'],
    heroImage: '/images/test.jpg',
    readingTime: 5,
    featured: false,
    category: 'analysis',
  };

  it('should use generated OG image in SEO metadata for articles', () => {
    const metadata = generateSEOMetadata({
      title: 'Test Article',
      description: 'Test description',
      article: mockArticle,
      type: 'article',
    });

    expect(metadata.openGraph?.images).toBeDefined();
    if (Array.isArray(metadata.openGraph?.images)) {
      expect(metadata.openGraph.images[0]).toMatchObject({
        url: expect.stringContaining('/api/og'),
        width: 1200,
        height: 630,
        alt: 'Test Article',
      });
    }
  });

  it('should use generated OG image in Twitter metadata for articles', () => {
    const metadata = generateSEOMetadata({
      title: 'Test Article',
      description: 'Test description',
      article: mockArticle,
      type: 'article',
    });

    expect(metadata.twitter?.images).toBeDefined();
    if (Array.isArray(metadata.twitter?.images)) {
      expect(metadata.twitter.images[0]).toContain('/api/og');
    }
  });

  it('should handle pages without articles', () => {
    const metadata = generateSEOMetadata({
      title: 'Home Page',
      description: 'Home page description',
      type: 'website',
    });

    expect(metadata.openGraph?.images).toBeDefined();
    if (Array.isArray(metadata.openGraph?.images)) {
      expect(metadata.openGraph.images[0]).toMatchObject({
        url: expect.any(String),
        width: 1200,
        height: 630,
        alt: 'Home Page',
      });
    }
  });

  it('should use custom image when provided', () => {
    const customImage = '/images/custom-og.jpg';
    
    const metadata = generateSEOMetadata({
      title: 'Custom Page',
      description: 'Custom description',
      image: customImage,
      type: 'website',
    });

    expect(metadata.openGraph?.images).toBeDefined();
    if (Array.isArray(metadata.openGraph?.images)) {
      expect(metadata.openGraph.images[0]).toMatchObject({
        url: expect.stringContaining(customImage),
        width: 1200,
        height: 630,
        alt: 'Custom Page',
      });
    }
  });
});