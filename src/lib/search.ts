import lunr from 'lunr';
import { Article } from '@/types/article';
import { SearchIndex, SearchResult } from '@/types/search';

/**
 * Creates a search index from articles using Lunr.js
 */
export function createSearchIndex(articles: Article[]): lunr.Index {
  return lunr(function () {
    this.ref('slug');
    this.field('title', { boost: 10 });
    this.field('description', { boost: 5 });
    this.field('content', { boost: 1 });
    this.field('tags', { boost: 3 });
    this.field('author', { boost: 2 });

    articles.forEach((article) => {
      this.add({
        slug: article.slug,
        title: article.title,
        description: article.description,
        content: article.content,
        tags: article.tags.join(' '),
        author: article.author,
      });
    });
  });
}

/**
 * Generates search index data for client-side use
 */
export function generateSearchData(articles: Article[]): SearchIndex[] {
  return articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    content: article.content.substring(0, 500), // Truncate for performance
    tags: article.tags,
    author: article.author,
    publishedAt: article.publishedAt.toISOString(),
    url: `/articles/${article.slug}`,
  }));
}

/**
 * Performs search using Lunr.js index
 */
export function performSearch(
  index: lunr.Index,
  searchData: SearchIndex[],
  query: string,
  limit: number = 10
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  try {
    const results = index.search(query);
    
    const searchResults: SearchResult[] = [];
    
    for (const result of results.slice(0, limit)) {
      const article = searchData.find((item) => item.slug === result.ref);
      if (article) {
        searchResults.push({
          ...article,
          score: result.score,
          matches: result.matchData as unknown as Record<string, unknown>,
        });
      }
    }
    
    return searchResults;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

/**
 * Highlights search terms in text
 */
export function highlightSearchTerms(text: string, terms: string[]): string {
  if (!terms.length) return text;

  let highlightedText = text;
  
  terms.forEach((term) => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
    );
  });

  return highlightedText;
}

/**
 * Escapes special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts search terms from query
 */
export function extractSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .map((term) => term.replace(/[^\w]/g, ''));
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}