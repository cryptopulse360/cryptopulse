import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { notFound } from 'next/navigation';
import TagPage from '../page';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock the MDX functions
vi.mock('@/lib/mdx', () => ({
  getAllTags: vi.fn(() => ['bitcoin', 'ethereum', 'defi']),
  getArticlesByTag: vi.fn((tag: string) => {
    if (tag === 'bitcoin') {
      return [
        {
          slug: 'bitcoin-article-1',
          title: 'Bitcoin Article 1',
          description: 'Description 1',
          tags: ['bitcoin'],
          publishedAt: new Date('2024-01-01'),
          author: 'Author 1',
          heroImage: '/image1.jpg',
          readingTime: 5,
          featured: false,
          content: 'Content 1',
        },
        {
          slug: 'bitcoin-article-2',
          title: 'Bitcoin Article 2',
          description: 'Description 2',
          tags: ['bitcoin'],
          publishedAt: new Date('2024-01-02'),
          author: 'Author 2',
          heroImage: '/image2.jpg',
          readingTime: 3,
          featured: true,
          content: 'Content 2',
        },
      ];
    }
    return [];
  }),
}));

describe('TagPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tag page with articles', () => {
    const params = { tag: 'bitcoin' };
    
    render(<TagPage params={params} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('2 articles tagged with Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin Article 1')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin Article 2')).toBeInTheDocument();
  });

  it('renders breadcrumb navigation', () => {
    const params = { tag: 'bitcoin' };
    
    render(<TagPage params={params} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('calls notFound when no articles exist for tag', () => {
    const params = { tag: 'nonexistent-tag' };
    
    render(<TagPage params={params} />);
    
    expect(notFound).toHaveBeenCalled();
  });

  it('displays singular article text for one article', async () => {
    // Mock to return only one article
    const { getArticlesByTag } = await import('@/lib/mdx');
    vi.mocked(getArticlesByTag).mockReturnValueOnce([
      {
        slug: 'single-article',
        title: 'Single Article',
        description: 'Description',
        tags: ['bitcoin'],
        publishedAt: new Date('2024-01-01'),
        author: 'Author',
        heroImage: '/image.jpg',
        readingTime: 5,
        featured: false,
        content: 'Content',
      },
    ]);

    const params = { tag: 'bitcoin' };
    
    render(<TagPage params={params} />);
    
    expect(screen.getByText('1 article tagged with Bitcoin')).toBeInTheDocument();
  });

  it('formats tag name correctly', async () => {
    const params = { tag: 'defi-protocols' };
    
    // Mock to return articles for this tag
    const { getArticlesByTag } = await import('@/lib/mdx');
    vi.mocked(getArticlesByTag).mockReturnValueOnce([
      {
        slug: 'defi-article',
        title: 'DeFi Article',
        description: 'Description',
        tags: ['defi-protocols'],
        publishedAt: new Date('2024-01-01'),
        author: 'Author',
        heroImage: '/image.jpg',
        readingTime: 5,
        featured: false,
        content: 'Content',
      },
    ]);
    
    render(<TagPage params={params} />);
    
    expect(screen.getByText('Defi Protocols')).toBeInTheDocument();
  });
});