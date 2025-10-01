import { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { generateSEOMetadata } from '@/components/seo';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Articles',
  description: 'Browse our collection of cryptocurrency analyses, news, and educational content',
});

const categoryConfig = [
  {
    name: 'Breaking News',
    slug: 'breaking-news',
    description: 'Coverage of events in cryptocurrency including regulation changes, security incidents, ETF developments, and partnerships.'
  },
  {
    name: 'Price Analyses / Forecasts',
    slug: 'price-analyses-forecasts',
    description: 'Reviews of price movements for BTC, ETH, and altcoins with charts, support/resistance levels, and sentiment analysis.'
  },
  {
    name: 'Trend Articles',
    slug: 'trend-articles',
    description: 'Examination of industry trends like Layer-2 solutions, asset tokenization, and DeFi developments.'
  },
  {
    name: 'Educational / Glossary Articles',
    slug: 'educational-glossary-articles',
    description: 'Explanations of cryptocurrency basics like staking and blockchain, suitable for beginners.'
  },
  {
    name: 'Top Lists / Rankings',
    slug: 'top-lists-rankings',
    description: 'Rankings of exchanges, wallets, and coins with pros, cons, and considerations.'
  },
  {
    name: 'How-To Guides',
    slug: 'how-to-guides',
    description: 'Step-by-step instructions for buying Bitcoin, setting up wallets, and staking ETH.'
  },
  {
    name: 'Coin / Tool Reviews',
    slug: 'coin-tool-reviews',
    description: 'Reviews of coins, projects, and tools focusing on features, pros, cons, and security.'
  },
  {
    name: 'Strategy / Deep Dive Articles',
    slug: 'strategy-deep-dive-articles',
    description: 'Strategies for cryptocurrency investment and DeFi participation.'
  }
];

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Articles', href: '/articles' }
        ]} 
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Articles
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse our collection of cryptocurrency analyses, news, and educational content, organized by category
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Content Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryConfig.map((category) => (
            <Link
              key={category.slug}
              href={`/articles/${category.slug}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Select a category above to explore our analyses and content
        </p>
      </div>
    </div>
  );
}
