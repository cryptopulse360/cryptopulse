import { vi } from 'vitest';
import { 
  getAllTags, 
  getArticlesByTag, 
  getTagStats, 
  getRelatedArticles 
} from '../mdx';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';

// Mock fs module
vi.mock('fs');
vi.mock('path');

const mockArticles = [
  {
    slug: 'bitcoin-analysis',
    title: 'Bitcoin Analysis',
    description: 'Bitcoin market analysis',
    content: 'Bitcoin content',
    author: 'John Doe',
    publishedAt: new Date('2024-01-01'),
    tags: ['bitcoin', 'analysis', 'market'],
    heroImage: '/bitcoin.jpg',
    readingTime: 5,
    featured: true,
  },
  {
    slug: 'ethereum-defi',
    title: 'Ethereum DeFi',
    description: 'Ethereum DeFi overview',
    content: 'Ethereum content',
    author: 'Jane Smith',
    publishedAt: new Date('2024-01-02'),
    tags: ['ethereum', 'defi', 'analysis'],
    heroImage: '/ethereum.jpg',
    readingTime: 7,
    featured: false,
  },
  {
    slug: 'nft-trends',
    title: 'NFT Trends',
    description: 'Latest NFT trends',
    content: 'NFT content',
    author: 'Bob Johnson',
    publishedAt: new Date('2024-01-03'),
    tags: ['nft', 'trends', 'market'],
    heroImage: '/nft.jpg',
    readingTime: 4,
    featured: false,
  },
];

// Mock getAllArticles to return our test data
vi.mock('../mdx', async () => {
  const actual = await vi.importActual('../mdx');
  return {
    ...actual,
    getAllArticles: vi.fn(() => mockArticles),
    getArticleBySlug: vi.fn((slug: string) => 
      mockArticles.find(article => article.slug === slug) || null
    ),
  };
});

describe('Tag Utilities', () => {
  describe('getAllTags', () => {
    it('returns all unique tags sorted alphabetically', () => {
      const tags = getAllTags();
      
      expect(tags).toEqual([
        'analysis', 'bitcoin', 'defi', 'ethereum', 'market', 'nft', 'trends'
      ]);
    });
  });

  describe('getArticlesByTag', () => {
    it('returns articles with matching tag (case insensitive)', () => {
      const articles = getArticlesByTag('bitcoin');
      
      expect(articles).toHaveLength(1);
      expect(articles[0].slug).toBe('bitcoin-analysis');
    });

    it('returns articles with matching tag in different case', () => {
      const articles = getArticlesByTag('BITCOIN');
      
      expect(articles).toHaveLength(1);
      expect(articles[0].slug).toBe('bitcoin-analysis');
    });

    it('returns multiple articles for common tags', () => {
      const articles = getArticlesByTag('analysis');
      
      expect(articles).toHaveLength(2);
      expect(articles.map(a => a.slug)).toContain('bitcoin-analysis');
      expect(articles.map(a => a.slug)).toContain('ethereum-defi');
    });

    it('returns empty array for non-existent tag', () => {
      const articles = getArticlesByTag('nonexistent');
      
      expect(articles).toHaveLength(0);
    });
  });

  describe('getTagStats', () => {
    it('returns tag statistics sorted by count', () => {
      const stats = getTagStats();
      
      expect(stats).toEqual([
        { tag: 'analysis', count: 2 },
        { tag: 'market', count: 2 },
        { tag: 'bitcoin', count: 1 },
        { tag: 'defi', count: 1 },
        { tag: 'ethereum', count: 1 },
        { tag: 'nft', count: 1 },
        { tag: 'trends', count: 1 },
      ]);
    });
  });

  describe('getRelatedArticles', () => {
    it('returns related articles based on shared tags', () => {
      const related = getRelatedArticles('bitcoin-analysis', 5);
      
      expect(related).toHaveLength(2);
      // Should include ethereum-defi (shares 'analysis') and nft-trends (shares 'market')
      expect(related.map(a => a.slug)).toContain('ethereum-defi');
      expect(related.map(a => a.slug)).toContain('nft-trends');
    });

    it('limits results to maxResults parameter', () => {
      const related = getRelatedArticles('bitcoin-analysis', 1);
      
      expect(related).toHaveLength(1);
    });

    it('returns empty array for article with no shared tags', async () => {
      // Mock an article with unique tags
      const { getArticleBySlug } = await import('../mdx');
      vi.mocked(getArticleBySlug).mockReturnValueOnce({
        slug: 'unique-article',
        tags: ['unique-tag'],
        title: 'Unique Article',
        description: 'Description',
        content: 'Content',
        author: 'Author',
        publishedAt: new Date('2024-01-01'),
        heroImage: '/image.jpg',
        readingTime: 5,
        featured: false,
      });

      const related = getRelatedArticles('unique-article', 5);
      
      expect(related).toHaveLength(0);
    });

    it('returns empty array for non-existent article', () => {
      const related = getRelatedArticles('non-existent-slug', 5);
      
      expect(related).toHaveLength(0);
    });

    it('excludes the current article from results', () => {
      const related = getRelatedArticles('bitcoin-analysis', 5);
      
      expect(related.map(a => a.slug)).not.toContain('bitcoin-analysis');
    });
  });
});