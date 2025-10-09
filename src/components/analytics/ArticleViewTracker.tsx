'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Article } from '@/types/article';

interface ArticleViewTrackerProps {
  article: Pick<Article, 'slug' | 'title' | 'tags'>;
}

/**
 * Client component to track article views
 * This component should be included in article pages to track page views
 */
export function ArticleViewTracker({ article }: ArticleViewTrackerProps) {
  const { trackArticle } = useAnalytics();

  useEffect(() => {
    // Track article view when component mounts
    trackArticle(article.slug, article.title, article.tags);
  }, [article.slug, article.title, article.tags, trackArticle]);

  // This component doesn't render anything
  return null;
}