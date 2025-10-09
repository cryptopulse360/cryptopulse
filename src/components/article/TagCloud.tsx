import React from 'react';
import { TagBadge } from './TagBadge';

interface TagCloudProps {
  tagCounts: Array<{ tag: string; count: number }>;
  maxTags?: number;
  showCounts?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export function TagCloud({ 
  tagCounts,
  maxTags = 10, 
  showCounts = true, 
  size = 'sm',
  variant = 'outline',
  className = '' 
}: TagCloudProps) {
  // Limit to maxTags and sort by popularity
  const limitedTagCounts = tagCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, maxTags);

  if (limitedTagCounts.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tags available
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Popular Tags
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {limitedTagCounts.map(({ tag, count }) => (
          <div key={tag} className="flex items-center gap-1">
            <TagBadge 
              tag={tag} 
              size={size}
              variant={variant}
            />
            {showCounts && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({count})
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <a 
          href="/tags" 
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View all tags →
        </a>
      </div>
    </div>
  );
}