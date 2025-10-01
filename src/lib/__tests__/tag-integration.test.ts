import { describe, it, expect } from 'vitest';
import { 
  getAllTags, 
  getArticlesByTag, 
  getTagStats, 
  getRelatedArticles 
} from '../mdx';

describe('Tag System Integration Tests', () => {
  describe('getAllTags', () => {
    it('returns tags from existing articles', () => {
      const tags = getAllTags();
      
      // Should include tags from our sample articles
      expect(tags).toContain('bitcoin');
      expect(tags).toContain('ethereum');
      expect(tags).toContain('defi');
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
    });

    it('returns tags in alphabetical order', () => {
      const tags = getAllTags();
      const sortedTags = [...tags].sort();
      
      expect(tags).toEqual(sortedTags);
    });
  });

  describe('getArticlesByTag', () => {
    it('returns articles with bitcoin tag', () => {
      const articles = getArticlesByTag('bitcoin');
      
      expect(Array.isArray(articles)).toBe(true);
      // Should find at least one article with bitcoin tag
      if (articles.length > 0) {
        expect(articles[0]).toHaveProperty('slug');
        expect(articles[0]).toHaveProperty('title');
        expect(articles[0]).toHaveProperty('tags');
        expect(articles[0].tags).toContain('bitcoin');
      }
    });

    it('returns articles with ethereum tag', () => {
      const articles = getArticlesByTag('ethereum');
      
      expect(Array.isArray(articles)).toBe(true);
      if (articles.length > 0) {
        expect(articles[0].tags).toContain('ethereum');
      }
    });

    it('returns empty array for non-existent tag', () => {
      const articles = getArticlesByTag('non-existent-tag-xyz');
      
      expect(articles).toEqual([]);
    });

    it('is case insensitive', () => {
      const lowerCase = getArticlesByTag('bitcoin');
      const upperCase = getArticlesByTag('BITCOIN');
      
      expect(lowerCase).toEqual(upperCase);
    });
  });

  describe('getTagStats', () => {
    it('returns tag statistics with counts', () => {
      const stats = getTagStats();
      
      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBeGreaterThan(0);
      
      // Each stat should have tag and count properties
      stats.forEach(stat => {
        expect(stat).toHaveProperty('tag');
        expect(stat).toHaveProperty('count');
        expect(typeof stat.tag).toBe('string');
        expect(typeof stat.count).toBe('number');
        expect(stat.count).toBeGreaterThan(0);
      });
    });

    it('returns stats sorted by count (descending)', () => {
      const stats = getTagStats();
      
      if (stats.length > 1) {
        for (let i = 0; i < stats.length - 1; i++) {
          expect(stats[i].count).toBeGreaterThanOrEqual(stats[i + 1].count);
        }
      }
    });
  });

  describe('getRelatedArticles', () => {
    it('returns related articles based on shared tags', () => {
      // First get an article that exists
      const allTags = getAllTags();
      if (allTags.length > 0) {
        const articlesWithFirstTag = getArticlesByTag(allTags[0]);
        if (articlesWithFirstTag.length > 0) {
          const firstArticle = articlesWithFirstTag[0];
          const related = getRelatedArticles(firstArticle.slug, 5);
          
          expect(Array.isArray(related)).toBe(true);
          // Should not include the original article
          expect(related.find(a => a.slug === firstArticle.slug)).toBeUndefined();
        }
      }
    });

    it('respects maxResults parameter', () => {
      const allTags = getAllTags();
      if (allTags.length > 0) {
        const articlesWithFirstTag = getArticlesByTag(allTags[0]);
        if (articlesWithFirstTag.length > 0) {
          const firstArticle = articlesWithFirstTag[0];
          const related = getRelatedArticles(firstArticle.slug, 2);
          
          expect(related.length).toBeLessThanOrEqual(2);
        }
      }
    });

    it('returns empty array for non-existent article', () => {
      const related = getRelatedArticles('non-existent-article-slug', 5);
      
      expect(related).toEqual([]);
    });
  });
});