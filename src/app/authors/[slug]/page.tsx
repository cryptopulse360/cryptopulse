import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getAuthorBySlug, allAuthors } from '@/lib/authors';
import { getArticlesByAuthor } from '@/lib/mdx';
import { ArticleCard } from '@/components/article/ArticleCard';
import { AuthorProfile } from '@/components/author/AuthorProfile';
import { PersonStructuredData } from '@/components/author/PersonStructuredData';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { generateSEOMetadata } from '@/components/seo';
import { siteConfig } from '@/lib/constants';
import type { Author } from '@/types/author';

type Props = {
  params: { slug: string };
};

async function getAuthor(props: Props): Promise<Author | null> {
  return getAuthorBySlug(props.params.slug);
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const author = await getAuthor({ params });
  if (!author) {
    return {};
  }

  const description = `${author.title} - ${author.name} is a ${author.title} at CryptoPulse specializing in ${author.specialty}.`;

  return generateSEOMetadata({
    title: `${author.name} - ${author.title} | CryptoPulse`,
    description,
    image: author.profilePic,
  });
}

export async function generateStaticParams() {
  return allAuthors.map((author) => ({
    slug: author.slug,
  }));
}

export default async function AuthorPage({ params }: Props) {
  const author = await getAuthor({ params });
  if (!author) {
    notFound();
  }

  const articles = getArticlesByAuthor(author.name);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Authors', href: '/authors' },
          { label: author.name, href: `/authors/${author.slug}` }
        ]} 
      />
      
      <AuthorProfile author={author} />

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Articles by {author.name}
        </h2>
        {articles.length > 0 ? (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Explore {articles.length} article{articles.length > 1 ? 's' : ''} written by {author.name}.
          </p>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {author.name} hasn't written any articles yet. Check back soon!
          </p>
        )}
      </div>

      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              className="h-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
