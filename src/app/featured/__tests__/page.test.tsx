import { render, screen } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import FeaturedPage from '../page';
import { getAllArticles } from '@/lib/mdx';

// Mock the MDX library
vi.mock('@/lib/mdx', () => ({
  getAllArticles: vi.fn(),
}));

// Mock the components
vi.mock('@/components/article/ArticleCard', () => ({
  default: function MockArticleCard({ article, variant }: any) {
    return (
      <div data-testid="article-card" data-variant={variant}>
        {article.title}
        {article.featured && <span data-testid="featured-badge">Featured</span>}
      </div>
    );
  },
}));

vi.mock('@/components/ui/Breadcrumb', () => ({
  default: function MockBreadcrumb({ items }: any) {
    return <nav data-testid="breadcrumb">{items.map((item: any) => item.label).join(' > ')}</nav>;
  },
}));

vi.mock('@/components/seo/SEOHead', () => ({
  generateSEOMetadata: vi.fn(() => ({
    title: 'Featured Articles - CryptoPulse',
    description: 'Discover our hand-picked featured articles covering the most important topics in cryptocurrency and blockchain technology.',
  })),
}));

const mockGetAllArticles = vi.mocked(getAllArticles);

describe('Featured Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders featured articles page with featured articles', async () => {
    const mockArticles = [
      {
        slug: 'featured-article-1',
        title: 'Featured Article 1',
        description: 'Featured description 1',
        date: '2024-01-01',
        tags: ['crypto'],
        readingTime: 5,
        featured: true,
        publishedAt: new Date('2024-01-01'),
      },
      {
        slug: 'regular-article',
        title: 'Regular Article',
        description: 'Regular description',
        date: '2024-01-02',
        tags: ['blockchain'],
        readingTime: 3,
        featured: false,
        publishedAt: new Date('2024-01-02'),
      },
      {
        slug: 'featured-article-2',
        title: 'Featured Article 2',
        description: 'Featured description 2',
        date: '2024-01-03',
        tags: ['defi'],
        readingTime: 7,
        featured: true,
        publishedAt: new Date('2024-01-03'),
      },
    ];

    mockGetAllArticles.mockResolvedValue(mockArticles as any);

    const FeaturedPageComponent = await FeaturedPage();
    render(FeaturedPageComponent);

    expect(screen.getByText('Featured Articles')).toBeInTheDocument();
    expect(screen.getByText('Discover our hand-picked featured articles covering the most important topics in cryptocurrency and blockchain technology.')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    
    // Should only show featured articles (2 out of 3)
    const articleCards = screen.getAllByTestId('article-card');
    expect(articleCards).toHaveLength(2);
    
    // Check that featured articles are shown with featured variant
    expect(screen.getByText('Featured Article 1')).toBeInTheDocument();
    expect(screen.getByText('Featured Article 2')).toBeInTheDocument();
    expect(screen.queryByText('Regular Article')).not.toBeInTheDocument();
    
    // Check that articles use featured variant
    articleCards.forEach(card => {
      expect(card).toHaveAttribute('data-variant', 'featured');
    });
  });

  it('renders empty state when no featured articles', async () => {
    const mockArticles = [
      {
        slug: 'regular-article',
        title: 'Regular Article',
        description: 'Regular description',
        date: '2024-01-01',
        tags: ['crypto'],
        readingTime: 5,
        featured: false,
        publishedAt: new Date('2024-01-01'),
      },
    ];

    mockGetAllArticles.mockResolvedValue(mockArticles as any);

    const FeaturedPageComponent = await FeaturedPage();
    render(FeaturedPageComponent);

    expect(screen.getByText('Featured Articles')).toBeInTheDocument();
    expect(screen.getByText('No featured articles yet')).toBeInTheDocument();
    expect(screen.getByText('We\'re working on curating the best content for you. Check back soon!')).toBeInTheDocument();
    expect(screen.getByText('Browse All Articles')).toBeInTheDocument();
  });

  it('renders breadcrumb navigation', async () => {
    mockGetAllArticles.mockResolvedValue([]);

    const FeaturedPageComponent = await FeaturedPage();
    render(FeaturedPageComponent);

    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toHaveTextContent('Home > Featured');
  });

  it('shows article count when featured articles exist', async () => {
    const mockArticles = [
      {
        slug: 'featured-article-1',
        title: 'Featured Article 1',
        featured: true,
        publishedAt: new Date('2024-01-01'),
      },
      {
        slug: 'featured-article-2',
        title: 'Featured Article 2',
        featured: true,
        publishedAt: new Date('2024-01-02'),
      },
    ];

    mockGetAllArticles.mockResolvedValue(mockArticles as any);

    const FeaturedPageComponent = await FeaturedPage();
    render(FeaturedPageComponent);

    expect(screen.getByText('2 featured articles')).toBeInTheDocument();
  });
});