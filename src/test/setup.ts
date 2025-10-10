import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Set up React globally for all tests
global.React = React;

// Configure test environment for consistent behavior
Object.assign(process.env, {
  NODE_ENV: process.env.NODE_ENV || 'test',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  TZ: process.env.TZ || 'UTC',
});

// Configure consistent locale
Object.defineProperty(navigator, 'language', {
  value: 'en-US',
  writable: true,
});

Object.defineProperty(navigator, 'languages', {
  value: ['en-US', 'en'],
  writable: true,
});

// Mock Date.now for consistent timestamps in tests
const mockDate = new Date('2024-01-01T00:00:00.000Z');
vi.setSystemTime(mockDate);

// Mock fetch with comprehensive API responses
global.fetch = vi.fn((input, _init) => {
  const url = typeof input === 'string' ? input : (input as Request).url;
  
  if (url === '/api/search-index') {
    const mockData = [{
      slug: 'bitcoin-technical-analysis-2024',
      title: 'Bitcoin Technical Analysis 2024',
      description: 'In-depth technical analysis of Bitcoin for 2024',
      content: 'Bitcoin price analysis and predictions for 2024...',
      tags: ['bitcoin', 'analysis'],
      author: 'John Doe',
      publishedAt: '2024-01-01T00:00:00.000Z'
    }];

    // Create a simple mock index structure instead of using lunr
    const mockIndex = {
      version: '2.3.9',
      fields: ['title', 'description', 'content', 'tags', 'author'],
      fieldVectors: {},
      invertedIndex: {},
      pipelineId: 'default'
    };

    const responseBody = JSON.stringify({ index: JSON.stringify(mockIndex), data: mockData });

    return Promise.resolve(new Response(responseBody, {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  // Mock newsletter API
  if (url.includes('/api/newsletter/subscribe')) {
    return Promise.resolve(new Response(JSON.stringify({ success: true, groups: [] }), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  // Mock error logging API
  if (url.includes('/api/log-error')) {
    return Promise.resolve(new Response(JSON.stringify({ success: true }), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  // Default mock response
  return Promise.resolve(new Response(JSON.stringify({}), {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
  }));
});

// Mock Next.js navigation with comprehensive router mock
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => 
    React.createElement('img', { src, alt, ...props }),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => 
    React.createElement('a', { href, ...props }, children),
}));

// Mock Next.js Head component
vi.mock('next/head', () => ({
  default: ({ children }: any) => React.createElement('head', {}, children),
}));

// Mock TagBadge component
vi.mock('@/components/article/TagBadge', () => ({
  TagBadge: ({ tag }: any) => React.createElement('span', { className: 'tag', 'data-testid': 'tag-badge' }, tag),
}));

// Mock Breadcrumb component
vi.mock('@/components/ui/Breadcrumb', () => ({
  default: ({ items }: any) => React.createElement('nav', { 'data-testid': 'breadcrumb' }, 
    items?.map((item: any, index: number) => 
      React.createElement('span', { key: index }, item.label)
    )
  ),
  Breadcrumb: ({ items }: any) => React.createElement('nav', { 'data-testid': 'breadcrumb' }, 
    items?.map((item: any, index: number) => 
      React.createElement('span', { key: index }, item.label)
    )
  ),
}));

// Mock ImageResponse for OG image generation
vi.mock('@vercel/og', () => ({
  ImageResponse: vi.fn().mockImplementation(() => ({
    toBuffer: vi.fn(() => Promise.resolve(new Uint8Array())),
    arrayBuffer: vi.fn(() => Promise.resolve(new ArrayBuffer(0))),
  })),
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
  initAnalytics: vi.fn(),
}));

// Mock IntersectionObserver with comprehensive implementation
const IntersectionObserverMock = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn((element) => {
    // Simulate intersection for testing
    callback([{
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 },
      intersectionRect: { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 },
      rootBounds: { top: 0, left: 0, bottom: 1000, right: 1000, width: 1000, height: 1000 },
      time: Date.now(),
    }]);
  }),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock ResizeObserver with comprehensive implementation
const ResizeObserverMock = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn((element) => {
    // Simulate resize for testing
    callback([{
      target: element,
      contentRect: { top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 },
      borderBoxSize: [{ blockSize: 100, inlineSize: 100 }],
      contentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
      devicePixelContentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
    }]);
  }),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock MutationObserver
const MutationObserverMock = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}));
vi.stubGlobal('MutationObserver', MutationObserverMock);

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

// Mock performance API
const mockPerformance = {
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => []),
  now: vi.fn(() => Date.now()),
  timing: {},
  navigation: {},
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
    },
    userAgent: 'Mozilla/5.0 (Test Environment)',
  },
  writable: true,
});

// Mock CSS.supports for font optimization tests
Object.defineProperty(global, 'CSS', {
  value: {
    supports: vi.fn((property, value) => {
      // Mock common CSS feature support
      if (property === 'font-display' && value === 'swap') return true;
      return false;
    }),
  },
  writable: true,
});

// Mock HTMLLinkElement for preload support tests
Object.defineProperty(global, 'HTMLLinkElement', {
  value: class MockHTMLLinkElement {
    relList = {};
  },
  writable: true,
});

// Add prototype property separately to avoid esbuild issues
if (global.HTMLLinkElement) {
  Object.defineProperty(global.HTMLLinkElement.prototype, 'relList', {
    value: {},
    writable: true,
    configurable: true,
  });
}

// Mock localStorage with comprehensive implementation
const createStorageMock = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock requestAnimationFrame and cancelAnimationFrame for performance tests
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

// Mock console methods for testing
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// Mock window.alert, confirm, prompt
global.alert = vi.fn();
global.confirm = vi.fn(() => true);
global.prompt = vi.fn(() => 'test');

// Mock window.open
global.open = vi.fn();

// Mock window.scrollTo and scroll methods
global.scrollTo = vi.fn() as any;
global.scroll = vi.fn() as any;

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock focus and blur methods
HTMLElement.prototype.focus = vi.fn();
HTMLElement.prototype.blur = vi.fn();

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('test')),
  },
  writable: true,
});

// Mock geolocation API
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn((success) => 
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 100,
        },
      })
    ),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  writable: true,
});
