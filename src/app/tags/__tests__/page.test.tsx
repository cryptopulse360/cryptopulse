import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TagsPage from '../page';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';

// Mock the MDX functions
vi.mock('@/lib/mdx', () => ({
  getAllTags: vi.fn(() => ['bitcoin', 'ethereum', 'defi']),
  getAllArticles: vi.fn(() => [
    {
      slug: 'article-1',
      title: 'Article 1',
      tags: ['bitcoin', 'ethereum'],
      publishedAt: new Date('2024-01-01'),
    },
    {
      slug: 'article-2',
      title: 'Article 2', 
      tags: ['bitcoin', 'defi'],
      publishedAt: new Date('2024-01-02'),
    },
  ]),
}));

describe('TagsPage', () => {
  it('renders the tags page correctly', () => {
    render(<TagsPage />);
    
    expect(screen.getByText('All Tags')).toBeInTheDocument();
    expect(screen.getByText(/Browse articles by topic/)).toBeInTheDocument();
    expect(screen.getByText('Popular Tags')).toBeInTheDocument();
  });

  it('displays tag counts correctly', () => {
    render(<TagsPage />);
    
    // Bitcoin appears in 2 articles
    expect(screen.getByText('(2)')).toBeInTheDocument();
    // Ethereum and DeFi each appear in 1 article
    expect(screen.getAllByText('(1)')).toHaveLength(2);
  });

  it('shows correct article and tag counts in description', () => {
    render(<TagsPage />);
    
    expect(screen.getByText(/We have 3 tags covering 2 articles/)).toBeInTheDocument();
  });

  it('renders breadcrumb navigation', () => {
    render(<TagsPage />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('shows message when no tags available', async () => {
    // Mock empty tags
    const { getAllTags, getAllArticles } = await import('@/lib/mdx');
    
    vi.mocked(getAllTags).mockReturnValueOnce([]);
    vi.mocked(getAllArticles).mockReturnValueOnce([]);
    
    render(<TagsPage />);
    
    expect(screen.getByText(/No tags found/)).toBeInTheDocument();
  });
});