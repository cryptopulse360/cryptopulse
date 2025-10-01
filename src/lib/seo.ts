import { Article } from '@/types';
import { siteConfig } from '@/lib/constants';
import { generateArticleOGImage, getFallbackOGImage } from './og-image';

/**
 * Generate Open Graph image URL for an article
 */
export function generateOGImageUrl(article: Article): string {
  // Use dynamic OG image generation
  try {
    return generateArticleOGImage(article);
  } catch (error) {
    console.error('Error generating OG image for article:', error);
    
    // Fallback to hero image if available
    if (article.heroImage && article.heroImage.startsWith('http')) {
      return article.heroImage;
    }
    
    if (article.heroImage && article.heroImage.trim()) {
      return `${siteConfig.url}${article.heroImage}`;
    }
    
    // Use fallback OG image
    return getFallbackOGImage();
  }
}

/**
 * Generate meta description from article content
 */
export function generateMetaDescription(article: Article, maxLength: number = 160): string {
  if (article.description && article.description.length <= maxLength) {
    return article.description;
  }
  
  // Extract first paragraph from content and truncate
  const textContent = article.content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  // Truncate at word boundary
  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return `${truncated.substring(0, lastSpace)}...`;
  }
  
  // If no space found, truncate at character boundary but avoid partial words
  return `${truncated.replace(/\w+$/, '')}...`.replace(/\s+\.\.\.$/, '...');
}

/**
 * Generate article keywords from tags and content
 */
export function generateKeywords(article: Article): string[] {
  const baseKeywords = ['cryptocurrency', 'crypto', 'blockchain', 'bitcoin', 'ethereum'];
  const tagKeywords = article.tags.map(tag => tag.toLowerCase());
  
  // Add category as keyword if available
  const categoryKeywords = article.category ? [article.category.toLowerCase()] : [];
  
  // Combine and deduplicate
  const allKeywords = [...baseKeywords, ...tagKeywords, ...categoryKeywords];
  const uniqueKeywords = allKeywords.filter((keyword, index) => allKeywords.indexOf(keyword) === index);
  return uniqueKeywords;
}

/**
 * Generate Twitter card type based on content
 */
export function getTwitterCardType(article?: Article): 'summary' | 'summary_large_image' {
  // Use large image card for articles with hero images
  if (article?.heroImage) {
    return 'summary_large_image';
  }
  
  return 'summary';
}

/**
 * Validate and clean URL for canonical links
 */
export function cleanCanonicalUrl(url: string): string {
  try {
    // Check if it's a valid URL first
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      
      // Remove trailing slash except for root
      const pathname = urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/$/, '');
      
      // Remove query parameters and fragments for canonical URLs
      return `${urlObj.origin}${pathname}`;
    } else {
      // Handle relative URLs
      const urlObj = new URL(url, siteConfig.url);
      const pathname = urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/$/, '');
      return `${urlObj.origin}${pathname}`;
    }
  } catch {
    // Fallback to site URL if URL is invalid
    return siteConfig.url;
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
}): string {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
  } = options;
  
  const directives: string[] = [];
  
  directives.push(index ? 'index' : 'noindex');
  directives.push(follow ? 'follow' : 'nofollow');
  
  if (noarchive) directives.push('noarchive');
  if (nosnippet) directives.push('nosnippet');
  
  return directives.join(', ');
}

/**
 * Generate hreflang attributes for international SEO
 */
export function generateHreflangLinks(path: string): Array<{ hreflang: string; href: string }> {
  // For now, only English is supported
  // This can be extended for multi-language support
  return [
    {
      hreflang: 'en',
      href: `${siteConfig.url}${path}`,
    },
    {
      hreflang: 'x-default',
      href: `${siteConfig.url}${path}`,
    },
  ];
}

/**
 * Calculate estimated reading time for SEO purposes
 */
export function calculateReadingTimeForSEO(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `PT${minutes}M`; // ISO 8601 duration format for structured data
}

/**
 * Generate article URL from slug
 */
export function generateArticleUrl(slug: string): string {
  return `${siteConfig.url}/articles/${slug}`;
}

/**
 * Generate tag page URL
 */
export function generateTagUrl(tag: string): string {
  return `${siteConfig.url}/tags/${encodeURIComponent(tag)}`;
}