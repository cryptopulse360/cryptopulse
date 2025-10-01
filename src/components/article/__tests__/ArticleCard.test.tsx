import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ArticleCard } from '../ArticleCard';
import { Article } from '@/types/article';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockArticle: Article = {
  slug: 'test-article',
  title: 'Test Article Title',
  description: 'This is a test article description that should be displayed in the card.',
  content: '<p>Test content</p>',
  author: 'John Doe',
  publishedAt: new Date('2024-01-15T10:00:00Z'),
  tags: ['bitcoin', 'analysis', 'crypto'],
  heroImage: '/images/test-hero.jpg',
  readingTime: 5,
  featured: false,
};

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test article description that should be displayed in the card.')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('renders article link with correct href', () => {
    render(<ArticleCard article={mockArticle} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/articles/test-article');
  });

  it('renders hero image when showImage is true', () => {
    render(<ArticleCard article={mockArticle} showImage={true} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/images/test-hero.jpg');
    expect(image).toHaveAttribute('alt', 'Test Article Title');
  });

  it('does not render hero image when showImage is false', () => {
    render(<ArticleCard article={mockArticle} showImage={false} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders tags when showTags is true', () => {
    render(<ArticleCard article={mockArticle} showTags={true} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Crypto')).toBeInTheDocument();
  });

  it('does not render tags when showTags is false', () => {
    render(<ArticleCard article={mockArticle} showTags={false} />);
    
    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
    expect(screen.queryByText('Analysis')).not.toBeInTheDocument();
    expect(screen.queryByText('Crypto')).not.toBeInTheDocument();
  });

  it('renders author when showAuthor is true', () => {
    render(<ArticleCard article={mockArticle} showAuthor={true} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render author when showAuthor is false', () => {
    render(<ArticleCard article={mockArticle} showAuthor={false} />);
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders reading time when showReadingTime is true', () => {
    render(<ArticleCard article={mockArticle} showReadingTime={true} />);
    
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('does not render reading time when showReadingTime is false', () => {
    render(<ArticleCard article={mockArticle} showReadingTime={false} />);
    
    expect(screen.queryByText('5 min read')).not.toBeInTheDocument();
  });

  it('renders featured badge for featured articles in featured variant', () => {
    const featuredArticle = { ...mockArticle, featured: true };
    render(<ArticleCard article={featuredArticle} variant="featured" />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not render featured badge for non-featured articles', () => {
    render(<ArticleCard article={mockArticle} variant="featured" />);
    
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<ArticleCard article={mockArticle} variant="default" />);
    expect(screen.getByRole('article')).toHaveClass('p-6');

    rerender(<ArticleCard article={mockArticle} variant="featured" />);
    expect(screen.getByRole('article')).toHaveClass('p-8', 'md:p-10');

    rerender(<ArticleCard article={mockArticle} variant="compact" />);
    expect(screen.getByRole('article')).toHaveClass('p-4');
  });

  it('limits tags display based on variant', () => {
    const articleWithManyTags = {
      ...mockArticle,
      tags: ['bitcoin', 'ethereum', 'defi', 'nft', 'trading'],
    };

    const { rerender } = render(<ArticleCard article={articleWithManyTags} variant="compact" />);
    expect(screen.getByText('+3 more')).toBeInTheDocument();

    rerender(<ArticleCard article={articleWithManyTags} variant="default" />);
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('renders relative time correctly', () => {
    const recentArticle = {
      ...mockArticle,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    };
    
    render(<ArticleCard article={recentArticle} />);
    
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ArticleCard article={mockArticle} className="custom-class" />);
    
    expect(screen.getByRole('article')).toHaveClass('custom-class');
  });

  it('has proper semantic structure', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('time')).toBeInTheDocument();
  });
});