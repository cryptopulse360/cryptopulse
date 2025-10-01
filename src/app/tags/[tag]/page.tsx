import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTags, getArticlesByTag } from '@/lib/mdx';
import { ArticleCard } from '@/components/article/ArticleCard';
import { TagBadge } from '@/components/article/TagBadge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { formatTag } from '@/lib/utils';
import { generateSEOMetadata, generateCanonicalUrl } from '@/components/seo';
import { generateTagUrl } from '@/lib/seo';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = params;
  const articles = getArticlesByTag(tag);
  
  if (articles.length === 0) {
    return {
      title: 'Tag Not Found',
    };
  }

  const formattedTag = formatTag(tag);
  const articleCount = articles.length;
  const tagUrl = generateTagUrl(tag);
  const canonicalUrl = generateCanonicalUrl(`/tags/${tag}`);
  
  return generateSEOMetadata({
    title: `${formattedTag} Articles`,
    description: `Explore ${articleCount} articles about ${formattedTag} on CryptoPulse. Stay updated with the latest crypto news and analysis.`,
    url: tagUrl,
    canonical: canonicalUrl,
  });
}

export default function TagPage({ params }: TagPageProps) {
  const { tag } = params;
  const articles = getArticlesByTag(tag);
  
  if (articles.length === 0) {
    notFound();
  }

  const formattedTag = formatTag(tag);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tags', href: '/tags' },
            { label: formattedTag }
          ]}
          className="mb-4"
        />
        
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {formattedTag}
          </h1>
          <TagBadge tag={tag} clickable={false} variant="secondary" />
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          {articles.length} article{articles.length !== 1 ? 's' : ''} tagged with {formattedTag}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}