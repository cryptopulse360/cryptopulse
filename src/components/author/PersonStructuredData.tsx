import { Author } from '@/types/author';

interface PersonStructuredDataProps {
  author: Author;
  articlesCount: number;
}

export function PersonStructuredData({ author, articlesCount }: PersonStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    image: author.profilePic,
    url: `./authors/${author.slug}`,
    worksInOrganization: {
      '@type': 'Organization',
      name: 'CryptoPulse',
      url: '/',
    },
    knowsAbout: author.specialty.split(', '),
    makesOffer: Array.from({ length: articlesCount }, (_, i) => ({
      '@type': 'CreativeWork',
      name: `Article by ${author.name}`,
      url: `./articles/placeholder-${i}`, // Placeholder; in real impl, would use actual article URLs
    })),
    description: `${author.name} is a ${author.title} specializing in ${author.specialty}.`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
