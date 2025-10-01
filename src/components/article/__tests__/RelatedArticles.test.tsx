import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { RelatedArticles } from '../RelatedArticles';
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
import { describe } from 'node:test';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  },
}));

vi.mock('next/image', () => ({
  default: function MockImage({ src, alt, width, height, className }: any) {
    return <img src={src} alt={alt} width={width} height={height} className={className} />;
  },
}));

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn((date: Date) => date.toLocaleDateString()),
  cn: vi.fn((...classes: string[]) => classes.filter(Boolean).join(' ')),
}));

vi.mock('@/lib/reading-time', () => ({
  formatReadingTime: vi.fn((minutes: number) => `${minutes} min read`),
}));

const mockArticles: Article[] = [
  {
    slug: 'bitcoin-analysis',
    title: 'Bitcoin Market Analysis',
    description: 'Deep dive into Bitcoin market trends',
    content: 'Bitcoin content...',
    author: 'John Doe',
    publishedAt: new Date('2024-01-15'),
    tags: ['bitcoin', 'analysis'],
    heroImage: '/images/bitcoin.jpg',
    readingTime: 5,
    featured: false,
  },
  {
    slug: 'ethereum-update',
    title: 'Ethereum Network Update',
    description: 'Latest Ethereum developments',
    content: 'Ethereum content...',
    author: 'Jane Smith',
    publishedAt: new Date('2024-01-10'),
    tags: ['ethereum', 'defi'],
    heroImage: '/images/ethereum.jpg',
    readingTime: 3,
    featured: true,
  },
  {
    slug: 'defi-trends',
    title: 'DeFi Trends 2024',
    description: 'Emerging trends in decentralized finance',
    content: 'DeFi content...',
    author: 'Bob Johnson',
    publishedAt: new Date('2024-01-05'),
    tags: ['defi', 'trends'],
    heroImage: '/images/defi.jpg',
    readingTime: 7,
    featured: false,
  },
];

describe('RelatedArticles', () => {
  it('renders related articles correctly', () => {
    render(<RelatedArticles articles={mockArticles} />);
    
    expect(screen.getByText('Related Articles')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin Market Analysis')).toBeInTheDocument();
    expect(screen.getByText('Ethereum Network Update')).toBeInTheDocument();
    expect(screen.getByText('DeFi Trends 2024')).toBeInTheDocument();
  });

  it('displays article metadata correctly', () => {
    render(<RelatedArticles articles={mockArticles} />);
    
    // Check for reading time
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('3 min read')).toBeInTheDocument();
    expect(screen.getByText('7 min read')).toBeInTheDocument();
    
    // Check for descriptions
    expect(screen.getByText('Deep dive into Bitcoin market trends')).toBeInTheDocument();
    expect(screen.getByText('Latest Ethereum developments')).toBeInTheDocument();
    expect(screen.getByText('Emerging trends in decentralized finance')).toBeInTheDocument();
  });

  it('renders article images when provided', () => {
    render(<RelatedArticles articles={mockArticles} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', '/images/bitcoin.jpg');
    expect(images[1]).toHaveAttribute('src', '/images/ethereum.jpg');
    expect(images[2]).toHaveAttribute('src', '/images/defi.jpg');
  });

  it('displays tags correctly', () => {
    render(<RelatedArticles articles={mockArticles} />);
    
    // Check for tags (should show first 2 tags per article)
    expect(screen.getByText('bitcoin')).toBeInTheDocument();
    expect(screen.getByText('analysis')).toBeInTheDocument();
    expect(screen.getByText('ethereum')).toBeInTheDocument();
    expect(screen.getByText('defi')).toBeInTheDocument();
    expect(screen.getByText('trends')).toBeInTheDocument();
  });

  it('shows "View all articles" link', () => {
    render(<RelatedArticles articles={mockArticles} />);
    
    const viewAllLink = screen.getByText('View all articles');
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink.closest('a')).toHaveAttribute('href', '/articles');
  });

  it('renders empty state when no articles provided', () => {
    render(<RelatedArticles articles={[]} />);
    
    expect(screen.getByText('Related Articles')).toBeInTheDocument();
    expect(screen.getByText('No related articles found.')).toBeInTheDocument();
    expect(screen.getByText('Check back later for more content!')).toBeInTheDocument();
  });

  it('handles articles without hero images', () => {
    const articlesWithoutImages = mockArticles.map(article => ({
      ...article,
      heroImage: '',
    }));
    
    render(<RelatedArticles articles={articlesWithoutImages} />);
    
    // Should still render articles but without images
    expect(screen.getByText('Bitcoin Market Analysis')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('limits tag display to 2 tags and shows count for additional tags', () => {
    const articleWithManyTags: Article = {
      ...mockArticles[0],
      tags: ['bitcoin', 'analysis', 'market', 'crypto', 'trading'],
    };
    
    render(<RelatedArticles articles={[articleWithManyTags]} />);
    
    expect(screen.getByText('bitcoin')).toBeInTheDocument();
    expect(screen.getByText('analysis')).toBeInTheDocument();
    expect(screen.getByText('+3 more')).toBeInTheDocument();
  });

  it('creates correct links to article pages', () => {
    render(<RelatedArticles articles={mockArticles} />);
    
    const links = screen.getAllByRole('link');
    const articleLinks = links.filter(link => 
      link.getAttribute('href')?.startsWith('/articles/')
    );
    
    expect(articleLinks).toHaveLength(3);
    expect(articleLinks[0]).toHaveAttribute('href', '/articles/bitcoin-analysis');
    expect(articleLinks[1]).toHaveAttribute('href', '/articles/ethereum-update');
    expect(articleLinks[2]).toHaveAttribute('href', '/articles/defi-trends');
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <RelatedArticles articles={mockArticles} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles hover states correctly', () => {
    render(<RelatedArticles articles={mockArticles.slice(0, 1)} />);
    
    const articleLink = screen.getByRole('link', { name: /bitcoin market analysis/i });
    expect(articleLink).toHaveClass('hover:bg-gray-50');
  });
});