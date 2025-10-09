import React from 'react';
import { getAllTags, getAllArticles } from '@/lib/mdx';
import { TagCloud } from './TagCloud';

interface TagCloudServerProps {
  maxTags?: number;
  showCounts?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export function TagCloudServer(props: TagCloudServerProps) {
  const allTags = getAllTags();
  const allArticles = getAllArticles();
  
  // Calculate article count for each tag
  const tagCounts = allTags.map(tag => {
    const count = allArticles.filter(article => 
      article.tags.some(articleTag => 
        articleTag.toLowerCase() === tag.toLowerCase()
      )
    ).length;
    return { tag, count };
  });

  return <TagCloud tagCounts={tagCounts} {...props} />;
}