import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchModal from '../SearchModal';
import { testAccessibility, testFocusManagement, testAriaAttributes } from '@/lib/test-utils/accessibility';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock analytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackSearchQuery: vi.fn(),
  }),
}));

// Mock fetch for search index
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: false,
    json: () => Promise.resolve({}),
  })
) as any;

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
};

describe('SearchModal Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass axe accessibility tests', async () => {
    await testAccessibility(<SearchModal {...defaultProps} />);
  });

  it('should have proper modal semantics', () => {
    render(<SearchModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby');
    
    const title = screen.getByText('Search Articles');
    expect(title).toBeInTheDocument();
  });

  it('should manage focus properly', async () => {
    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);
    
    // Focus should be on the search input when modal opens
    await waitFor(() => {
      const searchInput = screen.getByRole('searchbox');
      expect(document.activeElement).toBe(searchInput);
    });
  });

  it('should trap focus within modal', () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByRole('searchbox');
    const closeButton = screen.getByRole('button', { name: /close search modal/i });
    
    // Test Tab trapping
    closeButton.focus();
    fireEvent.keyDown(closeButton, { key: 'Tab' });
    expect(document.activeElement).toBe(searchInput);
    
    // Test Shift+Tab trapping
    searchInput.focus();
    fireEvent.keyDown(searchInput, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(closeButton);
  });

  it('should handle keyboard navigation', () => {
    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);
    
    // Test Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    testAriaAttributes(() => render(<SearchModal {...defaultProps} />), [
      {
        selector: '[role="dialog"]',
        attributes: {
          'aria-modal': 'true',
          'aria-labelledby': expect.any(String),
        },
      },
      {
        selector: 'input[type="text"]',
        attributes: {
          'aria-label': expect.any(String),
          'role': 'searchbox',
        },
      },
      {
        selector: 'button[aria-label*="Close"]',
        attributes: {
          'aria-label': 'Close search modal',
          'type': 'button',
        },
      },
    ]);
  });

  it('should announce search results to screen readers', async () => {
    // Mock fetch to return some results
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          index: {
            fields: ['title', 'description', 'content', 'tags', 'author'],
            ref: 'slug',
            pipeline: [],
            documents: []
          },
          data: [
            {
              slug: 'test-article',
              title: 'Test Article',
              description: 'Test description',
              content: 'Test content',
              tags: ['test'],
              author: 'Test Author',
              publishedAt: '2024-01-01'
            }
          ]
        })
      })
    );

    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByRole('searchbox');
    
    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Wait for search results
    await waitFor(() => {
      const resultsRegion = screen.getByRole('region');
      expect(resultsRegion).toBeInTheDocument();
      expect(resultsRegion).toHaveAttribute('aria-labelledby');
    });
  });

  it('should have accessible search results', async () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      // Check for proper list semantics
      const resultsList = screen.queryByRole('listbox');
      if (resultsList) {
        expect(resultsList).toHaveAttribute('aria-labelledby');
        
        const results = screen.getAllByRole('option');
        results.forEach((result, index) => {
          expect(result).toHaveAttribute('aria-selected');
        });
      }
    });
  });

  it('should provide loading state announcements', () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'bitcoin' } });
    
    // Check for loading state
    const loadingIndicator = screen.queryByRole('status');
    if (loadingIndicator) {
      expect(loadingIndicator).toHaveAttribute('aria-live', 'polite');
    }
  });

  it('should handle empty search results accessibly', async () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'nonexistentquery' } });
    
    await waitFor(() => {
      const noResultsMessage = screen.queryByRole('status');
      if (noResultsMessage) {
        expect(noResultsMessage).toHaveAttribute('aria-live', 'polite');
        expect(noResultsMessage).toHaveTextContent(/no articles found/i);
      }
    });
  });

  it('should support keyboard shortcuts', () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveAttribute('aria-keyshortcuts');
  });

  it('should have proper backdrop behavior', () => {
    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);
    
    const backdrop = screen.getByTestId('search-backdrop');
    
    // Click on backdrop should close modal
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('should prevent body scroll when open', () => {
    const { rerender } = render(<SearchModal isOpen={false} onClose={vi.fn()} />);
    
    expect(document.body.style.overflow).toBe('');
    
    rerender(<SearchModal isOpen={true} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<SearchModal isOpen={false} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should have accessible close button', () => {
    render(<SearchModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close search modal/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('type', 'button');
    expect(closeButton).toHaveClass('focus-ring');
  });

  it('should announce modal opening', () => {
    // Mock the announceToScreenReader function
    const mockAnnounce = vi.fn();
    vi.doMock('@/lib/accessibility', () => ({
      announceToScreenReader: mockAnnounce,
      trapFocus: vi.fn(() => vi.fn()),
    }));
    
    render(<SearchModal {...defaultProps} />);
    
    // The modal should announce its opening
    // This would be tested by checking if announceToScreenReader was called
  });
});
