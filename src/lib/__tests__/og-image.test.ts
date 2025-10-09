import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateOGImageUrl,
  generateArticleOGImage,
  generatePageOGImage,
  getFallbackOGImage,
  validateOGImageParams,
  OGImageOptions,
} from '../og-image';
import { Article } from '@/types/article';

// Mock the constants
vi.mock('../constants', () => ({
  siteConfig: {
    name: 'CryptoPulse',
    description: 'Test description',
    url: 'https://test.com',
    author: 'Test Author',
  },
}));

describe('OG Image Generation', () => {
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

  describe('generateOGImageUrl', () => {
    it('should generate OG image URL with basic options', () => {
      const options: OGImageOptions = {
        title: 'Test Title',
      };

      const url = generateOGImageUrl(options);
      
      expect(url).toContain('/api/og');
      expect(url).toContain('title=Test+Title');
    });

    it('should include all parameters when provided', () => {
      const options: OGImageOptions = {
        title: 'Test Title',
        description: 'Test Description',
        author: 'Test Author',
        tags: ['tag1', 'tag2'],
      };

      const url = generateOGImageUrl(options);
      
      expect(url).toContain('title=Test+Title');
      expect(url).toContain('description=Test+Description');
      expect(url).toContain('author=Test+Author');
      expect(url).toContain('tags=tag1%2Ctag2');
    });

    it('should handle special characters in title', () => {
      const options: OGImageOptions = {
        title: 'Bitcoin & Ethereum: A Comparison',
      };

      const url = generateOGImageUrl(options);
      
      expect(url).toContain('title=Bitcoin+%26+Ethereum%3A+A+Comparison');
    });

    it('should use production URL in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const options: OGImageOptions = {
        title: 'Test Title',
      };

      const url = generateOGImageUrl(options);
      
      expect(url).toContain('https://test.com/api/og');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should use localhost in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const options: OGImageOptions = {
        title: 'Test Title',
      };

      const url = generateOGImageUrl(options);
      
      expect(url).toContain('http://localhost:3000/api/og');
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('generateArticleOGImage', () => {
    it('should generate OG image URL from article data', () => {
      const url = generateArticleOGImage(mockArticle);
      
      expect(url).toContain('/api/og');
      expect(url).toContain('title=Test+Bitcoin+Article');
      expect(url).toContain('description=A+test+article+about+Bitcoin');
      expect(url).toContain('author=John+Doe');
      expect(url).toContain('tags=bitcoin%2Ccrypto');
    });

    it('should handle articles without optional fields', () => {
      const minimalArticle: Article = {
        ...mockArticle,
        description: '',
        tags: [],
      };

      const url = generateArticleOGImage(minimalArticle);
      
      expect(url).toContain('title=Test+Bitcoin+Article');
      expect(url).toContain('author=John+Doe');
      expect(url).not.toContain('description=');
      expect(url).not.toContain('tags=');
    });
  });

  describe('generatePageOGImage', () => {
    it('should generate OG image URL for pages', () => {
      const url = generatePageOGImage('Home Page');
      
      expect(url).toContain('/api/og');
      expect(url).toContain('title=Home+Page');
      expect(url).toContain('description=Test+description');
      expect(url).toContain('author=Test+Author');
    });

    it('should use custom description when provided', () => {
      const url = generatePageOGImage('About Page', 'Custom description');
      
      expect(url).toContain('title=About+Page');
      expect(url).toContain('description=Custom+description');
    });
  });

  describe('getFallbackOGImage', () => {
    it('should generate fallback OG image URL', () => {
      const url = getFallbackOGImage();
      
      expect(url).toContain('/api/og');
      expect(url).toContain('title=CryptoPulse');
      expect(url).toContain('description=Test+description');
      expect(url).toContain('author=Test+Author');
    });
  });

  describe('validateOGImageParams', () => {
    it('should validate valid parameters', () => {
      const params = new URLSearchParams({
        title: 'Valid Title',
        description: 'Valid description',
        author: 'Valid Author',
        tags: 'tag1,tag2',
      });

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require title', () => {
      const params = new URLSearchParams();

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should validate title length', () => {
      const params = new URLSearchParams({
        title: 'a'.repeat(101),
      });

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must be 100 characters or less');
    });

    it('should validate description length', () => {
      const params = new URLSearchParams({
        title: 'Valid Title',
        description: 'a'.repeat(201),
      });

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description must be 200 characters or less');
    });

    it('should validate author length', () => {
      const params = new URLSearchParams({
        title: 'Valid Title',
        author: 'a'.repeat(51),
      });

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Author name must be 50 characters or less');
    });

    it('should validate tag count', () => {
      const params = new URLSearchParams({
        title: 'Valid Title',
        tags: 'tag1,tag2,tag3,tag4,tag5,tag6',
      });

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Maximum 5 tags allowed');
    });

    it('should validate individual tag length', () => {
      const params = new URLSearchParams({
        title: 'Valid Title',
        tags: 'a'.repeat(21),
      });

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Each tag must be 20 characters or less');
    });

    it('should handle empty title', () => {
      const params = new URLSearchParams({
        title: '   ',
      });

      const result = validateOGImageParams(params);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });
  });
});