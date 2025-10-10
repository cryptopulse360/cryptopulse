import { describe, it, expect, beforeEach } from 'vitest';
import { Article } from '@/types';
import {
  generateSEOMetadata,
  generateArticleStructuredData,
  generateWebsiteStructuredData,
  generateBreadcrumbStructuredData,
  generateCanonicalUrl,
} from '../SEOHead';

describe('SEOHead', () => {
  const mockArticle: Article = {
    slug: 'test-article',
    title: 'Test Article Title',
    description: 'Test article description for SEO testing',
    content: '<p>This is test content for the article.</p>',
    author: 'Test Author',
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T10:00:00Z'),
    tags: ['bitcoin', 'cryptocurrency', 'analysis'],
    heroImage: '/images/test-hero.jpg',
    readingTime: 5,
    featured: true,
    category: 'analysis',
  };

  describe('generateSEOMetadata', () => {
    it('should generate basic metadata with defaults', () => {
      const metadata = generateSEOMetadata({});
      
      expect(metadata.title).toBe('CryptoPulse');
      expect(metadata.description).toContain('Crypto News');
      expect(metadata.openGraph?.type).toBe('website');
      expect(metadata.twitter?.card).toBe('summary_large_image');
    });

    it('should generate metadata with custom title and description', () => {
      const metadata = generateSEOMetadata({
        title: 'Custom Title',
        description: 'Custom description',
      });
      
      expect(metadata.title).toBe('Custom Title | CryptoPulse');
      expect(metadata.description).toBe('Custom description');
    });

    it('should generate article metadata', () => {
      const metadata = generateSEOMetadata({
        title: mockArticle.title,
        description: mockArticle.description,
        type: 'article',
        article: mockArticle,
      });
      
      expect(metadata.title).toBe('Test Article Title | CryptoPulse');
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-15T10:00:00.000Z');
      expect(metadata.openGraph?.modifiedTime).toBe('2024-01-16T10:00:00.000Z');
      expect(metadata.openGraph?.authors).toEqual(['Test Author']);
      expect(metadata.openGraph?.tags).toEqual(['bitcoin', 'cryptocurrency', 'analysis']);
      expect(metadata.keywords).toEqual(['bitcoin', 'cryptocurrency', 'analysis']);
    });

    it('should handle custom image URLs', () => {
      const metadata = generateSEOMetadata({
        image: 'https://example.com/custom-image.jpg',
      });
      
      expect(metadata.openGraph?.images?.[0]?.url).toBe('https://example.com/custom-image.jpg');
      expect(metadata.twitter?.images).toEqual(['https://example.com/custom-image.jpg']);
    });

    it('should handle relative image URLs', () => {
      const metadata = generateSEOMetadata({
        image: '/images/custom-image.jpg',
      });
      
      expect(metadata.openGraph?.images?.[0]?.url).toBe('https://cryptopulse.github.io/images/custom-image.jpg');
    });

    it('should set noindex when specified', () => {
      const metadata = generateSEOMetadata({
        noIndex: true,
      });
      
      expect(metadata.robots).toEqual({ index: false, follow: false });
    });

    it('should set canonical URL when specified', () => {
      const metadata = generateSEOMetadata({
        canonical: 'https://example.com/canonical-url',
      });
      
      expect(metadata.alternates?.canonical).toBe('https://example.com/canonical-url');
    });
  });

  describe('generateArticleStructuredData', () => {
    it('should generate valid article structured data', () => {
      const url = 'https://cryptopulse.github.io/articles/test-article';
      const structuredData = generateArticleStructuredData(mockArticle, url);
      
      expect(structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Test Article Title',
        description: 'Test article description for SEO testing',
        image: 'https://cryptopulse.github.io/images/test-hero.jpg',
        author: {
          '@type': 'Person',
          name: 'Test Author',
        },
        publisher: {
          '@type': 'Organization',
          name: 'CryptoPulse',
          logo: {
            '@type': 'ImageObject',
            url: 'https://cryptopulse.github.io/images/logo.png',
          },
        },
        datePublished: '2024-01-15T10:00:00.000Z',
        dateModified: '2024-01-16T10:00:00.000Z',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        keywords: 'bitcoin, cryptocurrency, analysis',
        articleSection: 'analysis',
        wordCount: 7,
        timeRequired: 'PT5M',
      });
    });

    it('should handle absolute image URLs', () => {
      const articleWithAbsoluteImage = {
        ...mockArticle,
        heroImage: 'https://example.com/hero.jpg',
      };
      
      const structuredData = generateArticleStructuredData(
        articleWithAbsoluteImage,
        'https://example.com/article'
      );
      
      expect(structuredData).toMatchObject({
        image: 'https://example.com/hero.jpg',
      });
    });

    it('should handle articles without updatedAt', () => {
      const articleWithoutUpdate = {
        ...mockArticle,
        updatedAt: undefined,
      };
      
      const structuredData = generateArticleStructuredData(
        articleWithoutUpdate,
        'https://example.com/article'
      );
      
      expect(structuredData).not.toHaveProperty('dateModified');
      expect(structuredData).toHaveProperty('datePublished');
    });
  });

  describe('generateWebsiteStructuredData', () => {
    it('should generate valid website structured data', () => {
      const structuredData = generateWebsiteStructuredData();
      
      expect(structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CryptoPulse',
        description: 'Your Premier Source for Crypto News and Analysis',
        url: 'https://cryptopulse.github.io',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://cryptopulse.github.io/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@type': 'Organization',
          name: 'CryptoPulse',
          logo: {
            '@type': 'ImageObject',
            url: 'https://cryptopulse.github.io/images/logo.png',
          },
          sameAs: [
            'https://twitter.com/cryptopulse360',
            'https://github.com/cryptopulse360/cryptopulse',
            'https://www.linkedin.com/company/cryptopulse360',
          ],
        },
      });
    });
  });

  describe('generateBreadcrumbStructuredData', () => {
    it('should generate valid breadcrumb structured data', () => {
      const breadcrumbItems = [
        { name: 'Home', url: 'https://cryptopulse.github.io' },
        { name: 'Articles', url: 'https://cryptopulse.github.io/articles' },
        { name: 'Test Article', url: 'https://cryptopulse.github.io/articles/test-article' },
      ];
      
      const structuredData = generateBreadcrumbStructuredData(breadcrumbItems);
      
      expect(structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://cryptopulse.github.io',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Articles',
            item: 'https://cryptopulse.github.io/articles',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Test Article',
            item: 'https://cryptopulse.github.io/articles/test-article',
          },
        ],
      });
    });

    it('should handle empty breadcrumb items', () => {
      const structuredData = generateBreadcrumbStructuredData([]);
      
      expect(structuredData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [],
      });
    });
  });

  describe('generateCanonicalUrl', () => {
    it('should generate canonical URL with leading slash', () => {
      const url = generateCanonicalUrl('/articles/test-article');
      expect(url).toBe('https://cryptopulse.github.io/articles/test-article');
    });

    it('should generate canonical URL without leading slash', () => {
      const url = generateCanonicalUrl('articles/test-article');
      expect(url).toBe('https://cryptopulse.github.io/articles/test-article');
    });

    it('should handle root path', () => {
      const url = generateCanonicalUrl('/');
      expect(url).toBe('https://cryptopulse.github.io/');
    });

    it('should handle empty path', () => {
      const url = generateCanonicalUrl('');
      expect(url).toBe('https://cryptopulse.github.io/');
    });
  });
});