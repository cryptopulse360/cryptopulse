import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { Article } from '@/types/article'
import { articleCategories } from '@/lib/constants'

const ARTICLES_PATH = path.join(process.cwd(), 'content/articles')

/**
 * Get all article file paths from the content directory
 */
export function getArticleFilePaths(): string[] {
  if (!fs.existsSync(ARTICLES_PATH)) {
    return []
  }
  
  return fs
    .readdirSync(ARTICLES_PATH)
    .filter((path) => /\.mdx?$/.test(path))
}

/**
 * Get article slug from file path
 */
export function getSlugFromFilePath(filePath: string): string {
  return filePath.replace(/\.mdx?$/, '')
}

/**
 * Read and parse a single MDX file
 */
export function parseArticleFile(filePath: string): Article {
  const fullPath = path.join(ARTICLES_PATH, filePath)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  // Validate required front-matter fields
  validateArticleFrontMatter(data, filePath)
  
  const slug = getSlugFromFilePath(filePath)
  const readingTimeResult = readingTime(content)
  
  return {
    slug,
    title: data.title,
    description: data.description,
    content,
    author: data.author,
    publishedAt: new Date(data.publishedAt),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    tags: data.tags || [],
    heroImage: data.heroImage,
    readingTime: readingTimeResult.minutes,
    featured: data.featured || false,
    category: data.category,
  }
}

/**
 * Get all articles from the content directory
 */
export function getAllArticles(): Article[] {
  const filePaths = getArticleFilePaths()
  
  const articles = filePaths
    .map((filePath) => parseArticleFile(filePath))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  
  return articles
}

/**
 * Get a single article by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  const filePaths = getArticleFilePaths()
  const filePath = filePaths.find((path) => getSlugFromFilePath(path) === slug)
  
  if (!filePath) {
    return null
  }
  
  return parseArticleFile(filePath)
}

/**
 * Get articles by tag
 */
export function getArticlesByTag(tag: string): Article[] {
  const articles = getAllArticles()
  return articles.filter((article) => 
    article.tags.some((articleTag) => 
      articleTag.toLowerCase() === tag.toLowerCase()
    )
  )
}

/**
 * Get all unique tags from all articles
 */
export function getAllTags(): string[] {
  const articles = getAllArticles()
  const tagSet = new Set<string>()
  
  articles.forEach((article) => {
    article.tags.forEach((tag) => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

/**
 * Get tag statistics (tag name and article count)
 */
export function getTagStats(): Array<{ tag: string; count: number }> {
  const articles = getAllArticles()
  const tagCounts = new Map<string, number>()
  
  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Get related articles based on shared tags
 */
export function getRelatedArticles(currentSlug: string, maxResults: number = 3): Article[] {
  const currentArticle = getArticleBySlug(currentSlug)
  if (!currentArticle) return []
  
  const allArticles = getAllArticles()
  const otherArticles = allArticles.filter(article => article.slug !== currentSlug)
  
  // Calculate relevance score based on shared tags
  const articlesWithScores = otherArticles.map(article => {
    const sharedTags = article.tags.filter(tag => 
      currentArticle.tags.some(currentTag => 
        currentTag.toLowerCase() === tag.toLowerCase()
      )
    )
    return {
      article,
      score: sharedTags.length
    }
  })
  
  // Sort by score (descending) and return top results
  return articlesWithScores
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.article)
}

/**
 * Get featured articles
 */
export function getFeaturedArticles(): Article[] {
  const articles = getAllArticles()
  return articles.filter((article) => article.featured)
}

/**
 * Validate article front-matter has required fields
 */
function validateArticleFrontMatter(data: any, filePath: string): void {
  const requiredFields = [
    'title',
    'description', 
    'author',
    'publishedAt',
    'heroImage'
  ]
  
  const missingFields = requiredFields.filter(field => !data[field])
  
  if (missingFields.length > 0) {
    throw new Error(
      `Article "${filePath}" is missing required front-matter fields: ${missingFields.join(', ')}`
    )
  }
  
  // Validate date format
  if (data.publishedAt && isNaN(Date.parse(data.publishedAt))) {
    throw new Error(
      `Article "${filePath}" has invalid publishedAt date format. Use YYYY-MM-DD format.`
    )
  }
  
  if (data.updatedAt && isNaN(Date.parse(data.updatedAt))) {
    throw new Error(
      `Article "${filePath}" has invalid updatedAt date format. Use YYYY-MM-DD format.`
    )
  }
  
  // Validate tags is array if provided
  if (data.tags && !Array.isArray(data.tags)) {
    throw new Error(
      `Article "${filePath}" tags field must be an array`
    )
  }
}

/**
 * Get articles by author name
 */
export function getArticlesByAuthor(authorName: string): Article[] {
  const articles = getAllArticles()
  return articles.filter(article => article.author === authorName)
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles()
  return articles.filter(article => 
    article.category?.toLowerCase().replace(/ & /g, ' ') === category.toLowerCase().replace(/ & /g, ' ')
  )
}

/**
 * Get all unique categories from all articles
 */
export function getAllCategories(): string[] {
  const articles = getAllArticles()
  const categorySet = new Set<string>()
  
  articles.forEach((article) => {
    if (article.category) {
      categorySet.add(article.category)
    }
  })
  
  return Array.from(categorySet).sort()
}

/**
 * Normalize category name to slug format
 */
export function getCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/ & /g, ' ')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Get the full category name from a slug
 */
export function getFullCategoryFromSlug(slug: string): string | null {
  // First check actual categories from articles
  const actualCategories = getAllCategories()
  for (const category of actualCategories) {
    if (getCategorySlug(category) === slug) {
      return category
    }
  }
  
  // Fallback to predefined categories
  for (const category of articleCategories) {
    if (getCategorySlug(category) === slug) {
      return category
    }
  }
  
  return null
}
