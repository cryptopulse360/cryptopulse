/**
 * Core article interface representing a blog post
 */
export interface Article {
  /** URL-friendly slug for the article */
  slug: string;
  /** Article title */
  title: string;
  /** Brief description/excerpt */
  description: string;
  /** Full article content in HTML */
  content: string;
  /** Author name */
  author: string;
  /** Publication date */
  publishedAt: Date;
  /** Last updated date (optional) */
  updatedAt?: Date;
  /** Array of tags for categorization */
  tags: string[];
  /** Hero image URL */
  heroImage: string;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Whether this article is featured */
  featured: boolean;
  /** Article category (optional) */
  category?: string;
}

/**
 * Article front matter interface (before processing)
 */
export interface ArticleFrontMatter {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  heroImage: string;
  featured?: boolean;
  category?: string;
}