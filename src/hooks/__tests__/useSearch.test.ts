import { renderHook, waitFor } from '@testing-library/react';
import { useSearch } from '../useSearch';
import { vi } from 'vitest';

// Mock the fetch function
global.fetch = vi.fn();

// Mock lunr
vi.mock('lunr', () => {
  const mockIndex = {
    search: vi.fn(() => [
      { ref: 'test-article', score: 1.0, matchData: {} }
    ])
  };
  
  const lunr = vi.fn(() => mockIndex);
  lunr.Index = {
    load: vi.fn(() => mockIndex)
  };
  
  return lunr;
});

describe('useSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty results', () => {
    const { result } = renderHook(() => useSearch(''));
    
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('loads search index on mount', async () => {
    const mockSearchData = [
      {
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content',
        tags: ['test'],
        author: 'Test Author',
        publishedAt: '2024-01-01T00:00:00.000Z',
        url: '/articles/test-article'
      }
    ];

    (global.fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchData
    });

    const { result } = renderHook(() => useSearch('test'));

    await waitFor(() => {
      expect(result.current.searchIndex).not.toBe(null);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/search-index');
  });

  it('handles search index loading error', async () => {
    (global.fetch as vi.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearch('test'));

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load search index');
    });
  });
});
