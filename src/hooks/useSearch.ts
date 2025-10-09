'use client';

import { useState, useEffect, useCallback } from 'react';
import lunr from 'lunr';
import { SearchResult, SearchIndex } from '@/types/search';
import { performSearch } from '@/lib/search';

interface UseSearchReturn {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  searchIndex: lunr.Index | null;
}

export function useSearch(query: string): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);
  const [searchData, setSearchData] = useState<SearchIndex[]>([]);

  // Load search index on first use
  useEffect(() => {
    if (!searchIndex) {
      loadSearchIndex();
    }
  }, [searchIndex]);

  const loadSearchIndex = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/search-index');
      if (response.ok) {
        const data = await response.json();
        
        // Check if we have a serialized index or raw data
        if (data.index && data.data) {
          setSearchIndex(lunr.Index.load(data.index));
          setSearchData(data.data);
        } else {
          // If we just have raw data, create the index
          setSearchData(data);
          const index = lunr(function () {
            this.ref('slug');
            this.field('title', { boost: 10 });
            this.field('description', { boost: 5 });
            this.field('content', { boost: 1 });
            this.field('tags', { boost: 3 });
            this.field('author', { boost: 2 });

            data.forEach((article: SearchIndex) => {
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
          setSearchIndex(index);
        }
      } else {
        throw new Error('Failed to load search index');
      }
    } catch (err) {
      console.error('Failed to load search index:', err);
      setError('Failed to load search index');
      
      // Create empty index as fallback
      const emptyIndex = lunr(function () {
        this.ref('slug');
        this.field('title');
        this.field('description');
        this.field('content');
        this.field('tags');
        this.field('author');
      });
      setSearchIndex(emptyIndex);
      setSearchData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform search when query changes
  useEffect(() => {
    if (!searchIndex || !query.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const searchResults = performSearch(searchIndex, searchData, query);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, searchIndex, searchData]);

  return {
    results,
    isLoading,
    error,
    searchIndex,
  };
}