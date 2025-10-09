import React from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';
import { ArticleCard } from '@/components/article/ArticleCard';
import { cn } from '@/lib/utils';

interface LatestSectionProps {
  articles: Article[];
  className?: string;
}

export function LatestSection({ articles, className }: LatestSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50', className)}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latest Articles
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Stay positioned ahead of market-moving developments
            </p>
          </div>
          
          <Link
            href="/articles"
            className={cn(
              'hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:block',
              'dark:text-blue-400 dark:hover:text-blue-300'
            )}
          >
            View complete library →
          </Link>
        </div>

        {/* Articles grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              variant="default"
              showImage={true}
              showTags={true}
              showAuthor={true}
              showReadingTime={true}
            />
          ))}
        </div>

        {/* Load more / View all section */}
        <div className="mt-12 text-center">
          <Link
            href="/articles"
            className={cn(
              'inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3',
              'text-base font-medium text-gray-700 transition-colors hover:bg-gray-50',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
              'dark:focus:ring-offset-gray-900'
            )}
          >
            Access Full Article Archive
            <svg 
              className="ml-2 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        </div>

        {/* Newsletter signup teaser */}
        <div className="mt-16 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            VIP Newsletter
          </h3>
          <p className="mb-6 text-blue-100">
            Get institutional-grade crypto intelligence delivered to you.
          </p>
          <Link
            href="/newsletter"
            className={cn(
              'inline-flex items-center justify-center rounded-lg bg-white px-6 py-3',
              'text-base font-medium text-blue-600 transition-colors hover:bg-gray-50',
              'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600'
            )}
          >
            Join Elite Subscribers
          </Link>
        </div>
      </div>
    </section>
  );
}
