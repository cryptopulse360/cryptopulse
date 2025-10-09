/**
 * Article front-matter validation utilities
 */

export interface ArticleFrontMatter {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt?: string
  tags?: string[]
  heroImage: string
  featured?: boolean
  category?: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validate article front-matter data
 */
export function validateArticleFrontMatter(
  data: any,
  filePath?: string
): ValidationResult {
  const errors: ValidationError[] = []
  const fileContext = filePath ? ` in "${filePath}"` : ''

  // Required fields validation
  const requiredFields: (keyof ArticleFrontMatter)[] = [
    'title',
    'description',
    'author',
    'publishedAt',
    'heroImage'
  ]

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push({
        field,
        message: `Required field "${field}" is missing or empty${fileContext}`
      })
    }
  })

  // Type validation
  if (data.title && typeof data.title !== 'string') {
    errors.push({
      field: 'title',
      message: `Field "title" must be a string${fileContext}`
    })
  }

  if (data.description && typeof data.description !== 'string') {
    errors.push({
      field: 'description',
      message: `Field "description" must be a string${fileContext}`
    })
  }

  if (data.author && typeof data.author !== 'string') {
    errors.push({
      field: 'author',
      message: `Field "author" must be a string${fileContext}`
    })
  }

  if (data.heroImage && typeof data.heroImage !== 'string') {
    errors.push({
      field: 'heroImage',
      message: `Field "heroImage" must be a string${fileContext}`
    })
  }

  // Date validation
  if (data.publishedAt) {
    const publishedDate = new Date(data.publishedAt)
    if (isNaN(publishedDate.getTime())) {
      errors.push({
        field: 'publishedAt',
        message: `Field "publishedAt" must be a valid date (YYYY-MM-DD format)${fileContext}`
      })
    }
  }

  if (data.updatedAt) {
    const updatedDate = new Date(data.updatedAt)
    if (isNaN(updatedDate.getTime())) {
      errors.push({
        field: 'updatedAt',
        message: `Field "updatedAt" must be a valid date (YYYY-MM-DD format)${fileContext}`
      })
    }
  }

  // Tags validation
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push({
        field: 'tags',
        message: `Field "tags" must be an array${fileContext}`
      })
    } else {
      data.tags.forEach((tag: any, index: number) => {
        if (typeof tag !== 'string') {
          errors.push({
            field: 'tags',
            message: `Tag at index ${index} must be a string${fileContext}`
          })
        }
      })
    }
  }

  // Boolean validation
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.push({
      field: 'featured',
      message: `Field "featured" must be a boolean${fileContext}`
    })
  }

  // String length validation
  if (data.title && data.title.length > 200) {
    errors.push({
      field: 'title',
      message: `Field "title" must be 200 characters or less${fileContext}`
    })
  }

  if (data.description && data.description.length > 500) {
    errors.push({
      field: 'description',
      message: `Field "description" must be 500 characters or less${fileContext}`
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate multiple articles and return summary
 */
export function validateArticles(articles: { filePath: string; data: any }[]): {
  validCount: number
  invalidCount: number
  errors: Array<{ filePath: string; errors: ValidationError[] }>
} {
  let validCount = 0
  let invalidCount = 0
  const allErrors: Array<{ filePath: string; errors: ValidationError[] }> = []

  articles.forEach(({ filePath, data }) => {
    const result = validateArticleFrontMatter(data, filePath)
    
    if (result.isValid) {
      validCount++
    } else {
      invalidCount++
      allErrors.push({
        filePath,
        errors: result.errors
      })
    }
  })

  return {
    validCount,
    invalidCount,
    errors: allErrors
  }
}