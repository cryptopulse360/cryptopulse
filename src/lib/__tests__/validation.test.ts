import { describe, it, expect } from 'vitest'
import { validateArticleFrontMatter, validateArticles } from '../validation'

describe('Article Validation', () => {
  describe('validateArticleFrontMatter', () => {
    const validData = {
      title: 'Test Article',
      description: 'This is a test article description',
      author: 'John Doe',
      publishedAt: '2024-01-15',
      heroImage: '/images/test.jpg'
    }

    it('should validate correct front-matter', () => {
      const result = validateArticleFrontMatter(validData)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const invalidData = {
        title: 'Test Article'
        // Missing other required fields
      }
      
      const result = validateArticleFrontMatter(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(4) // Missing description, author, publishedAt, heroImage
      expect(result.errors.map(e => e.field)).toContain('description')
      expect(result.errors.map(e => e.field)).toContain('author')
      expect(result.errors.map(e => e.field)).toContain('publishedAt')
      expect(result.errors.map(e => e.field)).toContain('heroImage')
    })

    it('should detect empty string fields', () => {
      const invalidData = {
        ...validData,
        title: '',
        description: '   ' // Only whitespace
      }
      
      const result = validateArticleFrontMatter(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors.map(e => e.field)).toContain('title')
      expect(result.errors.map(e => e.field)).toContain('description')
    })

    it('should validate field types', () => {
      const invalidData = {
        ...validData,
        title: 123, // Should be string
        featured: 'yes' // Should be boolean
      }
      
      const result = validateArticleFrontMatter(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.map(e => e.field)).toContain('title')
      expect(result.errors.map(e => e.field)).toContain('featured')
    })

    it('should validate date formats', () => {
      const invalidData = {
        ...validData,
        publishedAt: 'invalid-date',
        updatedAt: '2024-13-45' // Invalid date
      }
      
      const result = validateArticleFrontMatter(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.map(e => e.field)).toContain('publishedAt')
      expect(result.errors.map(e => e.field)).toContain('updatedAt')
    })

    it('should validate tags array', () => {
      const invalidData = {
        ...validData,
        tags: 'not-an-array'
      }
      
      const result = validateArticleFrontMatter(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.map(e => e.field)).toContain('tags')
    })

    it('should validate tags array elements', () => {
      const invalidData = {
        ...validData,
        tags: ['valid-tag', 123, 'another-valid-tag']
      }
      
      const result = validateArticleFrontMatter(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toContain('Tag at index 1 must be a string')
    })

    it('should validate string length limits', () => {
      const invalidData = {
        ...validData,
        title: 'a'.repeat(201), // Too long
        description: 'b'.repeat(501) // Too long
      }
      
      const result = validateArticleFrontMatter(invalidData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.map(e => e.field)).toContain('title')
      expect(result.errors.map(e => e.field)).toContain('description')
    })

    it('should include file path in error messages when provided', () => {
      const invalidData = {
        title: 'Test'
        // Missing required fields
      }
      
      const result = validateArticleFrontMatter(invalidData, 'test-article.mdx')
      
      expect(result.errors[0].message).toContain('in "test-article.mdx"')
    })

    it('should accept valid optional fields', () => {
      const dataWithOptionals = {
        ...validData,
        updatedAt: '2024-01-16',
        tags: ['crypto', 'bitcoin'],
        featured: true,
        category: 'analysis'
      }
      
      const result = validateArticleFrontMatter(dataWithOptionals)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('validateArticles', () => {
    const validArticle = {
      filePath: 'valid.mdx',
      data: {
        title: 'Valid Article',
        description: 'Valid description',
        author: 'John Doe',
        publishedAt: '2024-01-15',
        heroImage: '/images/valid.jpg'
      }
    }

    const invalidArticle = {
      filePath: 'invalid.mdx',
      data: {
        title: 'Invalid Article'
        // Missing required fields
      }
    }

    it('should validate multiple articles and return summary', () => {
      const articles = [validArticle, invalidArticle, validArticle]
      
      const result = validateArticles(articles)
      
      expect(result.validCount).toBe(2)
      expect(result.invalidCount).toBe(1)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].filePath).toBe('invalid.mdx')
      expect(result.errors[0].errors.length).toBeGreaterThan(0)
    })

    it('should handle all valid articles', () => {
      const articles = [validArticle, validArticle]
      
      const result = validateArticles(articles)
      
      expect(result.validCount).toBe(2)
      expect(result.invalidCount).toBe(0)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle all invalid articles', () => {
      const articles = [invalidArticle, invalidArticle]
      
      const result = validateArticles(articles)
      
      expect(result.validCount).toBe(0)
      expect(result.invalidCount).toBe(2)
      expect(result.errors).toHaveLength(2)
    })
  })
})