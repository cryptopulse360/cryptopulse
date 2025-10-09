import { Article } from '@/types/article';

/**
 * Sort articles by different criteria
 */
export type SortOption = 'newest' | 'oldest' | 'title' | 'reading-time';

export function sortArticles(articles: Article[], sortBy: SortOption = 'newest'): Article[] {
  const sortedArticles = [...articles];

  switch (sortBy) {
    case 'newest':
      return sortedArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    
    case 'oldest':
      return sortedArticles.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
    
    case 'title':
      return sortedArticles.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'reading-time':
      return sortedArticles.sort((a, b) => a.readingTime - b.readingTime);
    
    default:
      return sortedArticles;
  }
}

/**
 * Filter articles by various criteria
 */
export interface ArticleFilters {
  tags?: string[];
  author?: string;
  featured?: boolean;
  category?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  searchQuery?: string;
}

export function filterArticles(articles: Article[], filters: ArticleFilters): Article[] {
  let filteredArticles = [...articles];

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filteredArticles = filteredArticles.filter(article =>
      filters.tags!.some(tag => 
        article.tags.some(articleTag => 
          articleTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }

  // Filter by author
  if (filters.author) {
    filteredArticles = filteredArticles.filter(article =>
      article.author.toLowerCase().includes(filters.author!.toLowerCase())
    );
  }

  // Filter by featured status
  if (filters.featured !== undefined) {
    filteredArticles = filteredArticles.filter(article =>
      article.featured === filters.featured
    );
  }

  // Filter by category
  if (filters.category) {
    filteredArticles = filteredArticles.filter(article =>
      article.category?.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  // Filter by date range
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    
    if (start) {
      filteredArticles = filteredArticles.filter(article =>
        article.publishedAt >= start
      );
    }
    
    if (end) {
      filteredArticles = filteredArticles.filter(article =>
        article.publishedAt <= end
      );
    }
  }

  // Filter by search query (title, description, content)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filteredArticles;
}

/**
 * Paginate articles
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function paginateArticles(
  articles: Article[], 
  options: PaginationOptions
): PaginatedResult<Article> {
  const { page, pageSize } = options;
  const totalItems = articles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const items = articles.slice(startIndex, endIndex);

  return {
    items,
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Get articles for home page sections
 */
export function getHomePageArticles(articles: Article[]) {
  const sortedArticles = sortArticles(articles, 'newest');
  const featuredArticles = filterArticles(sortedArticles, { featured: true });
  const latestArticles = sortedArticles.slice(0, 6); // Get 6 most recent articles

  return {
    featured: featuredArticles.slice(0, 3), // Show up to 3 featured articles
    latest: latestArticles,
  };
}

/**
 * Get related articles based on tags with improved scoring algorithm
 */
export function getRelatedArticles(
  currentArticle: Article, 
  allArticles: Article[], 
  limit: number = 3
): Article[] {
  // Filter out the current article
  const otherArticles = allArticles.filter(article => article.slug !== currentArticle.slug);
  
  if (otherArticles.length === 0) {
    return [];
  }
  
  // Score articles based on multiple factors
  const scoredArticles = otherArticles.map(article => {
    let score = 0;
    
    // Tag similarity score (primary factor)
    const sharedTags = article.tags.filter(tag => 
      currentArticle.tags.some(currentTag => 
        currentTag.toLowerCase() === tag.toLowerCase()
      )
    );
    score += sharedTags.length * 10; // Weight shared tags heavily
    
    // Author similarity bonus
    if (article.author.toLowerCase() === currentArticle.author.toLowerCase()) {
      score += 5;
    }
    
    // Category similarity bonus
    if (article.category && currentArticle.category && 
        article.category.toLowerCase() === currentArticle.category.toLowerCase()) {
      score += 3;
    }
    
    // Recency bonus (newer articles get slight preference)
    const daysDiff = Math.abs(
      (article.publishedAt.getTime() - currentArticle.publishedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 30) {
      score += Math.max(0, 2 - (daysDiff / 15)); // Bonus decreases over 30 days
    }
    
    // Featured article bonus
    if (article.featured) {
      score += 1;
    }
    
    return {
      article,
      score,
      sharedTagCount: sharedTags.length,
    };
  });

  // Sort by score (highest first), then by shared tags, then by date
  const sortedByScore = scoredArticles
    .sort((a, b) => {
      if (Math.abs(a.score - b.score) < 0.1) {
        // If scores are very close, prefer more shared tags
        if (a.sharedTagCount !== b.sharedTagCount) {
          return b.sharedTagCount - a.sharedTagCount;
        }
        // If same shared tags, prefer newer articles
        return b.article.publishedAt.getTime() - a.article.publishedAt.getTime();
      }
      return b.score - a.score;
    });

  // Get articles with any score > 0 first
  const relatedWithScore = sortedByScore
    .filter(item => item.score > 0)
    .map(item => item.article);
  
  // If we don't have enough related articles, fill with recent articles
  if (relatedWithScore.length < limit) {
    const recentArticles = sortArticles(otherArticles, 'newest')
      .filter(article => !relatedWithScore.some(related => related.slug === article.slug))
      .slice(0, limit - relatedWithScore.length);
    
    relatedWithScore.push(...recentArticles);
  }

  return relatedWithScore.slice(0, limit);
}

/**
 * Get fallback articles when no related articles are found
 */
export function getFallbackArticles(
  currentArticle: Article,
  allArticles: Article[],
  limit: number = 3
): Article[] {
  const otherArticles = allArticles.filter(article => article.slug !== currentArticle.slug);
  
  // Prioritize featured articles, then recent articles
  const featuredArticles = otherArticles.filter(article => article.featured);
  const recentArticles = sortArticles(otherArticles, 'newest');
  
  const fallbackArticles: Article[] = [];
  
  // Add featured articles first
  featuredArticles.forEach(article => {
    if (fallbackArticles.length < limit && 
        !fallbackArticles.some(existing => existing.slug === article.slug)) {
      fallbackArticles.push(article);
    }
  });
  
  // Fill remaining slots with recent articles
  recentArticles.forEach(article => {
    if (fallbackArticles.length < limit && 
        !fallbackArticles.some(existing => existing.slug === article.slug)) {
      fallbackArticles.push(article);
    }
  });
  
  return fallbackArticles.slice(0, limit);
}