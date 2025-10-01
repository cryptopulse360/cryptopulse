import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroSection } from '../HeroSection';
import { FeaturedSection } from '../FeaturedSection';
import { LatestSection } from '../LatestSection';
import { Article } from '@/types/article';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock ArticleCard component
vi.mock('@/components/article/ArticleCard', () => ({
  ArticleCard: ({ article, variant }: { article: Article; variant: string }) => (
    <div data-testid={`article-card-${article.slug}`} data-variant={variant}>
      <h3>{article.title}</h3>
      <p>{article.description}</p>
    </div>
  ),
}));

const mockArticle: Article = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test description',
  content: 'Test content',
  author: 'Test Author',
  publishedAt: new Date('2024-01-15'),
  tags: ['test', 'article'],
  heroImage: '/test-image.jpg',
  readingTime: 5,
  featured: true,
  category: 'test',
};

describe('Home Page Components', () => {
  describe('HeroSection', () => {
    it('renders hero section with main heading', () => {
      render(<HeroSection />);
      
      expect(screen.getByText(/Your Premier Source for/)).toBeInTheDocument();
      expect(screen.getByText(/Crypto News/)).toBeInTheDocument();
      expect(screen.getByText(/Stay ahead of the curve/)).toBeInTheDocument();
    });

    it('renders CTA buttons', () => {
      render(<HeroSection />);
      
      expect(screen.getByText('Explore Articles')).toBeInTheDocument();
      expect(screen.getByText('Search Articles')).toBeInTheDocument();
    });

    it('renders stats section', () => {
      render(<HeroSection />);
      
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('Articles Published')).toBeInTheDocument();
      expect(screen.getByText('50K+')).toBeInTheDocument();
      expect(screen.getByText('Monthly Readers')).toBeInTheDocument();
    });
  });

  describe('FeaturedSection', () => {
    it('renders featured articles section', () => {
      const articles = [mockArticle];
      render(<FeaturedSection articles={articles} />);
      
      expect(screen.getByText('Featured Articles')).toBeInTheDocument();
      expect(screen.getByText('Hand-picked stories from our editorial team')).toBeInTheDocument();
      expect(screen.getByTestId('article-card-test-article')).toBeInTheDocument();
    });

    it('renders nothing when no articles provided', () => {
      const { container } = render(<FeaturedSection articles={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders main featured article with correct variant', () => {
      const articles = [mockArticle];
      render(<FeaturedSection articles={articles} />);
      
      const articleCard = screen.getByTestId('article-card-test-article');
      expect(articleCard).toHaveAttribute('data-variant', 'featured');
    });

    it('renders multiple featured articles with correct layout', () => {
      const articles = [
        mockArticle,
        { ...mockArticle, slug: 'test-article-2', title: 'Test Article 2' },
        { ...mockArticle, slug: 'test-article-3', title: 'Test Article 3' },
      ];
      render(<FeaturedSection articles={articles} />);
      
      expect(screen.getByTestId('article-card-test-article')).toHaveAttribute('data-variant', 'featured');
      expect(screen.getByTestId('article-card-test-article-2')).toHaveAttribute('data-variant', 'compact');
      expect(screen.getByTestId('article-card-test-article-3')).toHaveAttribute('data-variant', 'compact');
    });
  });

  describe('LatestSection', () => {
    it('renders latest articles section', () => {
      const articles = [mockArticle];
      render(<LatestSection articles={articles} />);
      
      expect(screen.getByText('Latest Articles')).toBeInTheDocument();
      expect(screen.getByText('Stay up to date with the newest crypto insights and analysis')).toBeInTheDocument();
      expect(screen.getByTestId('article-card-test-article')).toBeInTheDocument();
    });

    it('renders nothing when no articles provided', () => {
      const { container } = render(<LatestSection articles={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders newsletter signup section', () => {
      const articles = [mockArticle];
      render(<LatestSection articles={articles} />);
      
      expect(screen.getByText('Never Miss a Story')).toBeInTheDocument();
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
    });

    it('limits articles to 6 items', () => {
      const articles = Array.from({ length: 10 }, (_, i) => ({
        ...mockArticle,
        slug: `test-article-${i}`,
        title: `Test Article ${i}`,
      }));
      
      render(<LatestSection articles={articles} />);
      
      // Should only render 6 articles
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`article-card-test-article-${i}`)).toBeInTheDocument();
      }
      
      // Should not render articles beyond 6
      expect(screen.queryByTestId('article-card-test-article-6')).not.toBeInTheDocument();
    });
  });
});