import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  getArticleFilePaths,
  getSlugFromFilePath,
  parseArticleFile,
  getAllArticles,
  getArticleBySlug,
  getArticlesByTag,
  getAllTags,
  getFeaturedArticles
} from '../mdx'

// Mock fs module
vi.mock('fs')
const mockFs = vi.mocked(fs)

// Mock process.cwd to return predictable path
vi.mock('process', () => ({
  cwd: vi.fn(() => '/test-workspace')
}))

describe('MDX Processing Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getArticleFilePaths', () => {
    it('should return empty array when articles directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      
      const result = getArticleFilePaths()
      
      expect(result).toEqual([])
      expect(mockFs.existsSync).toHaveBeenCalled()
    })

    it('should return only MDX files from articles directory', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([
        'article1.mdx',
        'article2.md', 
        'article3.mdx',
        'not-article.txt',
        'README.md'
      ] as any)
      
      const result = getArticleFilePaths()
      
      expect(result).toEqual(['article1.mdx', 'article2.md', 'article3.mdx', 'README.md'])
    })
  })

  describe('getSlugFromFilePath', () => {
    it('should remove .mdx extension', () => {
      expect(getSlugFromFilePath('my-article.mdx')).toBe('my-article')
    })

    it('should remove .md extension', () => {
      expect(getSlugFromFilePath('my-article.md')).toBe('my-article')
    })

    it('should handle files without extension', () => {
      expect(getSlugFromFilePath('my-article')).toBe('my-article')
    })
  })

  describe('parseArticleFile', () => {
    const mockArticleContent = `---
title: "Test Article"
description: "This is a test article"
author: "John Doe"
publishedAt: "2024-01-15"
updatedAt: "2024-01-16"
tags: ["test", "article"]
heroImage: "/images/test.jpg"
featured: true
---

# Test Article

This is the content of the test article.`

    beforeEach(() => {
      mockFs.readFileSync.mockReturnValue(mockArticleContent)
    })

    it('should parse article file correctly', () => {
      const result = parseArticleFile('test-article.mdx')
      
      expect(result.slug).toBe('test-article')
      expect(result.title).toBe('Test Article')
      expect(result.description).toBe('This is a test article')
      expect(result.content).toBe('\n# Test Article\n\nThis is the content of the test article.')
      expect(result.author).toBe('John Doe')
      expect(result.publishedAt).toEqual(new Date('2024-01-15'))
      expect(result.updatedAt).toEqual(new Date('2024-01-16'))
      expect(result.tags).toEqual(['test', 'article'])
      expect(result.heroImage).toBe('/images/test.jpg')
      expect(result.readingTime).toBeGreaterThan(0)
      expect(result.featured).toBe(true)
    })

    it('should handle missing optional fields', () => {
      const minimalContent = `---
title: "Minimal Article"
description: "Minimal test"
author: "Jane Doe"
publishedAt: "2024-01-15"
heroImage: "/images/minimal.jpg"
---

Content here.`

      mockFs.readFileSync.mockReturnValue(minimalContent)
      
      const result = parseArticleFile('minimal.mdx')
      
      expect(result.updatedAt).toBeUndefined()
      expect(result.tags).toEqual([])
      expect(result.featured).toBe(false)
    })

    it('should throw error for missing required fields', () => {
      const invalidContent = `---
title: "Invalid Article"
---

Content here.`

      mockFs.readFileSync.mockReturnValue(invalidContent)
      
      expect(() => parseArticleFile('invalid.mdx')).toThrow(
        'Article "invalid.mdx" is missing required front-matter fields: description, author, publishedAt, heroImage'
      )
    })

    it('should throw error for invalid date format', () => {
      const invalidDateContent = `---
title: "Invalid Date Article"
description: "Test"
author: "John Doe"
publishedAt: "invalid-date"
heroImage: "/images/test.jpg"
---

Content here.`

      mockFs.readFileSync.mockReturnValue(invalidDateContent)
      
      expect(() => parseArticleFile('invalid-date.mdx')).toThrow(
        'Article "invalid-date.mdx" has invalid publishedAt date format'
      )
    })
  })

  describe('getAllArticles', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['article1.mdx', 'article2.mdx'] as any)
      
      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Article 1"
description: "First article"
author: "John Doe"
publishedAt: "2024-01-15"
heroImage: "/images/1.jpg"
---
Content 1`)
        .mockReturnValueOnce(`---
title: "Article 2"
description: "Second article"
author: "Jane Doe"
publishedAt: "2024-01-16"
heroImage: "/images/2.jpg"
---
Content 2`)
    })

    it('should return all articles sorted by publish date (newest first)', () => {
      const result = getAllArticles()
      
      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Article 2') // Newer article first
      expect(result[1].title).toBe('Article 1')
    })
  })

  describe('getArticleBySlug', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['test-article.mdx'] as any)
      mockFs.readFileSync.mockReturnValue(`---
title: "Test Article"
description: "Test"
author: "John Doe"
publishedAt: "2024-01-15"
heroImage: "/images/test.jpg"
---
Content`)
    })

    it('should return article by slug', () => {
      const result = getArticleBySlug('test-article')
      
      expect(result).not.toBeNull()
      expect(result?.title).toBe('Test Article')
    })

    it('should return null for non-existent slug', () => {
      const result = getArticleBySlug('non-existent')
      
      expect(result).toBeNull()
    })
  })

  describe('getArticlesByTag', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['article1.mdx', 'article2.mdx'] as any)
      
      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Article 1"
description: "First article"
author: "John Doe"
publishedAt: "2024-01-15"
heroImage: "/images/1.jpg"
tags: ["crypto", "bitcoin"]
---
Content 1`)
        .mockReturnValueOnce(`---
title: "Article 2"
description: "Second article"
author: "Jane Doe"
publishedAt: "2024-01-16"
heroImage: "/images/2.jpg"
tags: ["crypto", "ethereum"]
---
Content 2`)
    })

    it('should return articles with matching tag', () => {
      const result = getArticlesByTag('crypto')
      
      expect(result).toHaveLength(2)
    })

    it('should return articles with case-insensitive tag matching', () => {
      const result = getArticlesByTag('CRYPTO')
      
      expect(result).toHaveLength(2)
    })

    it('should return specific articles for specific tags', () => {
      const result = getArticlesByTag('bitcoin')
      
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Article 1')
    })
  })

  describe('getAllTags', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['article1.mdx', 'article2.mdx'] as any)
      
      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Article 1"
description: "First article"
author: "John Doe"
publishedAt: "2024-01-15"
heroImage: "/images/1.jpg"
tags: ["crypto", "bitcoin", "analysis"]
---
Content 1`)
        .mockReturnValueOnce(`---
title: "Article 2"
description: "Second article"
author: "Jane Doe"
publishedAt: "2024-01-16"
heroImage: "/images/2.jpg"
tags: ["crypto", "ethereum"]
---
Content 2`)
    })

    it('should return all unique tags sorted alphabetically', () => {
      const result = getAllTags()
      
      expect(result).toEqual(['analysis', 'bitcoin', 'crypto', 'ethereum'])
    })
  })

  describe('getFeaturedArticles', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['article1.mdx', 'article2.mdx'] as any)
      
      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Featured Article"
description: "This is featured"
author: "John Doe"
publishedAt: "2024-01-15"
heroImage: "/images/1.jpg"
featured: true
---
Content 1`)
        .mockReturnValueOnce(`---
title: "Regular Article"
description: "This is not featured"
author: "Jane Doe"
publishedAt: "2024-01-16"
heroImage: "/images/2.jpg"
---
Content 2`)
    })

    it('should return only featured articles', () => {
      const result = getFeaturedArticles()
      
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Featured Article')
      expect(result[0].featured).toBe(true)
    })
  })
})