'use client';

import React, { useState, useEffect } from 'react';
import SearchModal from '@/components/search/SearchModal';
import { useAnalytics } from '@/hooks/useAnalytics';

export function SearchToggle() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { trackSearchOpen } = useAnalytics();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    trackSearchOpen();
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  // Add keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        handleSearchClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleSearchClick}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus-ring transition-colors"
        aria-label="Open search (Ctrl+K)"
        title="Search articles (Ctrl+K)"
        aria-keyshortcuts="Control+K"
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      
      <SearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
}