import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ArticleContent } from '../ArticleContent';
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
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockArticle: Article = {
  slug: 'test-article',
  title: 'Test Article Title',
  description: 'This is a comprehensive test article description.',
  content: '<p>This is the article content with <strong>bold text</strong> and <a href="#">links</a>.</p>',
  author: 'Jane Smith',
  publishedAt: new Date('2024-01-15T10:00:00Z'),
  updatedAt: new Date('2024-01-20T15:30:00Z'),
  tags: ['bitcoin', 'analysis', 'market-trends'],
  heroImage: '/images/test-hero.jpg',
  readingTime: 8,
  featured: true,
};

describe('ArticleContent', () => {
  it('renders article header information correctly', () => {
    render(<ArticleContent article={mockArticle} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Article Title');
    expect(screen.getByText('This is a comprehensive test article description.')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('8 min read')).toBeInTheDocument();
  });

  it('renders featured badge for featured articles', () => {
    render(<ArticleContent article={mockArticle} />);
    
    expect(screen.getByText('Featured Article')).toBeInTheDocument();
  });

  it('does not render featured badge for non-featured articles', () => {
    const nonFeaturedArticle = { ...mockArticle, featured: false };
    render(<ArticleContent article={nonFeaturedArticle} />);
    
    expect(screen.queryByText('Featured Article')).not.toBeInTheDocument();
  });

  it('renders hero image when showHeroImage is true', () => {
    render(<ArticleContent article={mockArticle} showHeroImage={true} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/images/test-hero.jpg');
    expect(image).toHaveAttribute('alt', 'Test Article Title');
  });

  it('does not render hero image when showHeroImage is false', () => {
    render(<ArticleContent article={mockArticle} showHeroImage={false} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders tags when showTags is true', () => {
    render(<ArticleContent article={mockArticle} showTags={true} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Market Trends')).toBeInTheDocument();
  });

  it('does not render tags when showTags is false', () => {
    render(<ArticleContent article={mockArticle} showTags={false} />);
    
    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
    expect(screen.queryByText('Analysis')).not.toBeInTheDocument();
    expect(screen.queryByText('Market Trends')).not.toBeInTheDocument();
  });

  it('renders author information when showAuthor is true', () => {
    render(<ArticleContent article={mockArticle} showAuthor={true} />);
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('does not render author when showAuthor is false', () => {
    render(<ArticleContent article={mockArticle} showAuthor={false} />);
    
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('renders published date when showPublishedDate is true', () => {
    render(<ArticleContent article={mockArticle} showPublishedDate={true} />);
    
    expect(screen.getByText('Published January 15, 2024')).toBeInTheDocument();
  });

  it('does not render published date when showPublishedDate is false', () => {
    render(<ArticleContent article={mockArticle} showPublishedDate={false} />);
    
    expect(screen.queryByText(/Published/)).not.toBeInTheDocument();
  });

  it('renders updated date when showUpdatedDate is true and updatedAt exists', () => {
    render(<ArticleContent article={mockArticle} showUpdatedDate={true} />);
    
    expect(screen.getByText('Updated January 20, 2024')).toBeInTheDocument();
  });

  it('does not render updated date when showUpdatedDate is false', () => {
    render(<ArticleContent article={mockArticle} showUpdatedDate={false} />);
    
    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });

  it('does not render updated date when updatedAt is not provided', () => {
    const articleWithoutUpdate = { ...mockArticle, updatedAt: undefined };
    render(<ArticleContent article={articleWithoutUpdate} showUpdatedDate={true} />);
    
    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });

  it('renders reading time when showReadingTime is true', () => {
    render(<ArticleContent article={mockArticle} showReadingTime={true} />);
    
    expect(screen.getByText('8 min read')).toBeInTheDocument();
  });

  it('does not render reading time when showReadingTime is false', () => {
    render(<ArticleContent article={mockArticle} showReadingTime={false} />);
    
    expect(screen.queryByText('8 min read')).not.toBeInTheDocument();
  });

  it('renders article content with proper HTML', () => {
    render(<ArticleContent article={mockArticle} />);
    
    // Check that the content is rendered as HTML
    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByText('links')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ArticleContent article={mockArticle} className="custom-class" />);
    
    expect(screen.getByRole('article')).toHaveClass('custom-class');
  });

  it('has proper semantic structure', () => {
    render(<ArticleContent article={mockArticle} />);
    
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('time')).toHaveLength(2); // Published and updated dates
  });

  it('has proper datetime attributes on time elements', () => {
    render(<ArticleContent article={mockArticle} />);
    
    const timeElements = screen.getAllByRole('time');
    expect(timeElements[0]).toHaveAttribute('dateTime', '2024-01-15T10:00:00.000Z');
    expect(timeElements[1]).toHaveAttribute('dateTime', '2024-01-20T15:30:00.000Z');
  });

  it('applies prose classes for content styling', () => {
    render(<ArticleContent article={mockArticle} />);
    
    const contentDiv = screen.getByRole('article').querySelector('.prose');
    expect(contentDiv).toHaveClass('prose', 'prose-lg', 'max-w-none');
  });
});