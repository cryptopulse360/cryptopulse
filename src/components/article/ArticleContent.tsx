import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';
import { TagBadge } from './TagBadge';
import { formatDate, cn } from '@/lib/utils';
import { formatReadingTime } from '@/lib/reading-time';
import { getAuthorByName } from '@/lib/authors';

interface ArticleContentProps {
  article: Article;
  showHeroImage?: boolean;
  showTags?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showPublishedDate?: boolean;
  showUpdatedDate?: boolean;
  className?: string;
}

export function ArticleContent({
  article,
  showHeroImage = true,
  showTags = true,
  showAuthor = true,
  showReadingTime = true,
  showPublishedDate = true,
  showUpdatedDate = true,
  className
}: ArticleContentProps) {
  const {
    title,
    description,
    content,
    author,
    publishedAt,
    updatedAt,
    tags,
    heroImage,
    readingTime,
    featured
  } = article;

  return (
    <article className={cn('mx-auto max-w-4xl', className)}>
      {/* Header */}
      <header className="mb-8">
        {/* Featured badge */}
        {featured && (
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              Featured Article
            </span>
          </div>
        )}

        {/* Tags */}
        {showTags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} size="sm" />
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300 md:text-xl">
          {description}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {showAuthor && (
            <div className="flex items-center">
              <svg 
                className="mr-2 h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              {(() => {
                const authorData = getAuthorByName(author);
                if (authorData) {
                  return (
                    <Link 
                      href={`/authors/${authorData.slug}`}
                      className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
                    >
                      {author}
                    </Link>
                  );
                }
                return <span className="font-medium">{author}</span>;
              })()}
            </div>
          )}

          {showPublishedDate && (
            <div className="flex items-center">
              <svg 
                className="mr-2 h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <time dateTime={publishedAt.toISOString()}>
                Published {formatDate(publishedAt)}
              </time>
            </div>
          )}

          {showUpdatedDate && updatedAt && (
            <div className="flex items-center">
              <svg 
                className="mr-2 h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <time dateTime={updatedAt.toISOString()}>
                Updated {formatDate(updatedAt)}
              </time>
            </div>
          )}

          {showReadingTime && (
            <div className="flex items-center">
              <svg 
                className="mr-2 h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              {formatReadingTime(readingTime)}
            </div>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {showHeroImage && heroImage && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <Image
            src={heroImage}
            alt={title}
            width={800}
            height={450}
            className="aspect-video w-full object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div 
        className={cn(
          'prose prose-lg max-w-none',
          'prose-headings:text-gray-900 prose-headings:font-bold',
          'prose-p:text-gray-700 prose-p:leading-relaxed',
          'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-gray-900 prose-strong:font-semibold',
          'prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
          'prose-pre:bg-gray-900 prose-pre:text-gray-100',
          'prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4',
          'prose-img:rounded-lg prose-img:shadow-md',
          'prose-hr:border-gray-300',
          // Dark mode styles
          'dark:prose-invert',
          'dark:prose-headings:text-white',
          'dark:prose-p:text-gray-300',
          'dark:prose-a:text-blue-400',
          'dark:prose-strong:text-white',
          'dark:prose-code:text-pink-400 dark:prose-code:bg-gray-800',
          'dark:prose-blockquote:border-l-blue-400 dark:prose-blockquote:bg-blue-900/20',
          'dark:prose-hr:border-gray-600'
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
