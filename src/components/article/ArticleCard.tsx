import React from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';
import { TagBadge } from './TagBadge';
import { formatDate, getRelativeTime, cn } from '@/lib/utils';
import { formatReadingTime } from '@/lib/reading-time';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { getAuthorByName } from '@/lib/authors';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  showImage?: boolean;
  showTags?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  variant = 'default',
  showImage = true,
  showTags = true,
  showAuthor = true,
  showReadingTime = true,
  className
}: ArticleCardProps) {
  const {
    slug,
    title,
    description,
    author,
    publishedAt,
    tags,
    heroImage,
    readingTime,
    featured
  } = article;

  const cardClasses = cn(
    'group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200',
    'hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    variant === 'default' && 'p-6',
    variant === 'featured' && 'p-8 md:p-10',
    variant === 'compact' && 'p-4',
    className
  );

  const imageClasses = cn(
    'object-cover transition-transform duration-200 group-hover:scale-105',
    variant === 'default' && 'aspect-video w-full rounded-lg',
    variant === 'featured' && 'aspect-[16/9] w-full rounded-xl',
    variant === 'compact' && 'aspect-square w-20 rounded-md'
  );

  return (
    <article className={cardClasses}>
      <Link href={`/articles/${slug}`} className="block">
        {/* Featured badge */}
        {featured && variant === 'featured' && (
          <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              Highlighted
            </span>
          </div>
        )}

        {/* Image */}
        {showImage && heroImage && (
          <div className={cn(
            'relative overflow-hidden',
            variant === 'compact' ? 'float-left mr-4 mb-2' : 'mb-4'
          )}>
            <OptimizedImage
              src={heroImage}
              alt={title}
              width={variant === 'compact' ? 80 : 600}
              height={variant === 'compact' ? 80 : 400}
              className={imageClasses}
              priority={featured}
              sizes={variant === 'compact' ? '80px' : variant === 'featured' ? '(max-width: 768px) 100vw, 600px' : '(max-width: 768px) 100vw, 400px'}
            />
          </div>
        )}

        {/* Content */}
        <div className={cn(
          variant === 'compact' && showImage ? 'overflow-hidden' : ''
        )}>
          {/* Tags */}
          {showTags && tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.slice(0, variant === 'compact' ? 2 : 3).map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  size={variant === 'featured' ? 'md' : 'sm'}
                  clickable={false}
                />
              ))}
              {tags.length > (variant === 'compact' ? 2 : 3) && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{tags.length - (variant === 'compact' ? 2 : 3)} more
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className={cn(
            'font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400',
            'transition-colors duration-200 overflow-hidden',
            variant === 'default' && 'text-xl mb-3',
            variant === 'featured' && 'text-2xl md:text-3xl mb-4',
            variant === 'compact' && 'text-base mb-2'
          )}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: variant === 'featured' ? 3 : 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {title}
          </h3>

          {/* Description */}
          <p className={cn(
            'text-gray-600 dark:text-gray-300 mb-4 overflow-hidden',
            (variant === 'default' || variant === 'compact') && 'text-sm',
            variant === 'featured' && 'text-base'
          )}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: variant === 'featured' ? 4 : variant === 'compact' ? 2 : 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {description}
          </p>

          {/* Meta information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 dark:text-gray-400 gap-1 sm:gap-0">
            <div className="flex items-center space-x-4">
              {showAuthor && (
                <span className="flex items-center">
                  <span className="font-medium">{author}</span>
                </span>
              )}
              
              <time 
                dateTime={publishedAt.toISOString()}
                className="flex items-center"
                title={formatDate(publishedAt)}
              >
                {getRelativeTime(publishedAt)}
              </time>
            </div>

            {showReadingTime && (
              <span className="flex items-center">
                <svg 
                  className="mr-1 h-4 w-4" 
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
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
