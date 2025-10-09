'use client';

import React from 'react';
import Link from 'next/link';
import { SearchResultsProps } from '@/types/search';
import { highlightSearchTerms, extractSearchTerms } from '@/lib/search';
import { TagBadge } from '@/components/article/TagBadge';

export default function SearchResults({
  results,
  query,
  isLoading,
  onResultClick,
  selectedIndex = -1,
}: SearchResultsProps) {
  const searchTerms = extractSearchTerms(query);
  const resultsId = 'search-results';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" aria-hidden="true"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400" role="status">
        <svg
          className="mx-auto h-12 w-12 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p>Start typing to search articles...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400" role="status" aria-live="polite">
        <svg
          className="mx-auto h-12 w-12 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.709"
          />
        </svg>
        <p>No articles found for &quot;{query}&quot;</p>
        <p className="text-sm mt-2">Try different keywords or check your spelling</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="region" aria-labelledby="search-results-heading">
      <div 
        id="search-results-heading"
        className="text-sm text-gray-600 dark:text-gray-400 mb-4"
        role="status"
        aria-live="polite"
      >
        Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
      </div>
      
      <ul className="space-y-4" role="listbox" aria-labelledby="search-results-heading">
        {results.map((result, index) => (
          <li key={result.slug} role="option" aria-selected={index === selectedIndex}>
            <Link
              href={result.url}
              onClick={() => onResultClick(result)}
              className={`block p-4 border rounded-lg transition-colors focus-ring ${
                index === selectedIndex
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-describedby={`result-${index}-meta`}
            >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
                dangerouslySetInnerHTML={{
                  __html: highlightSearchTerms(result.title, searchTerms)
                }}
              />
              
              <p 
                className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: highlightSearchTerms(result.description, searchTerms)
                }}
              />
              
              <div id={`result-${index}-meta`} className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>By {result.author}</span>
                <span aria-hidden="true">•</span>
                <time dateTime={result.publishedAt}>
                  {new Date(result.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              
              {result.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag} tag={tag} size="sm" />
                  ))}
                  {result.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{result.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-shrink-0">
              <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded" aria-label={`${Math.round(result.score * 100)} percent match`}>
                {Math.round(result.score * 100)}% match
              </div>
            </div>
          </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}