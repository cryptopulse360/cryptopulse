import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import { TagBadge } from './TagBadge';
import { formatDate } from '@/lib/utils';
import { formatReadingTime } from '@/lib/reading-time';

interface RelatedArticlesProps {
  articles: Article[];
  className?: string;
}

export function RelatedArticles({ articles, className = '' }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Related Articles
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <svg 
              className="mx-auto h-12 w-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No related articles found.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Check back later for more content!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg 
          className="mr-2 h-5 w-5 text-blue-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
          />
        </svg>
        Related Articles
      </h3>
      
      <div className="space-y-4">
        {articles.map((article) => (
          <article key={article.slug} className="group">
            <Link 
              href={`/articles/${article.slug}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-3 -m-3 transition-colors duration-200"
            >
              <div className="flex gap-3">
                {/* Article Image */}
                {article.heroImage && (
                  <div className="flex-shrink-0">
                    <Image
                      src={article.heroImage}
                      alt={article.title}
                      width={80}
                      height={60}
                      className="w-20 h-15 object-cover rounded-md"
                    />
                  </div>
                )}
                
                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h4>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {article.description}
                  </p>
                  
                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <TagBadge key={tag} tag={tag} size="sm" />
                      ))}
                      {article.tags.length > 2 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          +{article.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Meta information */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime={article.publishedAt.toISOString()}>
                      {formatDate(article.publishedAt)}
                    </time>
                    <span>•</span>
                    <span>{formatReadingTime(article.readingTime)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      
      {/* View More Link */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <Link 
          href="/articles"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center group"
        >
          View all articles
          <svg 
            className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" 
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
  );
}