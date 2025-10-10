import { Article } from '@/types';
import { siteConfig } from './constants';

/**
 * Generate OG image URL for an article
 */
export function generateOGImageUrl(article: Article): string {
  if (article.heroImage) {
    if (article.heroImage.startsWith('http')) {
      return article.heroImage;
    }
    if (article.heroImage.startsWith('/')) {
      return `${siteConfig.url}${article.heroImage}`;
    }
  }
  return `${siteConfig.url}/images/og-default.jpg`;
}

/**
 * Generate meta description for SEO
 */
export function generateMetaDescription(article: Article, maxLength: number = 160): string {
  if (article.description && article.description.length <= maxLength) {
    return article.description;
  }

  let text = article.description || article.content;
  
  // Strip HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  if (text.length <= maxLength) {
    return text;
  }

  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Generate keywords for SEO
 */
export function generateKeywords(article: Article): string[] {
  const baseKeywords = ['cryptocurrency', 'blockchain', 'crypto news', 'digital assets'];
  const articleKeywords = [...article.tags];
  
  if (article.category) {
    articleKeywords.push(article.category);
  }
  
  // Combine and deduplicate
  const allKeywords = [...baseKeywords, ...articleKeywords];
  return [...new Set(allKeywords)];
}

/**
 * Get Twitter card type based on article content
 */
export function getTwitterCardType(article?: Article): string {
  if (article?.heroImage) {
    return 'summary_large_image';
  }
  return 'summary';
}

/**
 * Clean canonical URL by removing query params and fragments
 */
export function cleanCanonicalUrl(url: string): string {
  try {
    // Handle relative URLs
    if (!url.startsWith('http')) {
      url = `${siteConfig.url}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    
    const urlObj = new URL(url);
    
    // Remove query parameters and fragments
    urlObj.search = '';
    urlObj.hash = '';
    
    let cleanUrl = urlObj.toString();
    
    // Remove trailing slash except for root
    if (cleanUrl.endsWith('/') && cleanUrl !== `${urlObj.origin}/`) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    
    return cleanUrl;
  } catch {
    // Fallback for invalid URLs
    return `${siteConfig.url}/${url}`;
  }
}

/**
 * Generate robots meta content
 */
export function generateRobotsContent(options: {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  [key: string]: boolean | undefined;
}): string {
  const directives: string[] = [];
  
  // Default values
  const index = options.index !== false;
  const follow = options.follow !== false;
  
  directives.push(index ? 'index' : 'noindex');
  directives.push(follow ? 'follow' : 'nofollow');
  
  // Add additional directives
  Object.entries(options).forEach(([key, value]) => {
    if (key !== 'index' && key !== 'follow' && value === true) {
      directives.push(key);
    }
  });
  
  return directives.join(', ');
}

/**
 * Generate hreflang links for internationalization
 */
export function generateHreflangLinks(pathname: string): Array<{ hreflang: string; href: string }> {
  const baseUrl = siteConfig.url;
  const fullUrl = `${baseUrl}${pathname}`;
  
  return [
    {
      hreflang: 'en',
      href: fullUrl,
    },
    {
      hreflang: 'x-default',
      href: fullUrl,
    },
  ];
}

/**
 * Calculate reading time in ISO 8601 format for structured data
 */
export function calculateReadingTimeForSEO(content: string): string {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200)); // 200 words per minute, minimum 1 minute
  
  return `PT${minutes}M`;
}

/**
 * Generate article URL from slug
 */
export function generateArticleUrl(slug: string): string {
  return `${siteConfig.url}/articles/${slug}`;
}

/**
 * Generate tag URL from tag name
 */
export function generateTagUrl(tag: string): string {
  return `${siteConfig.url}/tags/${encodeURIComponent(tag)}`;
}

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
