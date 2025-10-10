'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import lunr from 'lunr';
import { SearchModalProps, SearchResult, SearchIndex } from '@/types/search';
import { performSearch, debounce } from '@/lib/search';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trapFocus, announceToScreenReader } from '@/lib/accessibility';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);
  const [searchData, setSearchData] = useState<SearchIndex[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { trackSearchQuery } = useAnalytics();

  // Load search index and data
  useEffect(() => {
    if (isOpen && !searchIndex) {
      loadSearchIndex();
    }
  }, [isOpen, searchIndex]);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleResultClick = useCallback((result: SearchResult) => {
    router.push(result.url);
    onClose();
    setQuery('');
    setResults([]);
  }, [router, onClose]);

  // Handle keyboard navigation and focus management
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          } else if (results.length > 0) {
            handleResultClick(results[0]);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Set up focus trap
      if (modalRef.current) {
        cleanup = trapFocus(modalRef.current);
      }

      // Announce modal opening to screen readers
      announceToScreenReader('Search modal opened. Type to search articles.');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (cleanup) {
        cleanup();
      }
    };
  }, [isOpen, onClose, results, selectedIndex, handleResultClick]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const loadSearchIndex = async () => {
    try {
      const response = await fetch('/api/search-index');
      if (response.ok) {
        const { index, data } = await response.json();
        if (index) {
          setSearchIndex(lunr.Index.load(index));
          setSearchData(data || []);
        } else {
          // Create empty index if no index returned
          setSearchIndex(lunr(function () {
            this.ref('slug');
            this.field('title');
            this.field('description');
            this.field('content');
            this.field('tags');
            this.field('author');
          }));
          setSearchData([]);
        }
      } else {
        // Fallback: create empty index
        console.warn('Search index not available, creating empty index');
        setSearchIndex(lunr(function () {
          this.ref('slug');
          this.field('title');
          this.field('description');
          this.field('content');
          this.field('tags');
          this.field('author');
        }));
        setSearchData([]);
      }
    } catch (error) {
      console.error('Failed to load search index:', error);
      // Create empty index as fallback
      setSearchIndex(lunr(function () {
        this.ref('slug');
        this.field('title');
        this.field('description');
        this.field('content');
        this.field('tags');
        this.field('author');
      }));
      setSearchData([]);
    }
  };

  const performSearchWithDebounce = useCallback((searchQuery: string) => {
    if (!searchIndex) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      const searchResults = performSearch(searchIndex, searchData, searchQuery);
      setResults(searchResults);
      
      // Track search query with results count
      trackSearchQuery(searchQuery, searchResults.length);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      
      // Track failed search
      trackSearchQuery(searchQuery, 0);
    } finally {
      setIsLoading(false);
    }
  }, [searchIndex, searchData, trackSearchQuery]);

  const debouncedSearch = useCallback(
    debounce(performSearchWithDebounce, 300),
    [performSearchWithDebounce]
  );

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim()) {
      setIsLoading(true);
      debouncedSearch(newQuery);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (results.length > 0) {
      handleResultClick(results[0]);
    }
  };



  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="search-modal"
      role="dialog"
      aria-modal="true"
    >
        <div
          className="flex items-start justify-center min-h-screen pt-16 px-4 pb-20 text-center sm:block sm:p-0"
        >
        {/* Background overlay */}
        <div 
          data-testid="search-backdrop" 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleBackdropClick}
        />

        {/* Modal panel */}
        <div 
          ref={modalRef}
          className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Search Articles
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus-ring rounded-md p-1"
  aria-label="Close search modal"
                type="button"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <div className="mt-4">
<SearchInput
  value={query}
  onChange={handleQueryChange}
  onSubmit={handleSubmit}
  autoFocus={isOpen}
/>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-900 px-6 py-4 max-h-96 overflow-y-auto" role="region">
            <SearchResults
              results={results}
              query={query}
              isLoading={isLoading}
              onResultClick={handleResultClick}
              selectedIndex={selectedIndex}
            />
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span>Press Enter to select first result</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
