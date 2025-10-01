import React from 'react';
import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Disclaimer',
  description: 'Important disclaimers regarding cryptocurrency content, investment advice, and risk warnings for CryptoPulse readers.',
  url: `${siteConfig.url}/disclaimer`,
  canonical: `${siteConfig.url}/disclaimer`,
});

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            ⚠️ Important Risk Warning
          </h2>
          <p className="text-red-700 dark:text-red-300">
            Cryptocurrency investments are highly volatile and risky. You could lose all of your investment. 
            Never invest more than you can afford to lose. Always do your own research and consult with 
            qualified financial advisors before making investment decisions.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">General Information</h2>
          <p className="mb-4">
            The information provided on CryptoPulse is for general informational and educational purposes only. 
            It should not be considered as professional financial, investment, legal, or tax advice. The content 
            is based on our research and analysis, but we make no representations or warranties about the accuracy, 
            completeness, or reliability of any information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Not Financial Advice</h2>
          <p className="mb-4">
            <strong>Nothing on this website constitutes financial or investment advice.</strong> All content, 
            including articles, analysis, opinions, and commentary, is provided for informational purposes only. 
            We are not licensed financial advisors, and our content should not be used as the sole basis for 
            investment decisions.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Always conduct your own research (DYOR)</li>
            <li>Consult with qualified financial professionals</li>
            <li>Consider your risk tolerance and financial situation</li>
            <li>Understand the technology and projects before investing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cryptocurrency Risks</h2>
          <p className="mb-4">
            Cryptocurrency investments involve significant risks, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Volatility:</strong> Extreme price fluctuations are common</li>
            <li><strong>Regulatory Risk:</strong> Changing regulations may affect value and legality</li>
            <li><strong>Technology Risk:</strong> Smart contract bugs, network failures, or security breaches</li>
            <li><strong>Market Risk:</strong> Cryptocurrency markets can be manipulated or illiquid</li>
            <li><strong>Loss of Access:</strong> Lost private keys mean permanent loss of funds</li>
            <li><strong>Scams and Fraud:</strong> The space is prone to fraudulent projects and schemes</li>
            <li><strong>Tax Implications:</strong> Cryptocurrency transactions may have tax consequences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">No Guarantees</h2>
          <p className="mb-4">
            We make no guarantees about:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The accuracy or completeness of information</li>
            <li>Future performance of any cryptocurrency or project</li>
            <li>The success of any investment strategy</li>
            <li>The availability or functionality of our website</li>
            <li>The timeliness of information updates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Content and Links</h2>
          <p className="mb-4">
            Our website may contain links to third-party websites, services, or content. We do not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Endorse or recommend third-party content</li>
            <li>Control or monitor third-party websites</li>
            <li>Take responsibility for third-party content accuracy</li>
            <li>Guarantee the security of external links</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Affiliate Relationships</h2>
          <p className="mb-4">
            CryptoPulse may contain affiliate links or sponsored content. When we have financial relationships 
            with companies or services mentioned, we will clearly disclose these relationships. However:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Affiliate relationships do not influence our editorial content</li>
            <li>We only promote products and services we believe in</li>
            <li>You should always do your own research before using any service</li>
            <li>We are not responsible for third-party services or products</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by law, CryptoPulse and its authors, contributors, and affiliates 
            shall not be liable for any direct, indirect, incidental, special, consequential, or punitive 
            damages arising from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use of information on this website</li>
            <li>Investment decisions based on our content</li>
            <li>Technical issues or website downtime</li>
            <li>Third-party actions or services</li>
            <li>Any financial losses or damages</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Regulatory Compliance</h2>
          <p className="mb-4">
            Cryptocurrency regulations vary by jurisdiction and are constantly evolving. It is your responsibility to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Understand the laws in your jurisdiction</li>
            <li>Comply with all applicable regulations</li>
            <li>Report cryptocurrency transactions for tax purposes</li>
            <li>Ensure legal compliance before participating in any cryptocurrency activities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Market Data and Pricing</h2>
          <p className="mb-4">
            Any price data, market information, or trading data provided on our website:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>May be delayed or inaccurate</li>
            <li>Should not be used for trading decisions</li>
            <li>Is provided for informational purposes only</li>
            <li>May differ from actual market prices</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Content Updates</h2>
          <p>
            The cryptocurrency space evolves rapidly. While we strive to keep our content current and accurate, 
            information may become outdated quickly. We reserve the right to modify, update, or remove content 
            at any time without notice. Always verify information with current sources before making decisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            If you have questions about this disclaimer, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: legal@cryptopulse.com</li>
            <li>Website: <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">/contact</a></li>
          </ul>
        </section>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
            Remember: DYOR (Do Your Own Research)
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            The cryptocurrency market is highly speculative and volatile. Never invest based solely on information 
            from any single source, including CryptoPulse. Always conduct thorough research, understand the risks, 
            and consider seeking advice from qualified financial professionals.
          </p>
        </div>
      </div>
    </div>
  );
}