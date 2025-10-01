import { Metadata } from 'next';
import { SearchPageClient } from './SearchPageClient';
import { generateSEOMetadata } from '@/components/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Search Articles - CryptoPulse',
  description: 'Search through our comprehensive collection of cryptocurrency and blockchain articles.',
  path: '/search',
});

export default function SearchPage() {
  return <SearchPageClient />;
}