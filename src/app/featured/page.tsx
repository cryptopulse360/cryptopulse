import { Metadata } from 'next';
import { getAllArticles } from '@/lib/mdx';
import { filterArticles, sortArticles } from '@/lib/article-utils';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { generateSEOMetadata } from '@/components/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Featured Articles - CryptoPulse',
  description: 'Discover our hand-picked featured articles covering the most important topics in cryptocurrency and blockchain technology.',
  path: '/featured',
});

export default async function FeaturedPage() {
  const allArticles = await getAllArticles();
  const featuredArticles = sortArticles(
    filterArticles(allArticles, { featured: true }),
    'newest'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Featured', href: '/featured' }
        ]} 
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Articles
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover our hand-picked featured articles covering the most important topics in cryptocurrency and blockchain technology.
        </p>
      </div>

      {featuredArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            No featured articles yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're working on curating the best content for you. Check back soon!
          </p>
          <a
            href="/articles"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Browse All Articles
          </a>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {featuredArticles.length} featured article{featuredArticles.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="featured"
                className="h-full"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}