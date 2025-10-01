import React from 'react';
import { TagBadge } from './TagBadge';

interface TagCloudStaticProps {
  maxTags?: number;
  showCounts?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export function TagCloudStatic({ 
  maxTags = 8, 
  showCounts = true, 
  size = 'sm',
  variant = 'outline',
  className = '' 
}: TagCloudStaticProps) {
  // Static popular tags based on common crypto topics
  const popularTags = [
    { tag: 'bitcoin', count: 15 },
    { tag: 'ethereum', count: 12 },
    { tag: 'defi', count: 10 },
    { tag: 'trading', count: 8 },
    { tag: 'analysis', count: 7 },
    { tag: 'market-trends', count: 6 },
    { tag: 'altcoins', count: 5 },
    { tag: 'regulation', count: 4 },
    { tag: 'technology', count: 4 },
    { tag: 'investment', count: 3 },
  ].slice(0, maxTags);

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Popular Tags
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {popularTags.map(({ tag, count }) => (
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