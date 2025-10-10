/**
 * Performance testing environment setup
 * This file provides comprehensive mocks for browser APIs used in performance testing
 */

import { vi } from 'vitest';

/**
 * Setup comprehensive browser API mocks for performance testing
 */
export function setupPerformanceTestEnvironment() {
  // Mock window.matchMedia with comprehensive implementation
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce') ? false : true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock performance API with all necessary methods
  const mockPerformance = {
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    now: vi.fn(() => Date.now()),
    timing: {
      navigationStart: 0,
      fetchStart: 100,
      domainLookupStart: 110,
      domainLookupEnd: 120,
      connectStart: 120,
      connectEnd: 130,
      requestStart: 140,
      responseStart: 200,
      responseEnd: 250,
      domLoading: 260,
      domInteractive: 300,
      domContentLoadedEventStart: 310,
      domContentLoadedEventEnd: 320,
      domComplete: 400,
      loadEventStart: 410,
      loadEventEnd: 420,
    },
    navigation: {
      type: 0,
      redirectCount: 0,
    },
  };

  Object.defineProperty(global, 'performance', {
    value: mockPerformance,
    writable: true,
  });

  // Mock navigator with connection API
  Object.defineProperty(global, 'navigator', {
    value: {
      ...global.navigator,
      connection: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false,
      },
      userAgent: 'Mozilla/5.0 (Test Environment) AppleWebKit/537.36',
      hardwareConcurrency: 4,
      deviceMemory: 8,
    },
    writable: true,
  });

  // Mock CSS.supports for font optimization tests
  Object.defineProperty(global, 'CSS', {
    value: {
      supports: vi.fn((property: string, value: string) => {
        // Mock common CSS feature support
        const supportedFeatures = {
          'font-display': ['swap', 'fallback', 'optional'],
          'object-fit': ['cover', 'contain'],
          'aspect-ratio': ['1/1', '16/9'],
        };
        
        return supportedFeatures[property as keyof typeof supportedFeatures]?.includes(value) || false;
      }),
    },
    writable: true,
  });

  // Mock HTMLLinkElement for preload support tests
  const MockHTMLLinkElement = class {
    relList = {
      supports: vi.fn((rel: string) => ['preload', 'prefetch', 'dns-prefetch'].includes(rel)),
    };
  };
  
  Object.defineProperty(global, 'HTMLLinkElement', {
    value: MockHTMLLinkElement,
    writable: true,
  });

  // Mock document for DOM manipulation tests
  Object.defineProperty(global, 'document', {
    value: {
      ...global.document,
      createElement: vi.fn((tagName: string) => {
        const element = {
          tagName: tagName.toUpperCase(),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          appendChild: vi.fn(),
          removeChild: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          style: {},
          classList: {
            add: vi.fn(),
            remove: vi.fn(),
            contains: vi.fn(),
            toggle: vi.fn(),
          },
        };
        
        if (tagName === 'link') {
          Object.assign(element, {
            rel: '',
            href: '',
            as: '',
            type: '',
            crossOrigin: '',
            media: 'all',
            onload: null,
            onerror: null,
          });
        }
        
        return element;
      }),
      head: {
        appendChild: vi.fn(),
        insertBefore: vi.fn(),
        removeChild: vi.fn(),
      },
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => []),
    },
    writable: true,
  });

  // Mock requestAnimationFrame and cancelAnimationFrame
  global.requestAnimationFrame = vi.fn((callback) => {
    return setTimeout(callback, 16); // ~60fps
  });
  
  global.cancelAnimationFrame = vi.fn((id) => {
    clearTimeout(id);
  });

  // Mock requestIdleCallback for performance optimizations
  (global as any).requestIdleCallback = vi.fn((callback) => {
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
  });

  (global as any).cancelIdleCallback = vi.fn((id) => {
    clearTimeout(id);
  });

  return {
    mockPerformance,
    cleanup: () => {
      vi.clearAllMocks();
    },
  };
}

/**
 * Mock reduced motion preference
 */
export function mockReducedMotion(enabled: boolean = true) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce') ? enabled : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Mock slow network connection
 */
export function mockSlowConnection() {
  Object.defineProperty(global, 'navigator', {
    value: {
      ...global.navigator,
      connection: {
        effectiveType: '2g',
        downlink: 0.5,
        rtt: 2000,
        saveData: true,
      },
    },
    writable: true,
  });
}

/**
 * Mock performance entries for testing
 */
export function mockPerformanceEntries(entries: any[]) {
  const mockPerformance = global.performance as any;
  mockPerformance.getEntriesByType.mockImplementation((type: string) => {
    return entries.filter(entry => entry.entryType === type);
  });
  mockPerformance.getEntriesByName.mockImplementation((name: string) => {
    return entries.filter(entry => entry.name === name);
  });
}