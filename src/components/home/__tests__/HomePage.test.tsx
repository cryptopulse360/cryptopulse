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
      
      expect(screen.getByText(/Your Wire to the Future of Finance/)).toBeInTheDocument();
      expect(screen.getByText(/Professional resources to understand and navigate digital assets/)).toBeInTheDocument();
      expect(screen.getByText(/CryptoPulse:/)).toBeInTheDocument();
    });

    it('renders CTA buttons', () => {
      render(<HeroSection />);
      
      expect(screen.getByText('Explore Articles')).toBeInTheDocument();
      expect(screen.getByText('Search Insights')).toBeInTheDocument();
    });

    it('renders stats section', () => {
      render(<HeroSection />);
      
      expect(screen.getByText('Timely')).toBeInTheDocument();
      expect(screen.getByText('Updates')).toBeInTheDocument();
      expect(screen.getByText('In-Depth')).toBeInTheDocument();
      expect(screen.getByText('Analysis')).toBeInTheDocument();
      expect(screen.getByText('Educational')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
    });
  });

  describe('FeaturedSection', () => {
    it('renders featured articles section', () => {
      const articles = [mockArticle];
      render(<FeaturedSection articles={articles} />);
      
      expect(screen.getByText('Featured Articles')).toBeInTheDocument();
      expect(screen.getByText('Selected analyses and insights')).toBeInTheDocument();
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
      expect(screen.getByText('Stay positioned ahead of market-moving developments')).toBeInTheDocument();
      expect(screen.getByTestId('article-card-test-article')).toBeInTheDocument();
    });

    it('renders nothing when no articles provided', () => {
      const { container } = render(<LatestSection articles={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders newsletter signup section', () => {
      const articles = [mockArticle];
      render(<LatestSection articles={articles} />);
      
      expect(screen.getByText('VIP Newsletter')).toBeInTheDocument();
      expect(screen.getByText('Join Elite Subscribers')).toBeInTheDocument();
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