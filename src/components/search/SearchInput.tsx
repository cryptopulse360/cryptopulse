'use client';

import React, { useEffect, useRef } from 'react';
import { SearchInputProps } from '@/types/search';

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search articles...',
  autoFocus = false,
  ...props
}: SearchInputProps & Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'onSubmit'>) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
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
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        aria-label="Search articles"
        role="searchbox"
        aria-keyshortcuts="Enter: Select, ArrowUp: Previous, ArrowDown: Next, Esc: Close"
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck="false"
        data-testid="search-input"
        {...props}
      />
    </div>
  );
}
