import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ArticleContent } from '../ArticleContent';
import { Article } from '@/types/article';

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
  afterEach(() => {
    cleanup();
  });

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
    
    const heroImage = screen.getByRole('img');
    expect(heroImage).toHaveAttribute('src', '/images/test-hero.jpg');
    expect(heroImage).toHaveAttribute('alt', 'Test Article Title');
  });

  it('does not render hero image when showHeroImage is false', () => {
    render(<ArticleContent article={mockArticle} showHeroImage={false} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders article content with proper HTML', () => {
    render(<ArticleContent article={mockArticle} />);
    
    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'links' })).toBeInTheDocument();
  });

  it('displays publication and update dates', () => {
    render(<ArticleContent article={mockArticle} />);
    
    expect(screen.getByText('Published January 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Updated January 20, 2024')).toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    render(<ArticleContent article={mockArticle} />);
    
    expect(screen.getByText('bitcoin')).toBeInTheDocument();
    expect(screen.getByText('analysis')).toBeInTheDocument();
    expect(screen.getByText('market-trends')).toBeInTheDocument();
  });

  it('handles articles without update date', () => {
    const articleWithoutUpdate = { ...mockArticle, updatedAt: undefined };
    render(<ArticleContent article={articleWithoutUpdate} />);
    
    expect(screen.getByText('Published January 15, 2024')).toBeInTheDocument();
    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });

  it('handles articles without hero image', () => {
    const articleWithoutHero = { ...mockArticle, heroImage: '' };
    render(<ArticleContent article={articleWithoutHero} />);
    
    // Should still render other content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Article Title');
  });
});