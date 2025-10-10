import { describe, it, expect } from 'vitest';
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

  const allArticles = [
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
    expect(slugs).toContain('bitcoin-analysis-deep'); // Same author, category, and 2 shared tags
    expect(slugs).toContain('bitcoin-news'); // 1 shared tag
    expect(slugs).not.toContain('current-article'); // Should exclude current article
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

    const testArticles = [...allArticles, articleWithNoSharedTags];
    const related = getRelatedArticles(articleWithNoSharedTags, testArticles, 3);
    
    expect(related).toHaveLength(3);
    // Should include fallback articles (featured articles get priority)
    expect(related[0].slug).toBe('featured-article');
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

    const testArticles = [...allArticles, articleWithNoTags];
    const related = getRelatedArticles(articleWithNoTags, testArticles, 3);
    
    expect(related).toHaveLength(3);
    // Should fall back to fallback articles (featured articles get priority)
    expect(related[0].slug).toBe('featured-article');
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
      publishedAt: new Date('2024-01-01'), // Much older
    });

    const articlesWithRecency = [currentArticle, recentArticle, olderArticle];
    const related = getRelatedArticles(currentArticle, articlesWithRecency, 2);
    
    // Recent article should be preferred over older one with same tag count
    expect(related[0].slug).toBe('very-recent');
  });
});

describe('getFallbackArticles', () => {
  const currentArticle = createMockArticle({
    slug: 'current',
    publishedAt: new Date('2024-01-15'),
  });

  const articles = [
    currentArticle,
    createMockArticle({
      slug: 'featured-1',
      featured: true,
      publishedAt: new Date('2024-01-10'),
    }),
    createMockArticle({
      slug: 'featured-2',
      featured: true,
      publishedAt: new Date('2024-01-12'),
    }),
    createMockArticle({
      slug: 'recent-1',
      publishedAt: new Date('2024-01-20'),
    }),
    createMockArticle({
      slug: 'recent-2',
      publishedAt: new Date('2024-01-18'),
    }),
  ];

  it('prioritizes featured articles', () => {
    const fallback = getFallbackArticles(currentArticle, articles, 3);
    
    expect(fallback).toHaveLength(3);
    expect(fallback.filter(a => a.featured)).toHaveLength(2);
  });

  it('fills with recent articles when not enough featured', () => {
    const fallback = getFallbackArticles(currentArticle, articles, 4);
    
    expect(fallback).toHaveLength(4);
    expect(fallback.some(a => a.slug === 'recent-1')).toBe(true);
  });

  it('excludes current article', () => {
    const fallback = getFallbackArticles(currentArticle, articles, 5);
    
    expect(fallback.every(a => a.slug !== 'current')).toBe(true);
  });
});