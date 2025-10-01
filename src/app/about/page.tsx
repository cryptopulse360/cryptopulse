import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';
import { allAuthors } from '@/lib/authors';
import { AuthorCard } from '@/components/author/AuthorCard';

export const metadata: Metadata = {
  title: 'About CryptoPulse',
  description: 'Learn about CryptoPulse, your source for cryptocurrency news, analysis, and insights. Discover our mission, team, and commitment to providing accurate crypto information.',
  openGraph: {
    title: 'About CryptoPulse',
    description: 'Learn about CryptoPulse, your source for cryptocurrency news, analysis, and insights. Discover our mission, team, and commitment to providing accurate crypto information.',
    url: `${siteConfig.url}/about`,
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/images/og/home.svg`,
        width: 1200,
        height: 630,
        alt: 'About CryptoPulse',
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center py-16 mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About CryptoPulse</h1>
          <p className="mx-auto max-w-3xl text-xl md:text-2xl mb-8 text-center">
            Your resource for cryptocurrency news, analysis, and education.
          </p>

          <p className="mx-auto max-w-2xl text-lg md:text-xl mb-7 text-center">
            At CryptoPulse, we provide clear and reliable information on digital assets and blockchain technology. As an independent publication, we focus on delivering accurate insights to help readers make informed decisions in this evolving market.
          </p>

          <a 
            href="#team" 
            className="no-underline inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Meet Our Team
          </a>
        </section>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          At CryptoPulse, we make the world of blockchain and digital assets accessible and understandable. Whether you're new to the space or experienced, we provide information on news, analysis, and strategies to support your understanding.
        </p>

        <section className="mb-12">
          <h2 id="mission" className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            We aim to provide accessible and reliable information on cryptocurrency. We deliver straightforward analyses and guides to help readers understand market developments, from Bitcoin fundamentals to DeFi concepts.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🌟</span>
              </div>
              <h3 className="font-semibold mb-2">Informed Decisions</h3>
              <p className="text-sm">Knowledge to navigate markets with clarity.</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="font-semibold mb-2">Clear Explanations</h3>
              <p className="text-sm">Breaking down complex topics into understandable insights.</p>
            </div>
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 mt-6">
            <li>Unbiased news and analysis</li>
            <li>Blockchain basics and trends</li>
            <li>Supporting an inclusive community</li>
            <li>Enhancing understanding of digital assets</li>
          </ul>
        </section>

        <section id="team" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Our Team</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Meet the analysts, researchers, and experts behind CryptoPulse, dedicated to providing clear and reliable cryptocurrency insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAuthors.slice(0, 6).map((author) => (
              <div key={author.slug} className="transform hover:scale-105 transition-transform duration-300">
                <AuthorCard 
                  author={author} 
                  className="h-80" // Fixed height for uniform grid
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <a 
              href="/authors" 
              className="no-underline inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              View Full Team & Profiles
            </a>
          </div>
        </section>

        <section className="mb-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How We Create Content</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm">🔍</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Thorough Research</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Our articles are based on rigorous analysis and verified sources, providing context beyond basic headlines.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm">👥</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Reader-Focused</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">We design guides and analyses to be accessible for all levels, from beginners to advanced users.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Regular Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">We publish timely content to address developments in cryptocurrency markets.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 relative">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5"></div>
            <div className="relative">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Background</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
            CryptoPulse was founded in 2025 by individuals interested in cryptocurrency to provide a reliable source of information in the industry. We focus on delivering accurate insights and supporting education in the blockchain space.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Milestones</h3>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Founded in 2025</li>
                <li>• Offering in-depth guides, tutorials, and market analyses, continually expanding</li>
                <li>• Building a growing community</li>
              </ul>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Looking Ahead</h3>
              <p className="text-sm bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">We plan to expand coverage on Web3, NFTs, regulations, and interactive resources to support informed engagement with cryptocurrency.</p>
            </div>
          </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Why CryptoPulse?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Research-Based Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">Detailed examinations grounded in market data and trends</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Regular Content</h3>
              <p className="text-gray-600 dark:text-gray-300">Ongoing publications on news and developments</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Accessible</h3>
              <p className="text-gray-600 dark:text-gray-300">No paywalls—all content is freely available</p>
            </div>
          </div>
        </section>

        <section className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Stay Informed</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Join our newsletter for regular updates on cryptocurrency news, analyses, and insights.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/newsletter" 
                className="no-underline inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span className="mr-2">📧</span>
                Subscribe to Newsletter
              </a>
              <a 
                href={siteConfig.social.x} 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span className="mr-2"></span>
                Follow on X
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
