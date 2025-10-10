import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildOGImages, cleanOGImages, staticOGImageExists } from '../build-og-images';
import { generateArticleOGImage, generatePageOGImage } from '../og-image';
import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Article } from '@/types/article';
import fs from 'fs/promises';
import path from 'path';

// Mock dependencies
vi.mock('../mdx', () => ({
  getAllArticles: vi.fn(() => Promise.resolve([
    {
      slug: 'test-bitcoin-analysis',
      title: 'Bitcoin Market Analysis 2024',
      description: 'Comprehensive analysis of Bitcoin market trends and future predictions',
      author: 'Crypto Expert',
      tags: ['bitcoin', 'analysis', 'market'],
      publishedAt: new Date('2024-01-01'),
      content: 'Test content',
      heroImage: '/images/bitcoin.jpg',
      readingTime: 5,
      featured: true,
      category: 'analysis',
    },
  ])),
}));

vi.mock('../constants', () => ({
  siteConfig: {
    name: 'CryptoPulse',
    description: 'Your trusted source for cryptocurrency news',
    url: 'https://cryptopulse.news',
    author: 'CryptoPulse Team',
    seo: {
      defaultImage: '/images/default-og.jpg',
      twitterHandle: '@cryptopulse',
    },
    social: {
      twitter: 'https://twitter.com/cryptopulse',
      github: 'https://github.com/cryptopulse',
    },
  },
}));

describe('OG Image End-to-End Integration', () => {
  const testOGDir = path.join(process.cwd(), 'public', 'images', 'og-test');
  
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Create test directory
    await fs.mkdir(testOGDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      const files = await fs.readdir(testOGDir);
      for (const file of files) {
        await fs.unlink(path.join(testOGDir, file));
      }
      await fs.rmdir(testOGDir);
    } catch {
      // Directory might not exist
    }
  });

  describe('Complete OG Image Workflow', () => {
    it('should generate OG images and integrate with SEO metadata', async () => {
      // Mock the original NODE_ENV
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const mockArticle: Article = {
        slug: 'test-bitcoin-analysis',
        title: 'Bitcoin Market Analysis 2024',
        description: 'Comprehensive analysis of Bitcoin market trends',
        author: 'Crypto Expert',
        tags: ['bitcoin', 'analysis', 'market'],
        publishedAt: new Date('2024-01-01'),
        content: 'Test content',
        heroImage: '/images/bitcoin.jpg',
        readingTime: 5,
        featured: true,
        category: 'analysis',
      };

      // Test OG image URL generation for articles
      const articleOGUrl = generateArticleOGImage(mockArticle);
      expect(articleOGUrl).toContain('/api/og');
      expect(articleOGUrl).toContain('title=Bitcoin+Market+Analysis+2024');
      expect(articleOGUrl).toContain('tags=bitcoin%2Canalysis%2Cmarket');

      // Test OG image URL generation for pages
      const pageOGUrl = generatePageOGImage('Home Page', 'Welcome to CryptoPulse');
      expect(pageOGUrl).toContain('/api/og');
      expect(pageOGUrl).toContain('title=Home+Page');
      expect(pageOGUrl).toContain('description=Welcome+to+CryptoPulse');

      // Test SEO metadata integration
      const seoMetadata = generateSEOMetadata({
        title: 'Bitcoin Analysis',
        description: 'Market analysis',
        article: mockArticle,
        type: 'article',
      });

      expect(seoMetadata.openGraph?.images).toBeDefined();
      if (Array.isArray(seoMetadata.openGraph?.images)) {
        expect(seoMetadata.openGraph.images[0]).toMatchObject({
          url: expect.stringContaining('/api/og'),
          width: 1200,
          height: 630,
          alt: expect.any(String),
        });
      }

      expect(seoMetadata.twitter?.images).toBeDefined();
      if (Array.isArray(seoMetadata.twitter?.images)) {
        expect(seoMetadata.twitter.images[0]).toContain('/api/og');
      }

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle production mode with static images', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const mockArticle: Article = {
        slug: 'ethereum-defi-guide',
        title: 'Complete Guide to Ethereum DeFi',
        description: 'Everything you need to know about DeFi',
        author: 'DeFi Expert',
        tags: ['ethereum', 'defi'],
        publishedAt: new Date('2024-01-01'),
        content: 'Test content',
        heroImage: '/images/ethereum.jpg',
        readingTime: 8,
        featured: false,
        category: 'guide',
      };

      // In production, should use static image paths
      const articleOGUrl = generateArticleOGImage(mockArticle);
      expect(articleOGUrl).toContain('/images/og/ethereum-defi-guide.svg');
      expect(articleOGUrl).not.toContain('/api/og');

      process.env.NODE_ENV = originalEnv;
    });

    it('should validate OG image parameters correctly', async () => {
      const { validateOGImageParams } = await import('../og-image');

      // Valid parameters
      const validParams = new URLSearchParams({
        title: 'Valid Title',
        description: 'Valid description under 200 chars',
        author: 'Valid Author',
        tags: 'tag1,tag2,tag3',
      });

      const validResult = validateOGImageParams(validParams);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Invalid parameters - title too long
      const invalidParams = new URLSearchParams({
        title: 'a'.repeat(101),
        description: 'a'.repeat(201),
        author: 'a'.repeat(51),
        tags: 'tag1,tag2,tag3,tag4,tag5,tag6',
      });

      const invalidResult = validateOGImageParams(invalidParams);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
      expect(invalidResult.errors).toContain('Title must be 100 characters or less');
      expect(invalidResult.errors).toContain('Description must be 200 characters or less');
      expect(invalidResult.errors).toContain('Author name must be 50 characters or less');
      expect(invalidResult.errors).toContain('Maximum 5 tags allowed');
    });

    it('should handle special characters in OG image content', async () => {
      const mockArticle: Article = {
        slug: 'bitcoin-ethereum-comparison',
        title: 'Bitcoin & Ethereum: A Detailed Comparison (2024)',
        description: 'Comparing BTC vs ETH - which is better?',
        author: 'John "Crypto" Smith',
        tags: ['bitcoin', 'ethereum', 'comparison'],
        publishedAt: new Date('2024-01-01'),
        content: 'Test content',
        heroImage: '/images/comparison.jpg',
        readingTime: 10,
        featured: true,
        category: 'comparison',
      };

      const articleOGUrl = generateArticleOGImage(mockArticle);
      
      // Should properly encode special characters
      expect(articleOGUrl).toContain('Bitcoin+%26+Ethereum');
      expect(articleOGUrl).toContain('John+%22Crypto%22+Smith');
    });

    it('should generate fallback images when errors occur', async () => {
      const { getFallbackOGImage } = await import('../og-image');

      const fallbackUrl = getFallbackOGImage();
      expect(fallbackUrl).toContain('/api/og');
      expect(fallbackUrl).toContain('title=CryptoPulse');
    });
  });

  describe('Build Process Integration', () => {
    it('should integrate with Next.js build process', async () => {
      // Test that the build script can be called
      expect(typeof buildOGImages).toBe('function');
      expect(typeof cleanOGImages).toBe('function');
      expect(typeof staticOGImageExists).toBe('function');
    });

    it('should handle missing articles gracefully', async () => {
      // Mock empty articles array
      const { getAllArticles } = await import('../mdx');
      vi.mocked(getAllArticles).mockResolvedValueOnce([]);

      // Should not throw error
      await expect(buildOGImages()).resolves.toBeUndefined();
    });
  });

  describe('Social Media Compatibility', () => {
    it('should generate metadata compatible with major social platforms', async () => {
      const mockArticle: Article = {
        slug: 'crypto-market-update',
        title: 'Crypto Market Update: Bull Run Continues',
        description: 'Latest updates on the cryptocurrency market trends',
        author: 'Market Analyst',
        tags: ['market', 'trends', 'analysis'],
        publishedAt: new Date('2024-01-01'),
        content: 'Test content',
        heroImage: '/images/market.jpg',
        readingTime: 6,
        featured: true,
        category: 'market',
      };

      const seoMetadata = generateSEOMetadata({
        title: 'Crypto Market Update',
        description: 'Market analysis',
        article: mockArticle,
        type: 'article',
      });

      // Check Open Graph metadata
      expect(seoMetadata.openGraph).toMatchObject({
        title: 'Crypto Market Update | CryptoPulse',
        description: 'Market analysis',
        type: 'article',
        siteName: 'CryptoPulse',
        locale: 'en_US',
      });

      // Check Twitter metadata
      expect(seoMetadata.twitter).toMatchObject({
        card: 'summary_large_image',
        title: 'Crypto Market Update | CryptoPulse',
        description: 'Market analysis',
        site: '@cryptopulse',
        creator: '@cryptopulse',
      });

      // Check image dimensions
      if (Array.isArray(seoMetadata.openGraph?.images)) {
        expect(seoMetadata.openGraph.images[0]).toMatchObject({
          width: 1200,
          height: 630,
        });
      }
    });
  });
});