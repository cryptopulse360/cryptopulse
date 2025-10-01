import { Metadata } from 'next';
import { NewsletterSignupPage } from '@/components/newsletter/NewsletterSignupPage';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Newsletter Signup - Stay Updated with Crypto News',
  description: 'Subscribe to CryptoPulse newsletter for the latest cryptocurrency news, market analysis, and expert insights delivered to your inbox.',
  openGraph: {
    title: 'Newsletter Signup - CryptoPulse',
    description: 'Join thousands of crypto enthusiasts who trust CryptoPulse for market insights and breaking news.',
    url: `${siteConfig.url}/newsletter`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter Signup - CryptoPulse',
    description: 'Subscribe for crypto news, analysis, and market insights.',
  },
};

export default function NewsletterPage() {
  return <NewsletterSignupPage />;
}