import { Article } from '@/types/article';
import { siteConfig } from './constants';

export interface OGImageOptions {
  title: string;
  description?: string;
  author?: string;
  tags?: string[];
}

/**
 * Generate Open Graph image URL for articles
 */
export function generateOGImageUrl(options: OGImageOptions): string {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? siteConfig.url 
    : 'http://localhost:3000';
    
  const params = new URLSearchParams();
  
  // Encode title and description to handle special characters
  params.set('title', options.title);
  
  if (options.description) {
    params.set('description', options.description);
  }
  
  if (options.author) {
    params.set('author', options.author);
  }
  
  if (options.tags && options.tags.length > 0) {
    params.set('tags', options.tags.join(','));
  }
  
  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Generate OG image URL from article data
 */
export function generateArticleOGImage(article: Article): string {
  // Check if we're in build process or production with static export
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    return `${siteConfig.url}/images/og/${article.slug}.svg`;
  }
  
  // In development, use dynamic generation
  return generateOGImageUrl({
    title: article.title,
    description: article.description,
    author: article.author,
    tags: article.tags,
  });
}

/**
 * Generate OG image URL for pages (home, tags, etc.)
 */
export function generatePageOGImage(title: string, description?: string): string {
  return generateOGImageUrl({
    title,
    description: description || siteConfig.description,
    author: siteConfig.author,
  });
}

/**
 * Get fallback OG image URL
 */
export function getFallbackOGImage(): string {
  return generateOGImageUrl({
    title: siteConfig.name,
    description: siteConfig.description,
    author: siteConfig.author,
  });
}

/**
 * Validate OG image parameters
 */
export function validateOGImageParams(params: URLSearchParams): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  const title = params.get('title');
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  
  const description = params.get('description');
  if (description && description.length > 200) {
    errors.push('Description must be 200 characters or less');
  }
  
  const author = params.get('author');
  if (author && author.length > 50) {
    errors.push('Author name must be 50 characters or less');
  }
  
  const tags = params.get('tags');
  if (tags) {
    const tagArray = tags.split(',');
    if (tagArray.length > 5) {
      errors.push('Maximum 5 tags allowed');
    }
    
    for (const tag of tagArray) {
      if (tag.trim().length > 20) {
        errors.push('Each tag must be 20 characters or less');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}