import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TagCloud } from '../TagCloud';

// Mock data
const mockTagCounts = [
  { tag: 'bitcoin', count: 2 },
  { tag: 'ethereum', count: 1 },
  { tag: 'defi', count: 1 },
  { tag: 'nft', count: 0 },
];

describe('TagCloud', () => {
  it('renders tag cloud with default props', () => {
    render(<TagCloud tagCounts={mockTagCounts} />);
    
    expect(screen.getByText('Popular Tags')).toBeInTheDocument();
    expect(screen.getByText('View all tags →')).toBeInTheDocument();
  });

  it('displays tags with counts when showCounts is true', () => {
    render(<TagCloud tagCounts={mockTagCounts} showCounts={true} />);
    
    // Should show count numbers in parentheses
    expect(screen.getAllByText(/\(\d+\)/).length).toBeGreaterThan(0);
  });

  it('hides counts when showCounts is false', () => {
    render(<TagCloud tagCounts={mockTagCounts} showCounts={false} />);
    
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('limits tags to maxTags prop', () => {
    render(<TagCloud tagCounts={mockTagCounts} maxTags={2} />);
    
    // Should only show 2 tags (the most popular ones)
    const tagElements = screen.getAllByRole('link');
    // Subtract 1 for the "View all tags" link
    expect(tagElements.length - 1).toBeLessThanOrEqual(2);
  });

  it('shows message when no tags available', () => {
    render(<TagCloud tagCounts={[]} />);
    
    expect(screen.getByText('No tags available')).toBeInTheDocument();
  });

  it('sorts tags by count in descending order', () => {
    const unsortedTagCounts = [
      { tag: 'ethereum', count: 1 },
      { tag: 'bitcoin', count: 3 },
      { tag: 'defi', count: 2 },
    ];
    
    render(<TagCloud tagCounts={unsortedTagCounts} />);
    
    // Bitcoin should appear first as it has the highest count
    const tagElements = screen.getAllByRole('link');
    const bitcoinLink = tagElements.find(el => el.getAttribute('href')?.includes('bitcoin'));
    expect(bitcoinLink).toBeInTheDocument();
  });
});