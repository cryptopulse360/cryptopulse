import React from 'react';
import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contact Us',
  description: 'Get in touch with the CryptoPulse team. Contact us for partnerships, feedback, or general inquiries about cryptocurrency news and analysis.',
  url: `${siteConfig.url}/contact`,
  canonical: `${siteConfig.url}/contact`,
});

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We welcome inquiries from readers. For questions, feedback, or partnerships, please contact us.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">General Inquiries</h3>
                <p className="text-gray-600 dark:text-gray-400">hello.cryptopulse@outlook.com</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Support</h3>
                <p className="text-gray-600 dark:text-gray-400">assistance.cryptopulse@outlook.com</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Business</h3>
                <p className="text-gray-600 dark:text-gray-400">business.cryptopulse@outlook.com</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Privacy & Legal</h3>
                <p className="text-gray-600 dark:text-gray-400">legal.cryptopulse@outlook.com</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">X (Twitter)</h3>
                <a 
                  href={siteConfig.social.x} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  @the_cryptopulse
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400">Latest updates and news</p>
              </div>
              
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Pinterest</h3>
                <a 
                  href={siteConfig.social.pinterest} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  @cryptopulse360
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400">Visual content and infographics</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How can I contribute content to CryptoPulse?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept guest contributions on cryptocurrency topics. Email hello.cryptopulse@outlook.com with your ideas, samples, and background. We review submissions and aim to respond within 5-7 business days.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Do you accept sponsored content or advertisements?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We maintain strict editorial independence and clearly label any sponsored content. For partnership 
                and advertising opportunities, please contact business.cryptopulse@outlook.com. All partnerships must 
                align with our values and provide genuine value to our readers.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How do I report an error or request a correction?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We strive for accuracy in all our content. If you notice an error or have additional information 
                that would improve an article, please email hello.cryptopulse@outlook.com with the article URL and 
                details about the correction needed.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Can I republish or syndicate CryptoPulse content?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our content is protected by copyright. For republishing, syndication, or licensing inquiries, 
                please contact legal.cryptopulse@outlook.com. We&apos;re open to partnerships that help spread quality 
                cryptocurrency education and news.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">How do I unsubscribe from your newsletter?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You can unsubscribe from our newsletter at any time by clicking the unsubscribe link at the 
                bottom of any email we send you. If you need assistance, contact assistance.cryptopulse@outlook.com.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Response Times</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
            <ul className="space-y-2">
              <li><strong>General inquiries:</strong> 1-2 business days</li>
              <li><strong>Editorial submissions:</strong> 5-7 business days</li>
              <li><strong>Partnership requests:</strong> 3-5 business days</li>
              <li><strong>Technical issues:</strong> 24-48 hours</li>
              <li><strong>Legal/Privacy matters:</strong> 2-3 business days</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Content Guidelines</h2>
          <p className="mb-4">
            If you&apos;re interested in contributing content, please note our guidelines:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Content must be original and not published elsewhere</li>
            <li>Articles should be well-researched and factually accurate</li>
            <li>We do not accept promotional content disguised as editorial</li>
            <li>All claims must be supported by credible sources</li>
            <li>Content should provide genuine value to our readers</li>
            <li>We reserve the right to edit submissions for clarity and style</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibent mb-4">Technical Support</h2>
          <p className="mb-4">
            Experiencing technical issues with our website? Here's how to get help:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Check our <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a> for information about cookies and tracking</li>
            <li>Try clearing your browser cache and cookies</li>
            <li>Ensure JavaScript is enabled in your browser</li>
            <li>For persistent issues, email hello@cryptopulse.com with your browser and device information</li>
          </ul>
        </section>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
          <p className="text-sm mb-4">
            Don&apos;t forget to subscribe to our newsletter for the latest cryptocurrency news, analysis, and insights 
            delivered directly to your inbox.
          </p>
          <a
            href="/newsletter"
            className="no-underline inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Subscribe to Newsletter
          </a>
        </div>
      </div>
    </div>
  );
}
