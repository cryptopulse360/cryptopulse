import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TagBadge } from '../TagBadge';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('TagBadge', () => {
  it('renders tag with formatted text', () => {
    render(<TagBadge tag="bitcoin-analysis" />);
    
    expect(screen.getByText('Bitcoin Analysis')).toBeInTheDocument();
  });

  it('renders as clickable link by default', () => {
    render(<TagBadge tag="crypto" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/tags/crypto');
    expect(link).toHaveAttribute('aria-label', 'View all articles tagged with Crypto');
  });

  it('renders as non-clickable span when clickable is false', () => {
    render(<TagBadge tag="crypto" clickable={false} />);
    
    expect(screen.getByText('Crypto')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<TagBadge tag="crypto" size="sm" />);
    expect(screen.getByText('Crypto')).toHaveClass('px-2', 'py-1', 'text-xs', 'rounded');

    rerender(<TagBadge tag="crypto" size="md" />);
    expect(screen.getByText('Crypto')).toHaveClass('px-2.5', 'py-1.5', 'text-sm', 'rounded-md');

    rerender(<TagBadge tag="crypto" size="lg" />);
    expect(screen.getByText('Crypto')).toHaveClass('px-3', 'py-2', 'text-base', 'rounded-lg');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<TagBadge tag="crypto" variant="default" />);
    expect(screen.getByText('Crypto')).toHaveClass('bg-blue-100', 'text-blue-800');

    rerender(<TagBadge tag="crypto" variant="outline" />);
    expect(screen.getByText('Crypto')).toHaveClass('border', 'border-gray-300', 'text-gray-700');

    rerender(<TagBadge tag="crypto" variant="secondary" />);
    expect(screen.getByText('Crypto')).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('applies custom className', () => {
    render(<TagBadge tag="crypto" className="custom-class" />);
    
    expect(screen.getByText('Crypto')).toHaveClass('custom-class');
  });

  it('handles multi-word tags correctly', () => {
    render(<TagBadge tag="defi-protocols" />);
    
    expect(screen.getByText('Defi Protocols')).toBeInTheDocument();
  });

  it('has proper focus styles for accessibility', () => {
    render(<TagBadge tag="crypto" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  });
});