'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load search modal (non-critical)
export const LazySearchModal = dynamic(
  () => import('@/components/search/SearchModal'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

// Lazy load newsletter form (below the fold)
export const LazyNewsletterForm = dynamic(
  () => import('@/components/layout/NewsletterForm').then(mod => ({ default: mod.NewsletterForm })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    ),
  }
);

// Lazy load related articles (below the fold)
export const LazyRelatedArticles = dynamic(
  () => import('@/components/article/RelatedArticles').then(mod => ({ default: mod.RelatedArticles })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    ),
  }
);

// Lazy load tag cloud (non-critical) - Static version for now
export const LazyTagCloud = dynamic(
  () => import('@/components/article/TagCloudStatic').then(mod => ({ default: mod.TagCloudStatic })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          ))}
        </div>
      </div>
    ),
  }
);

// Lazy load table of contents (below the fold)
export const LazyTableOfContents = dynamic(
  () => import('@/components/article/TableOfContents').then(mod => ({ default: mod.TableOfContents })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          ))}
        </div>
      </div>
    ),
  }
);

// Generic lazy wrapper for any component
export function createLazyComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  return dynamic(importFn, {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    ),
  });
}