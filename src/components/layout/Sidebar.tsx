import React from 'react';
import { LazyTagCloud, LazyNewsletterForm } from '@/components/ui/LazyComponents';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Tag Cloud Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <LazyTagCloud maxTags={8} showCounts={true} />
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Stay Updated
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get the latest crypto news and analysis delivered to your inbox.
        </p>
        <LazyNewsletterForm className="space-y-3" />
      </div>
      
      {/* Recent Articles - Placeholder for future implementation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Articles
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Recent articles component coming soon...
        </div>
      </div>
    </aside>
  );
}