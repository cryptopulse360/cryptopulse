import { render, screen } from '@testing-library/react';
import ArticlesPage from '../page';
import { getAllArticles } from '@/lib/mdx';

// Mock the MDX library
jest.mock('@/lib/mdx', () => ({
  getAllArticles: jest.fn(),
}));

// Mock the components
jest.mock('@/components/article/ArticleCard', () => {
  return function MockArticleCard({ article }: any) {
    return <div data-testid="article-card">{article.title}</div>;
  };
});

jest.mock('@/components/ui/Breadcrumb', () => {
  return function MockBreadcrumb({ items }: any) {
    return <nav data-testid="breadcrumb">{items.map((item: any) => item.label).join(' > ')}</nav>;
  };
});

jest.mock('@/components/seo', () => ({
  generateSEOMetadata: jest.fn(() => ({
    title: 'All Articles - CryptoPulse',
    description: 'Browse all cryptocurrency and blockchain articles on CryptoPulse.',
  })),
}));

const mockGetAllArticles = getAllArticles as jest.MockedFunction<typeof getAllArticles>;

describe('Articles Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders articles page with articles', async () => {
    const mockArticles = [
      {
        slug: 'test-article-1',
        title: 'Test Article 1',
        excerpt: 'Test excerpt 1',
        date: '2024-01-01',
        tags: ['crypto'],
        readingTime: '5 min read',
      },
      {
        slug: 'test-article-2',
        title: 'Test Article 2',
        excerpt: 'Test excerpt 2',
        date: '2024-01-02',
        tags: ['blockchain'],
        readingTime: '3 min read',
      },
    ];

    mockGetAllArticles.mockResolvedValue(mockArticles as any);

    const ArticlesPageComponent = await ArticlesPage();
    render(ArticlesPageComponent);

    expect(screen.getByText('All Articles')).toBeInTheDocument();
    expect(screen.getByText('Explore our comprehensive collection of cryptocurrency and blockchain articles.')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getAllByTestId('article-card')).toHaveLength(2);
  });

  it('renders empty state when no articles', async () => {
    mockGetAllArticles.mockResolvedValue([]);

    const ArticlesPageComponent = await ArticlesPage();
    render(ArticlesPageComponent);

    expect(screen.getByText('All Articles')).toBeInTheDocument();
    expect(screen.getByText('No articles found')).toBeInTheDocument();
    expect(screen.getByText('Check back soon for new content!')).toBeInTheDocument();
  });

  it('renders breadcrumb navigation', async () => {
    mockGetAllArticles.mockResolvedValue([]);

    const ArticlesPageComponent = await ArticlesPage();
    render(ArticlesPageComponent);

    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toHaveTextContent('Home > Articles');
  });
});