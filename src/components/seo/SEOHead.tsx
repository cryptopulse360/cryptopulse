import { Metadata } from 'next';
import { Article } from '@/types';
import { siteConfig } from '@/lib/constants';
import { generateOGImageUrl } from '@/lib/seo';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: Article;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generate metadata for Next.js pages
 */
export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  article,
  noIndex = false,
  canonical,
}: SEOProps): Metadata {
  const seoTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const seoDescription = description || siteConfig.description;
  
  // Use dynamic OG image generation for articles, fallback to provided image or default
  let seoImage: string;
  if (article) {
    seoImage = generateOGImageUrl(article);
  } else if (image) {
    seoImage = image;
  } else {
    seoImage = siteConfig.seo.defaultImage;
  }
  
  const seoUrl = url || siteConfig.url;
  const fullImageUrl = seoImage.startsWith('http') ? seoImage : `${siteConfig.url}${seoImage}`;

  const metadata: Metadata = {
    title: seoTitle,
    description: seoDescription,
    ...(canonical && { alternates: { canonical } }),
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      locale: 'en_US',
      type,
      ...(article && {
        publishedTime: article.publishedAt.toISOString(),
        ...(article.updatedAt && { modifiedTime: article.updatedAt.toISOString() }),
        authors: [article.author],
        tags: article.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [fullImageUrl],
      site: siteConfig.seo.twitterHandle,
      creator: siteConfig.seo.twitterHandle,
    },
    keywords: article?.tags || ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'crypto news'],
  };

  return metadata;
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData(article: Article, url: string): object {
  // Use the same OG image generation for structured data
  const imageUrl = generateOGImageUrl(article);
  
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

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
      sameAs: [
        siteConfig.social.twitter,
        siteConfig.social.github,
        ...(siteConfig.social.linkedin ? [siteConfig.social.linkedin] : []),
      ],
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}