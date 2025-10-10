import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import {
  debounce,
  throttle,
  prefersReducedMotion,
  getConnectionSpeed,
  PerformanceMonitor,
} from '../performance';
import { 
  setupPerformanceTestEnvironment, 
  mockReducedMotion, 
  mockSlowConnection,
  mockPerformanceEntries 
} from '../../test/performance-setup';

describe('Performance utilities', () => {
  let testEnv: ReturnType<typeof setupPerformanceTestEnvironment>;

  beforeEach(() => {
    testEnv = setupPerformanceTestEnvironment();
  });

  afterEach(() => {
    testEnv.cleanup();
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

    it('returns false when matchMedia throws an error', () => {
      window.matchMedia = vi.fn().mockImplementation(() => {
        throw new Error('matchMedia error');
      });

      expect(prefersReducedMotion()).toBe(false);
    });

    it('returns true when reduced motion is preferred', () => {
      mockReducedMotion(true);
      expect(prefersReducedMotion()).toBe(true);
    });

    it('returns false when reduced motion is not preferred', () => {
      mockReducedMotion(false);
      expect(prefersReducedMotion()).toBe(false);
    });

    it('returns false in server environment', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(prefersReducedMotion()).toBe(false);

      global.window = originalWindow;
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
      mockSlowConnection();
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
      const mockPerformance = global.performance as any;
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-mark');
    });

    it('measures performance between marks', () => {
      const mockPerformance = global.performance as any;
      mockPerformance.getEntriesByName.mockReturnValue([{ duration: 500 }]);
      
      const duration = PerformanceMonitor.measure('test-measure', 'start', 'end');
      
      expect(mockPerformance.measure).toHaveBeenCalledWith('test-measure', 'start', 'end');
      expect(duration).toBe(500);
    });

    it('handles measurement errors gracefully', () => {
      const mockPerformance = global.performance as any;
      mockPerformance.measure.mockImplementation(() => {
        throw new Error('Measurement failed');
      });

      const duration = PerformanceMonitor.measure('test-measure', 'start');
      expect(duration).toBeNull();
    });

    it('gets navigation metrics', () => {
      const mockNavigationEntry = {
        entryType: 'navigation',
        name: 'document',
        fetchStart: 100,
        responseStart: 200,
        requestStart: 150,
        domContentLoadedEventEnd: 300,
        loadEventEnd: 400,
      };

      mockPerformanceEntries([mockNavigationEntry]);

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

    it('handles missing navigation entries gracefully', () => {
      const mockPerformance = global.performance as any;
      mockPerformance.getEntriesByType.mockReturnValue([]);

      const metrics = PerformanceMonitor.getMetrics();
      expect(metrics).toBeNull();
    });
  });
});
  
describe('Browser API fallbacks', () => {
    it('handles missing window object gracefully', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(prefersReducedMotion()).toBe(false);

      global.window = originalWindow;
    });

    it('handles missing navigator object gracefully', () => {
      const originalNavigator = global.navigator;
      delete (global as any).navigator;

      expect(getConnectionSpeed()).toBe('unknown');

      global.navigator = originalNavigator;
    });

    it('handles missing performance object gracefully', () => {
      const originalPerformance = global.performance;
      delete (global as any).performance;

      PerformanceMonitor.mark('test');
      expect(PerformanceMonitor.measure('test', 'start')).toBeNull();
      expect(PerformanceMonitor.getMetrics()).toBeNull();

      global.performance = originalPerformance;
    });
  });

  describe('Performance optimization utilities', () => {
    it('creates image observer when IntersectionObserver is available', () => {
      const callback = vi.fn();
      const observer = require('../performance').createImageObserver(callback);
      
      expect(observer).toBeDefined();
    });

    it('returns null when IntersectionObserver is not available', () => {
      const originalIntersectionObserver = global.IntersectionObserver;
      delete (global as any).IntersectionObserver;

      const callback = vi.fn();
      const observer = require('../performance').createImageObserver(callback);
      
      expect(observer).toBeNull();

      global.IntersectionObserver = originalIntersectionObserver;
    });

    it('handles server-side rendering gracefully', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const { preloadResource, prefetchResource } = require('../performance');
      
      // These should not throw errors in SSR
      expect(() => preloadResource('/test.css', 'style')).not.toThrow();
      expect(() => prefetchResource('/test.js')).not.toThrow();

      global.window = originalWindow;
    });
  });