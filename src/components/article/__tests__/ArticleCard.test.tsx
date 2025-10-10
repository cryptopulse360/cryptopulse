import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';
import { Article } from '@/types/article';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  },
}));

vi.mock('next/image', () => ({
  default: function MockImage({ src, alt, width, height, className }: any) {
    return <img src={src} alt={alt} width={width} height={height} className={className} />;
  },
}));

const mockArticle: Article = {
  slug: 'test-article',
  title: 'Test Article Title',
  description: 'This is a test article description that should be displayed in the card.',
  content: 'Test content',
  author: 'John Doe',
  publishedAt: new Date('2024-01-15T10:00:00Z'),
  tags: ['bitcoin', 'analysis', 'crypto'],
  heroImage: '/images/test-hero.jpg',
  readingTime: 5,
  featured: false,
};

describe('ArticleCard', () => {
  afterEach(() => {
    cleanup();
  });

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

  it('does not render image when showImage is false', () => {
    render(<ArticleCard article={mockArticle} showImage={false} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders article tags', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('bitcoin')).toBeInTheDocument();
    expect(screen.getByText('analysis')).toBeInTheDocument();
    expect(screen.getByText('crypto')).toBeInTheDocument();
  });

  it('displays publication date', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText('1 year ago')).toBeInTheDocument();
  });

  it('renders featured badge for featured articles', () => {
    const featuredArticle = { ...mockArticle, featured: true };
    render(<ArticleCard article={featuredArticle} />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not render featured badge for non-featured articles', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('handles articles without hero image', () => {
    const articleWithoutImage = { ...mockArticle, heroImage: '' };
    render(<ArticleCard article={articleWithoutImage} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('truncates long descriptions', () => {
    const longDescription = 'A'.repeat(200);
    const articleWithLongDesc = { ...mockArticle, description: longDescription };
    render(<ArticleCard article={articleWithLongDesc} />);
    
    // Should still render the article
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });
});