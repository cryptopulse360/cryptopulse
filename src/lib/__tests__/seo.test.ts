import { describe, it, expect } from 'vitest';
import { Article } from '@/types';
import {
  generateOGImageUrl,
  generateMetaDescription,
  generateKeywords,
  getTwitterCardType,
  cleanCanonicalUrl,
  generateRobotsContent,
  generateHreflangLinks,
  calculateReadingTimeForSEO,
  generateArticleUrl,
  generateTagUrl,
} from '../seo';

describe('SEO utilities', () => {
  const mockArticle: Article = {
    slug: 'test-article',
    title: 'Test Article Title',
    description: 'Test article description for SEO testing',
    content: '<p>This is test content for the article. It has multiple sentences and should be long enough to test truncation functionality.</p>',
    author: 'Test Author',
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    tags: ['bitcoin', 'cryptocurrency', 'analysis'],
    heroImage: '/images/test-hero.jpg',
    readingTime: 5,
    featured: true,
    category: 'analysis',
  };

  describe('generateOGImageUrl', () => {
    it('should return absolute URL as-is', () => {
      const articleWithAbsoluteImage = {
        ...mockArticle,
        heroImage: 'https://example.com/hero.jpg',
      };
      
      const url = generateOGImageUrl(articleWithAbsoluteImage);
      expect(url).toBe('https://example.com/hero.jpg');
    });

    it('should convert relative URL to absolute', () => {
      const url = generateOGImageUrl(mockArticle);
      expect(url).toBe('https://cryptopulse.github.io/images/test-hero.jpg');
    });

    it('should handle empty hero image', () => {
      const articleWithoutImage = {
        ...mockArticle,
        heroImage: '',
      };
      
      const url = generateOGImageUrl(articleWithoutImage);
      expect(url).toBe('https://cryptopulse.github.io/images/og-default.jpg');
    });
  });

  describe('generateMetaDescription', () => {
    it('should return description if within length limit', () => {
      const description = generateMetaDescription(mockArticle, 200);
      expect(description).toBe('Test article description for SEO testing');
    });

    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(200);
      const articleWithLongDesc = {
        ...mockArticle,
        description: longDescription,
      };
      
      const description = generateMetaDescription(articleWithLongDesc, 100);
      expect(description.length).toBeLessThanOrEqual(103); // 100 + "..."
      expect(description).toMatch(/\.\.\.$/);
    });

    it('should extract from content if no description', () => {
      const articleWithoutDesc = {
        ...mockArticle,
        description: '',
      };
      
      const description = generateMetaDescription(articleWithoutDesc, 100);
      expect(description).toContain('This is test content');
      expect(description).not.toContain('<p>');
    });

    it('should truncate at word boundary', () => {
      const articleWithLongContent = {
        ...mockArticle,
        description: '',
        content: 'This is a very long sentence that should be truncated at a word boundary and not in the middle of a word',
      };
      
      const description = generateMetaDescription(articleWithLongContent, 50);
      expect(description).toContain('...');
      expect(description.length).toBeLessThanOrEqual(53); // 50 + "..."
    });
  });

  describe('generateKeywords', () => {
    it('should combine base keywords with article tags', () => {
      const keywords = generateKeywords(mockArticle);
      
      expect(keywords).toContain('cryptocurrency');
      expect(keywords).toContain('bitcoin');
      expect(keywords).toContain('analysis');
      expect(keywords).toContain('blockchain');
    });

    it('should include category as keyword', () => {
      const keywords = generateKeywords(mockArticle);
      expect(keywords).toContain('analysis');
    });

    it('should deduplicate keywords', () => {
      const articleWithDuplicateTags = {
        ...mockArticle,
        tags: ['bitcoin', 'bitcoin', 'cryptocurrency'],
        category: 'bitcoin',
      };
      
      const keywords = generateKeywords(articleWithDuplicateTags);
      const bitcoinCount = keywords.filter(k => k === 'bitcoin').length;
      expect(bitcoinCount).toBe(1);
    });

    it('should handle articles without category', () => {
      const articleWithoutCategory = {
        ...mockArticle,
        category: undefined,
      };
      
      const keywords = generateKeywords(articleWithoutCategory);
      expect(keywords).toContain('cryptocurrency');
      expect(keywords).toContain('bitcoin');
    });
  });

  describe('getTwitterCardType', () => {
    it('should return summary_large_image for articles with hero image', () => {
      const cardType = getTwitterCardType(mockArticle);
      expect(cardType).toBe('summary_large_image');
    });

    it('should return summary for articles without hero image', () => {
      const articleWithoutImage = {
        ...mockArticle,
        heroImage: '',
      };
      
      const cardType = getTwitterCardType(articleWithoutImage);
      expect(cardType).toBe('summary');
    });

    it('should return summary when no article provided', () => {
      const cardType = getTwitterCardType();
      expect(cardType).toBe('summary');
    });
  });

  describe('cleanCanonicalUrl', () => {
    it('should clean URL with trailing slash', () => {
      const url = cleanCanonicalUrl('https://example.com/path/');
      expect(url).toBe('https://example.com/path');
    });

    it('should preserve root URL trailing slash', () => {
      const url = cleanCanonicalUrl('https://example.com/');
      expect(url).toBe('https://example.com/');
    });

    it('should remove query parameters', () => {
      const url = cleanCanonicalUrl('https://example.com/path?param=value');
      expect(url).toBe('https://example.com/path');
    });

    it('should remove fragments', () => {
      const url = cleanCanonicalUrl('https://example.com/path#section');
      expect(url).toBe('https://example.com/path');
    });

    it('should handle relative URLs', () => {
      const url = cleanCanonicalUrl('/articles/test');
      expect(url).toBe('https://cryptopulse.github.io/articles/test');
    });

    it('should handle relative URLs', () => {
      const url = cleanCanonicalUrl('invalid-url');
      expect(url).toBe('https://cryptopulse.github.io/invalid-url');
    });
  });

  describe('generateRobotsContent', () => {
    it('should generate default robots content', () => {
      const robots = generateRobotsContent({});
      expect(robots).toBe('index, follow');
    });

    it('should generate noindex, nofollow', () => {
      const robots = generateRobotsContent({
        index: false,
        follow: false,
      });
      expect(robots).toBe('noindex, nofollow');
    });

    it('should include additional directives', () => {
      const robots = generateRobotsContent({
        noarchive: true,
        nosnippet: true,
      });
      expect(robots).toBe('index, follow, noarchive, nosnippet');
    });
  });

  describe('generateHreflangLinks', () => {
    it('should generate hreflang links for English', () => {
      const links = generateHreflangLinks('/articles/test');
      
      expect(links).toEqual([
        {
          hreflang: 'en',
          href: 'https://cryptopulse.github.io/articles/test',
        },
        {
          hreflang: 'x-default',
          href: 'https://cryptopulse.github.io/articles/test',
        },
      ]);
    });

    it('should handle root path', () => {
      const links = generateHreflangLinks('/');
      
      expect(links[0].href).toBe('https://cryptopulse.github.io/');
    });
  });

  describe('calculateReadingTimeForSEO', () => {
    it('should calculate reading time in ISO 8601 format', () => {
      const content = 'word '.repeat(200); // 200 words = 1 minute
      const time = calculateReadingTimeForSEO(content);
      expect(time).toBe('PT1M');
    });

    it('should round up reading time', () => {
      const content = 'word '.repeat(250); // 250 words = 1.25 minutes -> 2 minutes
      const time = calculateReadingTimeForSEO(content);
      expect(time).toBe('PT2M');
    });

    it('should handle HTML content', () => {
      const content = '<p>' + 'word '.repeat(200) + '</p>';
      const time = calculateReadingTimeForSEO(content);
      expect(time).toBe('PT1M');
    });

    it('should handle empty content', () => {
      const time = calculateReadingTimeForSEO('');
      expect(time).toBe('PT1M'); // Minimum 1 minute
    });
  });

  describe('generateArticleUrl', () => {
    it('should generate article URL from slug', () => {
      const url = generateArticleUrl('test-article');
      expect(url).toBe('https://cryptopulse.github.io/articles/test-article');
    });

    it('should handle slugs with special characters', () => {
      const url = generateArticleUrl('test-article-with-dashes');
      expect(url).toBe('https://cryptopulse.github.io/articles/test-article-with-dashes');
    });
  });

  describe('generateTagUrl', () => {
    it('should generate tag URL', () => {
      const url = generateTagUrl('bitcoin');
      expect(url).toBe('https://cryptopulse.github.io/tags/bitcoin');
    });

    it('should encode special characters in tags', () => {
      const url = generateTagUrl('defi & ethereum');
      expect(url).toBe('https://cryptopulse.github.io/tags/defi%20%26%20ethereum');
    });
  });
});