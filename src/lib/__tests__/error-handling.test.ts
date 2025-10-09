import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  safeAsync,
  safeSync,
  retryAsync,
  safeFetch,
  sanitizeInput,
  isNetworkError,
  getUserFriendlyErrorMessage,
  handleImageError,
} from '../error-handling';

// Mock fetch
global.fetch = vi.fn();

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('safeAsync', () => {
    it('returns result when function succeeds', async () => {
      const result = await safeAsync(
        async () => 'success',
        'fallback'
      );
      expect(result).toBe('success');
    });

    it('returns fallback when function throws', async () => {
      const result = await safeAsync(
        async () => { throw new Error('test'); },
        'fallback'
      );
      expect(result).toBe('fallback');
    });
  });

  describe('safeSync', () => {
    it('returns result when function succeeds', () => {
      const result = safeSync(
        () => 'success',
        'fallback'
      );
      expect(result).toBe('success');
    });

    it('returns fallback when function throws', () => {
      const result = safeSync(
        () => { throw new Error('test'); },
        'fallback'
      );
      expect(result).toBe('fallback');
    });
  });

  describe('retryAsync', () => {
    it('succeeds on first try', async () => {
    const fn = vi.fn().mockResolvedValue('success');
      const result = await retryAsync(fn, 3);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('retries on failure and eventually succeeds', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');
      
      const result = await retryAsync(fn, 3, 10); // Short delay for testing
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('throws after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('always fails'));
      
      await expect(retryAsync(fn, 2, 10)).rejects.toThrow('always fails');
      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('safeFetch', () => {
    it('returns parsed JSON on success', async () => {
      const mockData = { test: 'data' };
      (fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await safeFetch('https://api.example.com/data');
      expect(result).toEqual(mockData);
    });

    it('returns fallback on fetch failure', async () => {
      (fetch as vi.Mock).mockRejectedValue(new Error('Network error'));
      
      const result = await safeFetch('https://api.example.com/data', {}, { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it('returns null when no fallback provided', async () => {
      (fetch as vi.Mock).mockRejectedValue(new Error('Network error'));
      
      const result = await safeFetch('https://api.example.com/data');
      expect(result).toBeNull();
    });

    it('handles HTTP error responses', async () => {
      (fetch as vi.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await safeFetch('https://api.example.com/data', {}, { fallback: true });
      expect(result).toEqual({ fallback: true });
    });
  });

  describe('sanitizeInput', () => {
    it('removes script tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello  World');
    });

    it('removes javascript protocols', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss")');
    });

    it('removes event handlers', () => {
      const input = 'onclick="alert()" onload="hack()"';
      const result = sanitizeInput(input);
      expect(result).toBe(' ');
    });

    it('trims and limits length', () => {
      const input = '  ' + 'a'.repeat(2000) + '  ';
      const result = sanitizeInput(input, 100);
      expect(result).toHaveLength(100);
      expect(result.startsWith('a')).toBe(true);
    });

    it('handles non-string input', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
      expect(sanitizeInput(123 as any)).toBe('');
    });
  });

  describe('isNetworkError', () => {
    it('identifies network errors', () => {
      expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true);
      expect(isNetworkError(new Error('network error'))).toBe(true);
      expect(isNetworkError(new Error('fetch failed'))).toBe(true);
    });

    it('identifies non-network errors', () => {
      expect(isNetworkError(new Error('validation error'))).toBe(false);
      expect(isNetworkError(new ReferenceError('undefined variable'))).toBe(false);
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    it('returns network message for network errors', () => {
      const error = new TypeError('Failed to fetch');
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('Network connection issue');
    });

    it('returns 404 message for not found errors', () => {
      const error = new Error('404 Not Found');
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('not found');
    });

    it('returns server error message for 500 errors', () => {
      const error = new Error('500 Internal Server Error');
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('Server error');
    });

    it('returns timeout message for timeout errors', () => {
      const error = new Error('Request timeout');
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('timed out');
    });

    it('returns generic message for unknown errors', () => {
      const error = new Error('Unknown error');
      const message = getUserFriendlyErrorMessage(error);
      expect(message).toContain('unexpected error');
    });
  });

  describe('handleImageError', () => {
    it('sets fallback src when provided', () => {
      const mockImg = {
        src: 'original.jpg',
        style: { display: '' },
      };
      const event = {
        currentTarget: mockImg,
      } as any;

      handleImageError(event, 'fallback.jpg');
      expect(mockImg.src).toBe('fallback.jpg');
    });

    it('hides image when no fallback provided', () => {
      const mockImg = {
        src: 'original.jpg',
        style: { display: '' },
      };
      const event = {
        currentTarget: mockImg,
      } as any;

      handleImageError(event);
      expect(mockImg.style.display).toBe('none');
    });

    it('hides image when already using fallback', () => {
      const mockImg = {
        src: 'fallback.jpg',
        style: { display: '' },
      };
      const event = {
        currentTarget: mockImg,
      } as any;

      handleImageError(event, 'fallback.jpg');
      expect(mockImg.style.display).toBe('none');
    });
  });
});
