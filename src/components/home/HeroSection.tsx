import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn(
      'relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50',
      'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      'py-16 md:py-24',
      className
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main heading */}
          <h1 className="mb-7 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-6xl">
            CryptoPulse:{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Wire to the Future of Finance
            </span>
          </h1>

          {/* Subtitle 1 */}
          <p className="mb-6 text-xl font-semibold text-gray-700 dark:text-gray-200 sm:text-2xl md:text-3xl tracking-wide">
            Professional resources to understand and navigate digital assets
          </p>

          {/* Subtitle 2 */}
          <p className="mb-8 max-w-4xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
            Explore price analyses, forecasts, trend articles, educational guides, reviews, and in-depth strategies on cryptocurrency markets and blockchain technology.
          </p>


          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/articles"
              className={cn(
                'inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white',
                'transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900'
              )}
            >
              Explore Articles
              <svg 
                className="ml-2 h-4 w-4" 
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

            <Link
              href="/search"
              className={cn(
                'inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3',
                'text-base font-medium text-gray-700 transition-colors hover:bg-gray-50',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
                'dark:focus:ring-offset-gray-900'
              )}
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              Search Insights
            </Link>
          </div>

          {/* Stats or highlights */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Timely</div>
              <div className="text-l text-gray-600 dark:text-gray-400">Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">In-Depth</div>
              <div className="text-l text-gray-600 dark:text-gray-400">Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Educational</div>
              <div className="text-l text-gray-600 dark:text-gray-400">Resources</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
