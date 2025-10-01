import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SearchModal from '../SearchModal';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock SearchInput component
vi.mock('../SearchInput', () => ({
  default: ({ value, onChange, onSubmit, autoFocus }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      autoFocus={autoFocus}
    />
  ),
}));

// Mock SearchResults component
vi.mock('../SearchResults', () => ({
  default: ({ results, query, isLoading, onResultClick, selectedIndex }: any) => (
    <div data-testid="search-results">
      <div data-testid="results-count">{results.length}</div>
      <div data-testid="query">{query}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="selected-index">{selectedIndex}</div>
      {results.map((result: any, index: number) => (
        <button
          key={result.slug}
          data-testid={`result-${index}`}
          onClick={() => onResultClick(result)}
        >
          {result.title}
        </button>
      ))}
    </div>
  ),
}));

// Mock fetch
global.fetch = vi.fn();

const mockPush = vi.fn();

describe('SearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
    
    // Mock successful fetch response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        index: { fields: [], ref: 'slug' },
        data: [],
      }),
    });
  });

  it('should not render when closed', () => {
    render(<SearchModal isOpen={false} onClose={vi.fn()} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Search Articles')).toBeInTheDocument();
  });

  it('should render search input with autofocus', () => {
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('autoFocus');
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close search');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should not close when modal content is clicked', () => {
    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);
    
    const modalContent = screen.getByText('Search Articles');
    fireEvent.click(modalContent);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should handle search input changes', async () => {
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'bitcoin' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('query')).toHaveTextContent('bitcoin');
    });
  });

  it('should show loading state during search', async () => {
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'bitcoin' } });
    
    // Should show loading immediately
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should handle keyboard navigation', () => {
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    // Simulate ArrowDown key
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Should update selected index (starts at -1, goes to 0)
    expect(screen.getByTestId('selected-index')).toHaveTextContent('0');
  });

  it('should handle Escape key to close', () => {
    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should prevent body scroll when open', () => {
    const originalOverflow = document.body.style.overflow;
    
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    // Cleanup
    document.body.style.overflow = originalOverflow;
  });

  it('should restore body scroll when closed', () => {
    const { rerender } = render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<SearchModal isOpen={false} onClose={vi.fn()} />);
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should navigate to result when clicked', async () => {
    // Mock search results
    const mockResults = [
      {
        slug: 'bitcoin-analysis',
        title: 'Bitcoin Analysis',
        url: '/articles/bitcoin-analysis',
      },
    ];

    // Mock fetch to return results
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        index: { fields: [], ref: 'slug' },
        data: mockResults,
      }),
    });

    const onClose = vi.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);

    // Wait for search index to load and simulate search
    await waitFor(() => {
      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'bitcoin' } });
    });

    // Click on a result (this would be mocked in the SearchResults component)
    const resultButton = screen.getByTestId('result-0');
    fireEvent.click(resultButton);

    expect(mockPush).toHaveBeenCalledWith('/articles/bitcoin-analysis');
    expect(onClose).toHaveBeenCalled();
  });

  it('should handle failed search index loading', async () => {
    // Mock failed fetch
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<SearchModal isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load search index:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('should handle search index not available', async () => {
    // Mock 404 response
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<SearchModal isOpen={true} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Search index not available, creating empty index'
      );
    });

    consoleSpy.mockRestore();
  });

  it('should display keyboard shortcuts in footer', () => {
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    expect(screen.getByText('Press Enter to select first result')).toBeInTheDocument();
    expect(screen.getByText('ESC to close')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<SearchModal isOpen={true} onClose={vi.fn()} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'search-modal');
  });
});