'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchInput from '@/components/search/SearchInput';
import SearchResults from '@/components/search/SearchResults';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useSearch } from '@/hooks/useSearch';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  
  const { results, isLoading, error } = useSearch(debouncedQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Search', href: '/search' }
        ]} 
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Search Articles
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Find articles about cryptocurrency, blockchain, and digital assets.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSubmit}>
          <SearchInput
            value={query}
            onChange={handleSearch}
            onSubmit={handleSubmit}
            placeholder="Search articles..."
            autoFocus={true}
          />
        </form>
      </div>

      <div className="max-w-4xl mx-auto">
        <SearchResults
          query={debouncedQuery}
          results={results}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}