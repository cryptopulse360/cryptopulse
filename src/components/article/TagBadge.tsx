'use client';

import React from 'react';
import Link from 'next/link';
import { cn, formatTag } from '@/lib/utils';
import { useAnalytics } from '@/hooks/useAnalytics';

interface TagBadgeProps {
  tag: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  className?: string;
  source?: string; // For analytics tracking
}

export function TagBadge({ 
  tag, 
  variant = 'default', 
  size = 'md', 
  clickable = true,
  className,
  source = 'unknown'
}: TagBadgeProps) {
  const { trackTag } = useAnalytics();
  const baseClasses = cn(
    'inline-flex items-center font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'dark:focus:ring-offset-gray-900',
    // Size variants
    size === 'sm' && 'px-2 py-1 text-xs rounded',
    size === 'md' && 'px-2.5 py-1.5 text-sm rounded-md',
    size === 'lg' && 'px-3 py-2 text-base rounded-lg',
    // Color variants
    variant === 'default' && 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50',
    variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    variant === 'secondary' && 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    className
  );

  const formattedTag = formatTag(tag);

  const handleTagClick = () => {
    trackTag(tag, source);
  };

  if (!clickable) {
    return (
      <span className={baseClasses}>
        {formattedTag}
      </span>
    );
  }

  return (
    <Link 
      href={`/tags/${tag}`}
      className={baseClasses}
      aria-label={`View all articles tagged with ${formattedTag}`}
      onClick={handleTagClick}
    >
      {formattedTag}
    </Link>
  );
}