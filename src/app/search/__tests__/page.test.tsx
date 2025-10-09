import { render, screen } from '@testing-library/react';
import SearchPage from '../page';

// Mock the SearchPageClient component
jest.mock('../SearchPageClient', () => {
  return function MockSearchPageClient() {
    return (
      <div data-testid="search-page">
        <h1>Search Articles</h1>
        <p>Find articles about cryptocurrency, blockchain, and digital assets.</p>
        <input placeholder="Search articles..." />
      </div>
    );
  };
});

// Mock the SEO component
jest.mock('@/components/seo', () => ({
  generateSEOMetadata: jest.fn(() => ({
    title: 'Search Articles - CryptoPulse',
    description: 'Search through our comprehensive collection of cryptocurrency and blockchain articles.',
  })),
}));

describe('Search Page', () => {
  it('renders search page', () => {
    render(<SearchPage />);
    
    expect(screen.getByTestId('search-page')).toBeInTheDocument();
    expect(screen.getByText('Search Articles')).toBeInTheDocument();
    expect(screen.getByText('Find articles about cryptocurrency, blockchain, and digital assets.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });
});