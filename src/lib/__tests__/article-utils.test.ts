import { describe, it, expect } from 'vitest';
import {
  sortArticles,
  filterArticles,
  paginateArticles,
  getHomePageArticles,
  getRelatedArticles,
} from '../article-utils';
import { Article } from '@/types/article';

const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test description',
  content: 'Test content',
  author: 'Test Author',
  publishedAt: new Date('2024-01-15'),
  tags: ['test'],
  heroImage: '/test.jpg',
  readingTime: 5,
  featured: false,
  category: 'test',
  ...overrides,
});

describe('Article Utils', () => {
  describe('sortArticles', () => {
    const articles = [
      createMockArticle({
        slug: 'article-1',
        title: 'B Article',
        publishedAt: new Date('2024-01-10'),
        readingTime: 10,
      }),
      createMockArticle({
        slug: 'article-2',
        title: 'A Article',
        publishedAt: new Date('2024-01-15'),
        readingTime: 5,
      }),
      createMockArticle({
        slug: 'article-3',
        title: 'C Article',
        publishedAt: new Date('2024-01-05'),
        readingTime: 15,
      }),
    ];

    it('sorts by newest by default', () => {
      const sorted = sortArticles(articles);
      expect(sorted[0].slug).toBe('article-2'); // 2024-01-15
      expect(sorted[1].slug).toBe('article-1'); // 2024-01-10
      expect(sorted[2].slug).toBe('article-3'); // 2024-01-05
    });

    it('sorts by oldest', () => {
      const sorted = sortArticles(articles, 'oldest');
      expect(sorted[0].slug).toBe('article-3'); // 2024-01-05
      expect(sorted[1].slug).toBe('article-1'); // 2024-01-10
      expect(sorted[2].slug).toBe('article-2'); // 2024-01-15
    });

    it('sorts by title alphabetically', () => {
      const sorted = sortArticles(articles, 'title');
      expect(sorted[0].title).toBe('A Article');
      expect(sorted[1].title).toBe('B Article');
      expect(sorted[2].title).toBe('C Article');
    });

    it('sorts by reading time', () => {
      const sorted = sortArticles(articles, 'reading-time');
      expect(sorted[0].readingTime).toBe(5);
      expect(sorted[1].readingTime).toBe(10);
      expect(sorted[2].readingTime).toBe(15);
    });
  });

  describe('filterArticles', () => {
    const articles = [
      createMockArticle({
        slug: 'article-1',
        tags: ['bitcoin', 'analysis'],
        author: 'John Doe',
        featured: true,
        category: 'analysis',
        publishedAt: new Date('2024-01-15'),
      }),
      createMockArticle({
        slug: 'article-2',
        tags: ['ethereum', 'defi'],
        author: 'Jane Smith',
        featured: false,
        category: 'defi',
        publishedAt: new Date('2024-01-10'),
      }),
    ];

    it('filters by tags', () => {
      const filtered = filterArticles(articles, { tags: ['bitcoin'] });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe('article-1');
    });

    it('filters by author', () => {
      const filtered = filterArticles(articles, { author: 'Jane' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe('article-2');
    });

    it('filters by featured status', () => {
      const filtered = filterArticles(articles, { featured: true });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe('article-1');
    });

    it('filters by category', () => {
      const filtered = filterArticles(articles, { category: 'defi' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe('article-2');
    });

    it('filters by date range', () => {
      const filtered = filterArticles(articles, {
        dateRange: {
          start: new Date('2024-01-12'),
        },
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe('article-1');
    });

    it('filters by search query', () => {
      const filtered = filterArticles(articles, { searchQuery: 'bitcoin' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe('article-1');
    });
  });

  describe('paginateArticles', () => {
    const articles = Array.from({ length: 10 }, (_, i) =>
      createMockArticle({ slug: `article-${i}` })
    );

    it('paginates articles correctly', () => {
      const result = paginateArticles(articles, { page: 1, pageSize: 3 });
      
      expect(result.items).toHaveLength(3);
      expect(result.totalItems).toBe(10);
      expect(result.totalPages).toBe(4);
      expect(result.currentPage).toBe(1);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('handles last page correctly', () => {
      const result = paginateArticles(articles, { page: 4, pageSize: 3 });
      
      expect(result.items).toHaveLength(1); // Only 1 item on last page
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
    });
  });

  describe('getHomePageArticles', () => {
    const articles = [
      createMockArticle({
        slug: 'featured-1',
        featured: true,
        publishedAt: new Date('2024-01-15'),
      }),
      createMockArticle({
        slug: 'featured-2',
        featured: true,
        publishedAt: new Date('2024-01-10'),
      }),
      createMockArticle({
        slug: 'regular-1',
        featured: false,
        publishedAt: new Date('2024-01-12'),
      }),
      createMockArticle({
        slug: 'regular-2',
        featured: false,
        publishedAt: new Date('2024-01-08'),
      }),
    ];

    it('returns featured and latest articles', () => {
      const result = getHomePageArticles(articles);
      
      expect(result.featured).toHaveLength(2);
      expect(result.featured[0].slug).toBe('featured-1'); // Most recent featured
      expect(result.featured[1].slug).toBe('featured-2');
      
      expect(result.latest).toHaveLength(4); // All articles, sorted by date
      expect(result.latest[0].slug).toBe('featured-1'); // Most recent overall
    });

    it('limits featured articles to 3', () => {
      const manyFeatured = Array.from({ length: 5 }, (_, i) =>
        createMockArticle({
          slug: `featured-${i}`,
          featured: true,
          publishedAt: new Date(`2024-01-${15 - i}`),
        })
      );

      const result = getHomePageArticles(manyFeatured);
      expect(result.featured).toHaveLength(3);
    });

    it('limits latest articles to 6', () => {
      const manyArticles = Array.from({ length: 10 }, (_, i) =>
        createMockArticle({
          slug: `article-${i}`,
          publishedAt: new Date(`2024-01-${20 - i}`),
        })
      );

      const result = getHomePageArticles(manyArticles);
      expect(result.latest).toHaveLength(6);
    });
  });

  describe('getRelatedArticles', () => {
    const currentArticle = createMockArticle({
      slug: 'current',
      tags: ['bitcoin', 'analysis'],
    });

    const articles = [
      currentArticle,
      createMockArticle({
        slug: 'related-1',
        tags: ['bitcoin', 'trading'],
        publishedAt: new Date('2024-01-15'),
      }),
      createMockArticle({
        slug: 'related-2',
        tags: ['analysis', 'market'],
        publishedAt: new Date('2024-01-10'),
      }),
      createMockArticle({
        slug: 'unrelated',
        tags: ['ethereum', 'defi'],
        publishedAt: new Date('2024-01-12'),
      }),
    ];

    it('returns related articles based on shared tags', () => {
      const related = getRelatedArticles(currentArticle, articles);
      
      expect(related).toHaveLength(2);
      expect(related.some(a => a.slug === 'related-1')).toBe(true);
      expect(related.some(a => a.slug === 'related-2')).toBe(true);
      expect(related.some(a => a.slug === 'current')).toBe(false);
    });

    it('excludes current article from results', () => {
      const related = getRelatedArticles(currentArticle, articles);
      expect(related.every(a => a.slug !== 'current')).toBe(true);
    });

    it('limits results to specified limit', () => {
      const related = getRelatedArticles(currentArticle, articles, 1);
      expect(related).toHaveLength(1);
    });

    it('fills with recent articles if not enough related', () => {
      const limitedArticles = [
        currentArticle,
        createMockArticle({
          slug: 'related-1',
          tags: ['bitcoin'],
          publishedAt: new Date('2024-01-15'),
        }),
        createMockArticle({
          slug: 'recent-1',
          tags: ['ethereum'],
          publishedAt: new Date('2024-01-12'),
        }),
      ];

      const related = getRelatedArticles(currentArticle, limitedArticles, 3);
      expect(related).toHaveLength(2); // 1 related + 1 recent
    });
  });
});