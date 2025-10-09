import { Article } from '@/types';
import { siteConfig } from './constants';

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData(article: Article, url: string): object {
  // Use heroImage if available, otherwise generate OG image
  let imageUrl;
  if (article.heroImage && article.heroImage.startsWith('/')) {
    imageUrl = `${siteConfig.url}${article.heroImage}`;
  } else if (article.heroImage && article.heroImage.startsWith('http')) {
    imageUrl = article.heroImage;
  } else {
    imageUrl = `${siteConfig.url}/images/test-hero.jpg`;
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    datePublished: article.publishedAt.toISOString(),
    ...(article.updatedAt && { dateModified: article.updatedAt.toISOString() }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: article.tags.join(', '),
    articleSection: article.category || 'Cryptocurrency',
    wordCount: Math.round(article.content.split(' ').length),
    timeRequired: `PT${article.readingTime}M`,
  };
}
