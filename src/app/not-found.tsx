import Link from 'next/link';
import { SearchToggle } from '@/components/layout/SearchToggle';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <SearchToggle />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go Home
            </Link>
            
            <Link
              href="/articles"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Browse Articles
            </Link>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Popular Sections
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/tags/bitcoin"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Bitcoin News
              </Link>
              <Link
                href="/tags/ethereum"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ethereum Updates
              </Link>
              <Link
                href="/tags/defi"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                DeFi Analysis
              </Link>
              <Link
                href="/tags/market-analysis"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Market Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}