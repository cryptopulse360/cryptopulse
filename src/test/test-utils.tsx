/**
 * Comprehensive test utilities for React Testing Library
 * Provides custom render functions and utilities for consistent testing
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { vi } from 'vitest';

// Mock contexts that components might need
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', { 'data-theme': 'light' }, children);
};

const MockSearchProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', { 'data-search-provider': 'mock' }, children);
};

// All the providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockThemeProvider>
      <MockSearchProvider>
        {children}
      </MockSearchProvider>
    </MockThemeProvider>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

/**
 * Create a mock component for testing
 */
export const createMockComponent = (name: string, props?: any) => {
  return React.forwardRef<HTMLDivElement, any>((componentProps, ref) => 
    React.createElement('div', {
      ref,
      'data-testid': `mock-${name.toLowerCase()}`,
      'data-mock-component': name,
      ...props,
      ...componentProps,
    }, componentProps.children)
  );
};

/**
 * Mock Next.js router for testing
 */
export const createMockRouter = (overrides: any = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  ...overrides,
});

/**
 * Mock window.matchMedia for responsive testing
 */
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Mock intersection observer for lazy loading tests
 */
export const mockIntersectionObserver = (isIntersecting: boolean = true) => {
  const mockObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn((element) => {
      callback([{
        target: element,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 },
        intersectionRect: { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 },
        rootBounds: { top: 0, left: 0, bottom: 1000, right: 1000, width: 1000, height: 1000 },
        time: Date.now(),
      }]);
    }),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  vi.stubGlobal('IntersectionObserver', mockObserver);
  return mockObserver;
};

/**
 * Mock fetch with custom responses
 */
export const mockFetch = (responses: Record<string, any> = {}) => {
  global.fetch = vi.fn((input) => {
    const url = typeof input === 'string' ? input : input.url;
    const response = responses[url] || { success: true };
    
    return Promise.resolve(new Response(JSON.stringify(response), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    }));
  });
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Create mock article data for testing
 */
export const createMockArticle = (overrides: any = {}) => ({
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test article description',
  content: 'Test article content',
  tags: ['test', 'article'],
  author: 'Test Author',
  publishedAt: '2024-01-01T00:00:00.000Z',
  readingTime: '5 min read',
  ...overrides,
});

/**
 * Create mock search results for testing
 */
export const createMockSearchResults = (count: number = 3) => {
  return Array.from({ length: count }, (_, index) => createMockArticle({
    slug: `test-article-${index + 1}`,
    title: `Test Article ${index + 1}`,
  }));
};

/**
 * Mock performance API for performance tests
 */
export const mockPerformanceAPI = () => {
  const mockPerformance = {
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    now: vi.fn(() => Date.now()),
    timing: {
      navigationStart: 0,
      fetchStart: 100,
      domContentLoadedEventEnd: 200,
      loadEventEnd: 300,
    },
  };

  Object.defineProperty(global, 'performance', {
    value: mockPerformance,
    writable: true,
  });

  return mockPerformance;
};

/**
 * Setup test environment for accessibility testing
 */
export const setupAccessibilityTesting = () => {
  // Mock axe-core for accessibility testing
  vi.mock('axe-core', () => ({
    run: vi.fn(() => Promise.resolve({ violations: [] })),
    configure: vi.fn(),
  }));

  // Ensure focus is visible in tests
  const style = document.createElement('style');
  style.textContent = `
    *:focus {
      outline: 2px solid blue !important;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Clean up test environment
 */
export const cleanupTestEnvironment = () => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  
  // Clear any timers
  vi.clearAllTimers();
  
  // Reset DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
};

/**
 * Mock error boundary for testing error scenarios
 */
export const MockErrorBoundary = ({ children, onError }: { 
  children: React.ReactNode; 
  onError?: (error: Error) => void;
}) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      setHasError(true);
      onError?.(error.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  if (hasError) {
    return React.createElement('div', { 'data-testid': 'error-fallback' }, 'Something went wrong');
  }

  return React.createElement(React.Fragment, {}, children);
};