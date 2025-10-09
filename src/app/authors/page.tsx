import { Metadata } from 'next';
import { allAuthors } from '@/lib/authors';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { AuthorCard } from '@/components/author/AuthorCard';
import { generateSEOMetadata } from '@/components/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Authors - CryptoPulse',
  description: 'Meet our team of cryptocurrency experts and explore their profiles and articles.',
});

export default function AuthorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Authors', href: '/authors' }
        ]} 
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Authors
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Meet the CryptoPulse team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAuthors.map((author) => (
          <AuthorCard
            key={author.slug}
            author={author}
          />
        ))}
      </div>
    </div>
  );
}
