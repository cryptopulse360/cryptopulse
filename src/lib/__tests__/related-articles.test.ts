import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { getRelatedArticles, getFallbackArticles } from '../article-utils';
import { Article } from '@/types/article';

const createMockArticle = (overrides: Partial<Article>): Article => ({
  slug: 'default-slug',
  title: 'Default Title',
  description: 'Default description',
  content: 'Default content',
  author: 'Default Author',
  publishedAt: new Date('2024-01-15'),
  tags: [],
  heroImage: '/default.jpg',
  readingTime: 5,
  featured: false,
  ...overrides,
});

describe('getRelatedArticles', () => {
  const currentArticle = createMockArticle({
    slug: 'current-article',
    title: 'Current Article',
    tags: ['bitcoin', 'analysis'],
    author: 'John Doe',
    category: 'market-analysis',
    publishedAt: new Date('2024-01-15'),
  });

  const allArticles: Article[] = [
    currentArticle,
    createMockArticle({
      slug: 'bitcoin-news',
      title: 'Bitcoin News',
      tags: ['bitcoin', 'news'],
      author: 'Jane Smith',
      publishedAt: new Date('2024-01-10'),
    }),
    createMockArticle({
      slug: 'bitcoin-analysis-deep',
      title: 'Deep Bitcoin Analysis',
      tags: ['bitcoin', 'analysis', 'technical'],
      author: 'John Doe', // Same author
      category: 'market-analysis', // Same category
      publishedAt: new Date('2024-01-12'),
    }),
    createMockArticle({
      slug: 'ethereum-update',
      title: 'Ethereum Update',
      tags: ['ethereum', 'defi'],
      author: 'Bob Johnson',
      publishedAt: new Date('2024-01-08'),
    }),
    createMockArticle({
      slug: 'featured-article',
      title: 'Featured Article',
      tags: ['bitcoin'],
      author: 'Alice Brown',
      featured: true,
      publishedAt: new Date('2024-01-05'),
    }),
    createMockArticle({
      slug: 'recent-article',
      title: 'Recent Article',
      tags: ['crypto'],
      author: 'Charlie Wilson',
      publishedAt: new Date('2024-01-20'), // Most recent
    }),
  ];

  it('returns related articles based on shared tags', () => {
    const related = getRelatedArticles(currentArticle, allArticles, 3);
    
    expect(related).toHaveLength(3);
    
    // Should prioritize articles with more shared tags
    const slugs = related.map(article => article.slug);
    expect(slugs).toContain('bitcoin-analysis-deep'); // 2 shared tags + same author + same category
    expect(slugs).toContain('bitcoin-news'); // 1 shared tag
    expect(slugs).toContain('featured-article'); // 1 shared tag + featured
  });

  it('prioritizes articles with same author and category', () => {
    const related = getRelatedArticles(currentArticle, allArticles, 5);
    
    // The article with same author and category should be first
    expect(related[0].slug).toBe('bitcoin-analysis-deep');
  });

  it('includes featured articles in results', () => {
    const related = getRelatedArticles(currentArticle, allArticles, 5);
    
    const featuredArticle = related.find(article => article.featured);
    expect(featuredArticle).toBeDefined();
    expect(featuredArticle?.slug).toBe('featured-article');
  });

  it('excludes the current article from results', () => {
    const related = getRelatedArticles(currentArticle, allArticles, 5);
    
    expect(related.every(article => article.slug !== currentArticle.slug)).toBe(true);
  });

  it('respects the limit parameter', () => {
    const related = getRelatedArticles(currentArticle, allArticles, 2);
    
    expect(related).toHaveLength(2);
  });

  it('fills with recent articles when not enough related articles', () => {
    const articleWithNoSharedTags = createMockArticle({
      slug: 'isolated-article',
      tags: ['unique-tag'],
      author: 'Unique Author',
      publishedAt: new Date('2024-01-15'),
    });

    const related = getRelatedArticles(articleWithNoSharedTags, allArticles, 3);
    
    expect(related).toHaveLength(3);
    // Should include recent articles as fallback (featured articles get priority)
    expect(related.some(article => article.slug === 'recent-article')).toBe(true);
  });

  it('returns empty array when no other articles exist', () => {
    const related = getRelatedArticles(currentArticle, [currentArticle], 3);
    
    expect(related).toHaveLength(0);
  });

  it('handles articles with no tags', () => {
    const articleWithNoTags = createMockArticle({
      slug: 'no-tags-article',
      tags: [],
      publishedAt: new Date('2024-01-15'),
    });

    const related = getRelatedArticles(articleWithNoTags, allArticles, 3);
    
    expect(related).toHaveLength(3);
    // Should fall back to recent articles (but featured articles get priority)
    expect(related.some(article => article.slug === 'recent-article')).toBe(true);
  });

  it('considers recency bonus for articles published close in time', () => {
    const recentArticle = createMockArticle({
      slug: 'very-recent',
      tags: ['bitcoin'], // Same tag as current article
      publishedAt: new Date('2024-01-16'), // 1 day after current article
    });

    const olderArticle = createMockArticle({
      slug: 'older-article',
      tags: ['bitcoin'], // Same tag as current article
      publishedAt: new Date('2023-12-15'), // Much older
    });

    const articlesWithRecency = [currentArticle, recentArticle, olderArticle];
    const related = getRelatedArticles(currentArticle, articlesWithRecency, 2);
    
    // Recent article should be preferred over older one with same tag count
    expect(related[0].slug).toBe('very-recent');
  });
});

describe('getFallbackArticles', () => {
  const currentArticle = createMockArticle({
    slug: 'current-article',
    publishedAt: new Date('2024-01-15'),
  });

  const allArticles: Article[] = [
    currentArticle,
    createMockArticle({
      slug: 'featured-1',
      title: 'Featured Article 1',
      featured: true,
      publishedAt: new Date('2024-01-10'),
    }),
    createMockArticle({
      slug: 'featured-2',
      title: 'Featured Article 2',
      featured: true,
      publishedAt: new Date('2024-01-08'),
    }),
    createMockArticle({
      slug: 'recent-1',
      title: 'Recent Article 1',
      publishedAt: new Date('2024-01-20'),
    }),
    createMockArticle({
      slug: 'recent-2',
      title: 'Recent Article 2',
      publishedAt: new Date('2024-01-18'),
    }),
    createMockArticle({
      slug: 'old-article',
      title: 'Old Article',
      publishedAt: new Date('2023-12-01'),
    }),
  ];

  it('prioritizes featured articles', () => {
    const fallback = getFallbackArticles(currentArticle, allArticles, 3);
    
    expect(fallback).toHaveLength(3);
    expect(fallback[0].featured).toBe(true);
    expect(fallback[1].featured).toBe(true);
  });

  it('fills remaining slots with recent articles', () => {
    const fallback = getFallbackArticles(currentArticle, allArticles, 4);
    
    expect(fallback).toHaveLength(4);
    
    // Should have 2 featured articles and 2 recent articles
    const featuredCount = fallback.filter(article => article.featured).length;
    expect(featuredCount).toBe(2);
    
    // Should include recent articles
    const slugs = fallback.map(article => article.slug);
    expect(slugs).toContain('recent-1');
    expect(slugs).toContain('recent-2');
  });

  it('excludes current article', () => {
    const fallback = getFallbackArticles(currentArticle, allArticles, 5);
    
    expect(fallback.every(article => article.slug !== currentArticle.slug)).toBe(true);
  });

  it('respects limit parameter', () => {
    const fallback = getFallbackArticles(currentArticle, allArticles, 2);
    
    expect(fallback).toHaveLength(2);
  });

  it('handles case with no featured articles', () => {
    const articlesWithoutFeatured = allArticles.map(article => ({
      ...article,
      featured: false,
    }));

    const fallback = getFallbackArticles(currentArticle, articlesWithoutFeatured, 3);
    
    expect(fallback).toHaveLength(3);
    // Should be filled with recent articles only
    expect(fallback[0].slug).toBe('recent-1');
    expect(fallback[1].slug).toBe('recent-2');
  });

  it('returns empty array when only current article exists', () => {
    const fallback = getFallbackArticles(currentArticle, [currentArticle], 3);
    
    expect(fallback).toHaveLength(0);
  });
});