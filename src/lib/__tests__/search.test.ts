import { describe, it, expect, vi, beforeEach } from 'vitest';
import lunr from 'lunr';
import {
  createSearchIndex,
  generateSearchData,
  performSearch,
  highlightSearchTerms,
  extractSearchTerms,
  debounce,
} from '../search';
import { Article } from '@/types/article';

// Mock articles for testing
const mockArticles: Article[] = [
  {
    slug: 'bitcoin-analysis',
    title: 'Bitcoin Price Analysis',
    description: 'Comprehensive analysis of Bitcoin price trends',
    content: 'Bitcoin has shown significant growth in recent months. The cryptocurrency market is experiencing unprecedented volatility.',
    author: 'John Crypto',
    publishedAt: new Date('2024-01-15'),
    tags: ['bitcoin', 'analysis', 'price'],
    heroImage: '/images/bitcoin.jpg',
    readingTime: 5,
    featured: true,
  },
  {
    slug: 'ethereum-defi',
    title: 'Ethereum DeFi Revolution',
    description: 'How Ethereum is transforming decentralized finance',
    content: 'Ethereum blockchain has become the foundation for decentralized finance applications. Smart contracts enable innovative financial products.',
    author: 'Jane Smith',
    publishedAt: new Date('2024-01-10'),
    tags: ['ethereum', 'defi', 'blockchain'],
    heroImage: '/images/ethereum.jpg',
    readingTime: 7,
    featured: false,
  },
];

describe('Search Utilities', () => {
  describe('createSearchIndex', () => {
    it('should create a Lunr index from articles', () => {
      const index = createSearchIndex(mockArticles);
      expect(index).toBeInstanceOf(lunr.Index);
    });

    it('should include all specified fields in the index', () => {
      const index = createSearchIndex(mockArticles);
      const results = index.search('bitcoin');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('generateSearchData', () => {
    it('should generate search data from articles', () => {
      const searchData = generateSearchData(mockArticles);
      
      expect(searchData).toHaveLength(2);
      expect(searchData[0]).toMatchObject({
        slug: 'bitcoin-analysis',
        title: 'Bitcoin Price Analysis',
        description: 'Comprehensive analysis of Bitcoin price trends',
        tags: ['bitcoin', 'analysis', 'price'],
        author: 'John Crypto',
        url: '/articles/bitcoin-analysis',
      });
    });

    it('should truncate content for performance', () => {
      const searchData = generateSearchData(mockArticles);
      searchData.forEach((item) => {
        expect(item.content.length).toBeLessThanOrEqual(500);
      });
    });

    it('should convert publishedAt to ISO string', () => {
      const searchData = generateSearchData(mockArticles);
      expect(typeof searchData[0].publishedAt).toBe('string');
      expect(new Date(searchData[0].publishedAt)).toBeInstanceOf(Date);
    });
  });

  describe('performSearch', () => {
    let index: lunr.Index;
    let searchData: any[];

    beforeEach(() => {
      index = createSearchIndex(mockArticles);
      searchData = generateSearchData(mockArticles);
    });

    it('should return empty array for empty query', () => {
      const results = performSearch(index, searchData, '');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace query', () => {
      const results = performSearch(index, searchData, '   ');
      expect(results).toEqual([]);
    });

    it('should find articles by title', () => {
      const results = performSearch(index, searchData, 'bitcoin');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Bitcoin');
    });

    it('should find articles by content', () => {
      const results = performSearch(index, searchData, 'cryptocurrency');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find articles by tags', () => {
      const results = performSearch(index, searchData, 'defi');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tags).toContain('defi');
    });

    it('should find articles by author', () => {
      const results = performSearch(index, searchData, 'John Crypto');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].author).toBe('John Crypto');
    });

    it('should limit results', () => {
      const results = performSearch(index, searchData, 'the', 1);
      expect(results.length).toBeLessThanOrEqual(1);
    });

    it('should include score and matches', () => {
      const results = performSearch(index, searchData, 'bitcoin');
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('matches');
      expect(typeof results[0].score).toBe('number');
    });

    it('should handle search errors gracefully', () => {
      // Create a mock index that throws an error
      const errorIndex = {
        search: vi.fn().mockImplementation(() => {
          throw new Error('Search error');
        }),
      } as any;

      const results = performSearch(errorIndex, searchData, 'test');
      expect(results).toEqual([]);
    });
  });

  describe('highlightSearchTerms', () => {
    it('should highlight single term', () => {
      const text = 'Bitcoin is a cryptocurrency';
      const terms = ['bitcoin'];
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toContain('<mark');
      expect(result).toContain('Bitcoin');
    });

    it('should highlight multiple terms', () => {
      const text = 'Bitcoin and Ethereum are cryptocurrencies';
      const terms = ['bitcoin', 'ethereum'];
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toContain('<mark');
      expect((result.match(/<mark/g) || []).length).toBe(2);
    });

    it('should be case insensitive', () => {
      const text = 'BITCOIN is a cryptocurrency';
      const terms = ['bitcoin'];
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toContain('<mark');
      expect(result).toContain('BITCOIN');
    });

    it('should handle empty terms array', () => {
      const text = 'Bitcoin is a cryptocurrency';
      const terms: string[] = [];
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toBe(text);
    });

    it('should escape special regex characters', () => {
      const text = 'Price is $50,000 (approximately)';
      const terms = ['$50,000', '(approximately)'];
      const result = highlightSearchTerms(text, terms);
      
      expect(result).toContain('<mark');
    });
  });

  describe('extractSearchTerms', () => {
    it('should extract terms from query', () => {
      const query = 'bitcoin ethereum analysis';
      const terms = extractSearchTerms(query);
      
      expect(terms).toEqual(['bitcoin', 'ethereum', 'analysis']);
    });

    it('should handle multiple spaces', () => {
      const query = 'bitcoin    ethereum   analysis';
      const terms = extractSearchTerms(query);
      
      expect(terms).toEqual(['bitcoin', 'ethereum', 'analysis']);
    });

    it('should convert to lowercase', () => {
      const query = 'Bitcoin ETHEREUM Analysis';
      const terms = extractSearchTerms(query);
      
      expect(terms).toEqual(['bitcoin', 'ethereum', 'analysis']);
    });

    it('should remove special characters', () => {
      const query = 'bitcoin! ethereum? analysis.';
      const terms = extractSearchTerms(query);
      
      expect(terms).toEqual(['bitcoin', 'ethereum', 'analysis']);
    });

    it('should filter empty terms', () => {
      const query = 'bitcoin  ethereum';
      const terms = extractSearchTerms(query);
      
      expect(terms).not.toContain('');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should cancel previous calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      debouncedFn('first');
      debouncedFn('second');
      
      vi.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });

    it('should handle multiple arguments', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      debouncedFn('arg1', 'arg2', 'arg3');
      vi.advanceTimersByTime(300);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });
  });
});