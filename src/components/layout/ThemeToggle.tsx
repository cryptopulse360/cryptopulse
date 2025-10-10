'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnalytics } from '@/hooks/useAnalytics';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { trackTheme } = useAnalytics();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus-ring transition-colors"
        aria-label="Loading theme toggle"
        disabled
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>
    );
  }

  const cycleTheme = () => {
    let newTheme: string;
    if (theme === 'light') {
      newTheme = 'dark';
      setTheme('dark');
    } else if (theme === 'dark') {
      newTheme = 'system';
      setTheme('system');
    } else {
      newTheme = 'light';
      setTheme('light');
    }
    
    // Track theme change
    trackTheme(newTheme);
  };

  const getIcon = () => {
    if (theme === 'system') {
      return (
        // Computer/System icon
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
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (resolvedTheme === 'dark') {
      return (
        // Sun icon for switching to light mode
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    } else {
      return (
        // Moon icon for switching to dark mode
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    }
  };

  const getAriaLabel = () => {
    if (theme === 'light') {
      return 'Switch to dark mode';
    } else if (theme === 'dark') {
      return 'Switch to system theme';
    } else {
      return 'Switch to light mode';
    }
  };

  const getTitle = () => {
    return `Current: ${theme === 'system' ? `system (${resolvedTheme})` : theme}. Click to cycle themes.`;
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus-ring transition-colors"
      aria-label={getAriaLabel()}
      title={getTitle()}
    >
      {getIcon()}
    </button>
  );
}

// Default export for backward compatibility
export default ThemeToggle;