import React from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';
import { ArticleCard } from '@/components/article/ArticleCard';
import { cn } from '@/lib/utils';

interface FeaturedSectionProps {
  articles: Article[];
  className?: string;
}

export function FeaturedSection({ articles, className }: FeaturedSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  const [mainFeatured, ...otherFeatured] = articles;

  return (
    <section className={cn('py-12 md:py-16', className)}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Articles
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Selected analyses and insights
            </p>
          </div>
          
            <Link
              href="/articles?featured=true"
              className={cn(
                'hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:block',
                'dark:text-blue-400 dark:hover:text-blue-300'
              )}
            >
              Explore featured articles →
            </Link>
        </div>

        {/* Featured articles grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main featured article - takes up 2 columns on large screens */}
          {mainFeatured && (
            <div className="lg:col-span-2">
              <ArticleCard
                article={mainFeatured}
                variant="featured"
                className="h-full"
              />
            </div>
          )}

          {/* Other featured articles */}
          {otherFeatured.length > 0 && (
            <div className="space-y-6">
              {otherFeatured.slice(0, 2).map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  variant="compact"
                  showImage={true}
                  showTags={true}
                  showAuthor={true}
                  showReadingTime={true}
                />
              ))}
              
              {/* Show "View all" link on mobile */}
              <div className="sm:hidden">
                <Link
                  href="/articles?featured=true"
                  className={cn(
                    'inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700',
                    'dark:text-blue-400 dark:hover:text-blue-300'
                  )}
                >
                  View all featured articles
                  <svg 
                    className="ml-1 h-4 w-4" 
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
            </div>
          )}
        </div>

        {/* Fallback for single featured article */}
        {articles.length === 1 && (
          <div className="mt-8 text-center">
            <Link
              href="/articles"
              className={cn(
                'inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700',
                'dark:text-blue-400 dark:hover:text-blue-300'
              )}
            >
              Explore more articles
              <svg 
                className="ml-1 h-4 w-4" 
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
        )}
      </div>
    </section>
  );
}
