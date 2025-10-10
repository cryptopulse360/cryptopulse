import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from '../SearchResults';
import { SearchResult } from '@/types/search';
import { beforeEach } from 'node:test';

// Mock TagBadge component
vi.mock('@/components/article/TagBadge', () => ({
  TagBadge: ({ tag }: { tag: string }) => <span data-testid="tag-badge">{tag}</span>,
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

const mockResults: SearchResult[] = [
  {
    slug: 'bitcoin-analysis',
    title: 'Bitcoin Price Analysis',
    description: 'Comprehensive analysis of Bitcoin price trends',
    content: 'Bitcoin has shown significant growth...',
    tags: ['bitcoin', 'analysis', 'price'],
    author: 'John Crypto',
    publishedAt: '2024-01-15T00:00:00.000Z',
    url: '/articles/bitcoin-analysis',
    score: 0.95,
    matches: {},
  },
  {
    slug: 'ethereum-defi',
    title: 'Ethereum DeFi Revolution',
    description: 'How Ethereum is transforming decentralized finance',
    content: 'Ethereum blockchain has become...',
    tags: ['ethereum', 'defi', 'blockchain', 'smart-contracts'],
    author: 'Jane Smith',
    publishedAt: '2024-01-10T00:00:00.000Z',
    url: '/articles/ethereum-defi',
    score: 0.87,
    matches: {},
  },
];

describe('SearchResults', () => {
  const defaultProps = {
    results: mockResults,
    query: 'bitcoin',
    isLoading: false,
    onResultClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    render(<SearchResults {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Searching...')).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('should show empty state when no query', () => {
    render(<SearchResults {...defaultProps} query="" />);
    
    expect(screen.getByText('Start typing to search articles...')).toBeInTheDocument();
  });

  it('should show no results state', () => {
    render(<SearchResults {...defaultProps} results={[]} query="nonexistent" />);
    
    expect(screen.getByText('No articles found for "nonexistent"')).toBeInTheDocument();
    expect(screen.getByText('Try different keywords or check your spelling')).toBeInTheDocument();
  });

  it('should display results count', () => {
    render(<SearchResults {...defaultProps} />);
    
    expect(screen.getByText('Found 2 results for "bitcoin"')).toBeInTheDocument();
  });

  it('should display singular result count', () => {
    render(<SearchResults {...defaultProps} results={[mockResults[0]]} />);
    
    expect(screen.getByText('Found 1 result for "bitcoin"')).toBeInTheDocument();
  });

  it('should render article titles', () => {
    render(<SearchResults {...defaultProps} />);
    
    // Use getByText with a function matcher to handle highlighted text
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'h3' && 
             element?.textContent === 'Bitcoin Price Analysis';
    })).toBeInTheDocument();
    
    expect(screen.getByText('Ethereum DeFi Revolution')).toBeInTheDocument();
  });

  it('should render article descriptions', () => {
    render(<SearchResults {...defaultProps} />);
    
    // Use getByText with a function matcher to handle highlighted text
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && 
             element?.textContent === 'Comprehensive analysis of Bitcoin price trends';
    })).toBeInTheDocument();
    
    expect(screen.getByText('How Ethereum is transforming decentralized finance')).toBeInTheDocument();
  });

  it('should render author information', () => {
    render(<SearchResults {...defaultProps} />);
    
    expect(screen.getByText('By John Crypto')).toBeInTheDocument();
    expect(screen.getByText('By Jane Smith')).toBeInTheDocument();
  });

  it('should render publication dates', () => {
    render(<SearchResults {...defaultProps} />);
    
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('January 10, 2024')).toBeInTheDocument();
  });

  it('should render tags', () => {
    render(<SearchResults {...defaultProps} />);
    
    const tagBadges = screen.getAllByTestId('tag-badge');
    expect(tagBadges.length).toBeGreaterThan(0);
    expect(tagBadges[0]).toHaveTextContent('bitcoin');
  });

  it('should limit displayed tags to 3', () => {
    render(<SearchResults {...defaultProps} />);
    
    // Second result has 4 tags, should show 3 + "more" indicator
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('should display match scores', () => {
    render(<SearchResults {...defaultProps} />);
    
    expect(screen.getByText('95% match')).toBeInTheDocument();
    expect(screen.getByText('87% match')).toBeInTheDocument();
  });

  it('should call onResultClick when result is clicked', () => {
    const onResultClick = vi.fn();
    render(<SearchResults {...defaultProps} onResultClick={onResultClick} />);
    
    // Find the first result link by its href attribute
    const firstResult = screen.getByRole('link', { name: /bitcoin price analysis/i });
    fireEvent.click(firstResult);
    
    expect(onResultClick).toHaveBeenCalledWith(mockResults[0]);
  });

  it('should highlight selected result', () => {
    render(<SearchResults {...defaultProps} selectedIndex={0} />);
    
    const firstResult = screen.getByRole('link', { name: /bitcoin price analysis/i });
    expect(firstResult).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('should not highlight unselected results', () => {
    render(<SearchResults {...defaultProps} selectedIndex={0} />);
    
    const secondResult = screen.getByText('Ethereum DeFi Revolution').closest('a');
    expect(secondResult).toHaveClass('border-gray-200');
    expect(secondResult).not.toHaveClass('border-blue-500');
  });

  it('should handle no selected index', () => {
    render(<SearchResults {...defaultProps} selectedIndex={-1} />);
    
    const results = screen.getAllByRole('link');
    results.forEach((result) => {
      expect(result).not.toHaveClass('border-blue-500');
    });
  });

  it('should have proper link hrefs', () => {
    render(<SearchResults {...defaultProps} />);
    
    const firstLink = screen.getByRole('link', { name: /bitcoin price analysis/i });
    const secondLink = screen.getByRole('link', { name: /ethereum defi revolution/i });
    
    expect(firstLink).toHaveAttribute('href', '/articles/bitcoin-analysis');
    expect(secondLink).toHaveAttribute('href', '/articles/ethereum-defi');
  });
});