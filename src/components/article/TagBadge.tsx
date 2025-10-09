import React from 'react';

interface TagBadgeProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  source?: string;
}

export function TagBadge({ tag, size = 'md', source }: TagBadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.75 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.75 text-xs';
  // Use source to customize color if needed, e.g., different backgrounds
  const colorClasses = source === 'external' ? 'bg-gray-200 text-gray-800' : baseClasses;
  
  return (
    <span className={`${baseClasses} ${sizeClasses}`}>
      {tag}
    </span>
  );
}
