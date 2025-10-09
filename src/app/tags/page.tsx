import React from 'react';
import { Metadata } from 'next';
import { getAllTags, getAllArticles } from '@/lib/mdx';
import { TagBadge } from '@/components/article/TagBadge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'All Tags - CryptoPulse',
  description: 'Browse all cryptocurrency and blockchain topics covered on CryptoPulse. Find articles by tags and categories.',
  openGraph: {
    title: 'All Tags - CryptoPulse',
    description: 'Browse all cryptocurrency and blockchain topics covered on CryptoPulse.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'All Tags - CryptoPulse',
    description: 'Browse all cryptocurrency and blockchain topics covered on CryptoPulse.',
  },
};

export default function TagsPage() {
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
  }).sort((a, b) => b.count - a.count); // Sort by count descending

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tags' }
          ]}
          className="mb-4"
        />
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          All Tags
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400">
          Browse articles by topic. We have {allTags.length} tags covering {allArticles.length} articles.
        </p>
      </div>

      {/* Tags Cloud */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Popular Tags
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {tagCounts.map(({ tag, count }) => (
            <div key={tag} className="flex items-center gap-2">
              <TagBadge 
                tag={tag} 
                size="md"
                className="relative"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({count})
              </span>
            </div>
          ))}
        </div>
        
        {allTags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No tags found. Articles will appear here once they are published with tags.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}