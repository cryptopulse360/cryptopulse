import React from 'react';
import { Metadata } from 'next';
import { allAuthors } from '@/lib/authors';
import { siteConfig } from '@/lib/constants';
import AuthorCard from '@/components/authors/AuthorCard';

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Meet the team behind CryptoPulse - expert cryptocurrency analysts and writers.',
  openGraph: {
    title: 'Authors | CryptoPulse',
    description: 'Meet the team behind CryptoPulse - expert cryptocurrency analysts and writers.',
    url: `${siteConfig.url}/authors`,
  },
};

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Authors
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet the expert team behind CryptoPulse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allAuthors.map((author) => (
            <AuthorCard key={author.slug} author={author} />
          ))}
        </div>
      </div>
    </div>
  );
}