import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about CryptoPulse - your premier source for cryptocurrency news, analysis, and insights.',
  openGraph: {
    title: 'About | CryptoPulse',
    description: 'Learn about CryptoPulse - your premier source for cryptocurrency news, analysis, and insights.',
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About CryptoPulse
            </h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                CryptoPulse is your premier destination for cryptocurrency news, market analysis, 
                and educational content in the rapidly evolving world of digital assets.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're dedicated to providing accurate, timely, and insightful coverage of the cryptocurrency 
                market. Our goal is to empower both newcomers and experienced traders with the knowledge 
                they need to navigate the complex world of digital currencies.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                What We Cover
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                <li>Breaking cryptocurrency news and market updates</li>
                <li>In-depth technical and fundamental analysis</li>
                <li>Educational guides for beginners and advanced users</li>
                <li>Reviews of exchanges, wallets, and DeFi platforms</li>
                <li>Regulatory developments and their market impact</li>
                <li>Emerging trends in blockchain technology</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Approach
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                At CryptoPulse, we believe in providing balanced, well-researched content that helps 
                our readers make informed decisions. We combine technical expertise with clear, 
                accessible writing to make complex cryptocurrency concepts understandable for everyone.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Join Our Community
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Stay connected with the latest developments in cryptocurrency by following us on social media 
                and subscribing to our newsletter. Join thousands of crypto enthusiasts who trust CryptoPulse 
                for their daily dose of market insights and analysis.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Disclaimer
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  The content on CryptoPulse is for informational purposes only and should not be 
                  considered financial advice. Cryptocurrency investments carry significant risk, 
                  and you should always do your own research before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}