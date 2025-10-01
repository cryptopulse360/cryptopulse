/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ArticleViewTracker } from '../ArticleViewTracker';

// Mock the useAnalytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

import { useAnalytics } from '@/hooks/useAnalytics';

const mockUseAnalytics = useAnalytics as ReturnType<typeof vi.fn>;

describe('ArticleViewTracker', () => {
  const mockTrackArticle = vi.fn();
  
  const mockArticle = {
    slug: 'test-article',
    title: 'Test Article Title',
    tags: ['bitcoin', 'crypto', 'analysis'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAnalytics.mockReturnValue({
      trackArticle: mockTrackArticle,
      track: vi.fn(),
      trackSearchQuery: vi.fn(),
      trackNewsletterAttempt: vi.fn(),
      trackNewsletterComplete: vi.fn(),
      trackTheme: vi.fn(),
      trackTag: vi.fn(),
      trackExternal: vi.fn(),
      trackShare: vi.fn(),
      trackSearchOpen: vi.fn(),
    });
  });

  it('should track article view on mount', () => {
    render(<ArticleViewTracker article={mockArticle} />);
    
    expect(mockTrackArticle).toHaveBeenCalledWith(
      'test-article',
      'Test Article Title',
      ['bitcoin', 'crypto', 'analysis']
    );
    expect(mockTrackArticle).toHaveBeenCalledTimes(1);
  });

  it('should not render any visible content', () => {
    const { container } = render(<ArticleViewTracker article={mockArticle} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should track again when article changes', () => {
    const { rerender } = render(<ArticleViewTracker article={mockArticle} />);
    
    expect(mockTrackArticle).toHaveBeenCalledTimes(1);
    
    const newArticle = {
      slug: 'new-article',
      title: 'New Article Title',
      tags: ['ethereum', 'defi'],
    };
    
    rerender(<ArticleViewTracker article={newArticle} />);
    
    expect(mockTrackArticle).toHaveBeenCalledTimes(2);
    expect(mockTrackArticle).toHaveBeenLastCalledWith(
      'new-article',
      'New Article Title',
      ['ethereum', 'defi']
    );
  });

  it('should not track again when article props remain the same', () => {
    const { rerender } = render(<ArticleViewTracker article={mockArticle} />);
    
    expect(mockTrackArticle).toHaveBeenCalledTimes(1);
    
    // Re-render with same article
    rerender(<ArticleViewTracker article={mockArticle} />);
    
    expect(mockTrackArticle).toHaveBeenCalledTimes(1);
  });

  it('should track when individual article properties change', () => {
    const { rerender } = render(<ArticleViewTracker article={mockArticle} />);
    
    expect(mockTrackArticle).toHaveBeenCalledTimes(1);
    
    // Change only the title
    rerender(<ArticleViewTracker article={{ ...mockArticle, title: 'Updated Title' }} />);
    
    expect(mockTrackArticle).toHaveBeenCalledTimes(2);
    expect(mockTrackArticle).toHaveBeenLastCalledWith(
      'test-article',
      'Updated Title',
      ['bitcoin', 'crypto', 'analysis']
    );
  });

  it('should handle articles with no tags', () => {
    const articleWithoutTags = {
      slug: 'no-tags-article',
      title: 'Article Without Tags',
      tags: [],
    };
    
    render(<ArticleViewTracker article={articleWithoutTags} />);
    
    expect(mockTrackArticle).toHaveBeenCalledWith(
      'no-tags-article',
      'Article Without Tags',
      []
    );
  });
});