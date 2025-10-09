import React from 'react';
import { Metadata } from 'next';
import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy',
  description: 'Learn how CryptoPulse collects, uses, and protects your personal information. Our commitment to privacy and GDPR compliance.',
  url: `${siteConfig.url}/privacy`,
  canonical: `${siteConfig.url}/privacy`,
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            At CryptoPulse, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
            and use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-medium mb-3">Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Email address when you subscribe to our newsletter</li>
            <li>Name and contact information when you contact us</li>
            <li>Any information you provide in comments or feedback</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Information Automatically Collected</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Website usage data through privacy-friendly analytics (Plausible Analytics)</li>
            <li>Device information (browser type, operating system)</li>
            <li>IP address (anonymized for analytics purposes)</li>
            <li>Pages visited and time spent on our website</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain our website and services</li>
            <li>Send you newsletters and updates (with your consent)</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Improve our website content and user experience</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Privacy-Friendly Analytics</h2>
          <p className="mb-4">
            We use Plausible Analytics, a privacy-friendly analytics service that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Does not use cookies or track personal data</li>
            <li>Does not collect personally identifiable information</li>
            <li>Anonymizes IP addresses</li>
            <li>Is GDPR, CCPA, and PECR compliant</li>
            <li>Does not share data with third parties</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Newsletter and Email Communications</h2>
          <p className="mb-4">
            When you subscribe to our newsletter:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>We use Mailchimp to manage our email list</li>
            <li>You will receive a confirmation email (double opt-in)</li>
            <li>You can unsubscribe at any time using the link in our emails</li>
            <li>We will not share your email address with third parties</li>
            <li>We will only send you content related to cryptocurrency news and analysis</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties, except:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist us (Mailchimp for newsletters, Plausible for analytics)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights (GDPR)</h2>
          <p className="mb-4">
            If you are a resident of the European Union, you have the following rights:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure hosting on GitHub Pages</li>
            <li>Regular security updates and monitoring</li>
            <li>Limited access to personal data</li>
            <li>Data minimization practices</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p className="mb-4">
            Our website uses minimal cookies:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Theme preference (dark/light mode) - stored locally</li>
            <li>No tracking cookies or third-party cookies</li>
            <li>No consent banner required due to privacy-friendly approach</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you are a parent or guardian and believe 
            your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are 
            advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your rights, 
            please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: privacy@cryptopulse.com</li>
            <li>Website: <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">/contact</a></li>
          </ul>
        </section>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-sm">
            We are committed to protecting your privacy. We use privacy-friendly analytics, 
            minimal data collection, and give you full control over your personal information. 
            We comply with GDPR and other privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
}