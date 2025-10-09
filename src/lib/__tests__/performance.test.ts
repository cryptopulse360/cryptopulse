import { vi } from 'vitest';
import {
  debounce,
  throttle,
  prefersReducedMotion,
  getConnectionSpeed,
  PerformanceMonitor,
} from '../performance';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock performance API
const mockPerformance = {
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(),
  getEntriesByType: vi.fn(),
  now: vi.fn(() => 1000),
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    connection: {
      effectiveType: '4g',
    },
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Performance utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('cancels previous calls', async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    it('limits function execution', async () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      await new Promise(resolve => setTimeout(resolve, 150));
      throttledFn('fourth');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('fourth');
    });
  });

  describe('prefersReducedMotion', () => {
    it('returns false when matchMedia is not available', () => {
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;

      expect(prefersReducedMotion()).toBe(false);

      window.matchMedia = originalMatchMedia;
    });

    it('returns matchMedia result', () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });
      expect(prefersReducedMotion()).toBe(true);

      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('getConnectionSpeed', () => {
    it('returns fast for 4g connection', () => {
      expect(getConnectionSpeed()).toBe('fast');
    });

    it('returns slow for 3g connection', () => {
      (navigator as any).connection.effectiveType = '3g';
      expect(getConnectionSpeed()).toBe('slow');
    });

    it('returns slow for 2g connection', () => {
      (navigator as any).connection.effectiveType = '2g';
      expect(getConnectionSpeed()).toBe('slow');
    });

    it('returns unknown when connection API is not available', () => {
      const originalConnection = (navigator as any).connection;
      delete (navigator as any).connection;

      expect(getConnectionSpeed()).toBe('unknown');

      (navigator as any).connection = originalConnection;
    });
  });

  describe('PerformanceMonitor', () => {
    it('creates performance marks', () => {
      PerformanceMonitor.mark('test-mark');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-mark');
    });

    it('measures performance between marks', () => {
      mockPerformance.getEntriesByName.mockReturnValue([{ duration: 500 }]);
      
      const duration = PerformanceMonitor.measure('test-measure', 'start', 'end');
      
      expect(mockPerformance.measure).toHaveBeenCalledWith('test-measure', 'start', 'end');
      expect(duration).toBe(500);
    });

    it('handles measurement errors gracefully', () => {
      mockPerformance.measure.mockImplementation(() => {
        throw new Error('Measurement failed');
      });

      const duration = PerformanceMonitor.measure('test-measure', 'start');
      expect(duration).toBeNull();
    });

    it('gets navigation metrics', () => {
      const mockNavigationEntry = {
        fetchStart: 100,
        responseStart: 200,
        requestStart: 150,
        domContentLoadedEventEnd: 300,
        loadEventEnd: 400,
      };

      mockPerformance.getEntriesByType.mockReturnValue([mockNavigationEntry]);

      const metrics = PerformanceMonitor.getMetrics();

      expect(metrics).toEqual({
        fcp: 100, // responseStart - fetchStart
        lcp: 300, // loadEventEnd - fetchStart
        ttfb: 50, // responseStart - requestStart
        domContentLoaded: 200, // domContentLoadedEventEnd - fetchStart
        loadComplete: 300, // loadEventEnd - fetchStart
      });
    });

    it('returns null when performance API is not available', () => {
      const originalPerformance = global.performance;
      delete (global as any).performance;

      PerformanceMonitor.mark('test');
      const duration = PerformanceMonitor.measure('test', 'start');
      const metrics = PerformanceMonitor.getMetrics();

      expect(duration).toBeNull();
      expect(metrics).toBeNull();

      global.performance = originalPerformance;
    });
  });
});