/**
 * External dependencies mocking setup
 * Provides mocks for all external libraries and APIs used in the application
 */

import { vi } from 'vitest';

/**
 * Setup all external dependency mocks
 */
export function setupExternalMocks() {
  // Mock Plausible analytics
  vi.mock('plausible-tracker', () => ({
    default: vi.fn(() => ({
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      enableAutoPageviews: vi.fn(),
      enableAutoOutboundTracking: vi.fn(),
    })),
  }));

  // Mock Google Analytics
  global.gtag = vi.fn();
  global.dataLayer = [];

  // Mock Lunr search library
  vi.mock('lunr', () => ({
    default: vi.fn(() => ({
      search: vi.fn(() => []),
      add: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
      toJSON: vi.fn(() => ({})),
    })),
    Index: {
      load: vi.fn(() => ({
        search: vi.fn(() => []),
      })),
    },
    Builder: vi.fn(),
    stemmer: vi.fn(),
    stopWordFilter: vi.fn(),
    trimmer: vi.fn(),
  }));

  // Mock reading-time library
  vi.mock('reading-time', () => ({
    default: vi.fn(() => ({
      text: '5 min read',
      minutes: 5,
      time: 300000,
      words: 1000,
    })),
  }));

  // Mock gray-matter for MDX frontmatter
  vi.mock('gray-matter', () => ({
    default: vi.fn((content: string) => ({
      data: {
        title: 'Test Article',
        description: 'Test description',
        publishedAt: '2024-01-01',
        tags: ['test'],
        author: 'Test Author',
      },
      content: content.replace(/^---[\s\S]*?---/, ''),
    })),
  }));

  // Mock next-mdx-remote
  vi.mock('next-mdx-remote', () => ({
    MDXRemote: ({ source }: any) => React.createElement('div', { 
      dangerouslySetInnerHTML: { __html: source } 
    }),
    serialize: vi.fn((content: string) => Promise.resolve({
      compiledSource: content,
      scope: {},
    })),
  }));

  // Mock @vercel/og for Open Graph images
  vi.mock('@vercel/og', () => ({
    ImageResponse: vi.fn().mockImplementation(() => ({
      toBuffer: vi.fn(() => Promise.resolve(new Uint8Array())),
      arrayBuffer: vi.fn(() => Promise.resolve(new ArrayBuffer(0))),
    })),
  }));

  // Mock file system operations for Node.js environment
  if (typeof window === 'undefined') {
    vi.mock('fs', () => ({
      readFileSync: vi.fn(() => 'mock file content'),
      writeFileSync: vi.fn(),
      existsSync: vi.fn(() => true),
      readdirSync: vi.fn(() => ['file1.mdx', 'file2.mdx']),
      statSync: vi.fn(() => ({
        isDirectory: () => false,
        isFile: () => true,
        mtime: new Date(),
      })),
    }));

    vi.mock('path', () => ({
      join: vi.fn((...args) => args.join('/')),
      resolve: vi.fn((...args) => args.join('/')),
      dirname: vi.fn((path) => path.split('/').slice(0, -1).join('/')),
      basename: vi.fn((path) => path.split('/').pop()),
      extname: vi.fn((path) => {
        const parts = path.split('.');
        return parts.length > 1 ? `.${parts.pop()}` : '';
      }),
    }));
  }

  // Mock environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = 'test.com';

  return {
    cleanup: () => {
      vi.clearAllMocks();
      delete global.gtag;
      delete global.dataLayer;
    },
  };
}

/**
 * Mock analytics providers
 */
export function mockAnalytics() {
  // Mock Plausible
  global.plausible = vi.fn();
  
  // Mock Google Analytics
  global.gtag = vi.fn();
  global.dataLayer = global.dataLayer || [];

  // Mock custom analytics functions
  const mockAnalytics = {
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
    trackError: vi.fn(),
    trackPerformance: vi.fn(),
    trackSearch: vi.fn(),
    trackNewsletter: vi.fn(),
  };

  return mockAnalytics;
}

/**
 * Mock search functionality
 */
export function mockSearch() {
  const mockSearchIndex = {
    search: vi.fn((query: string) => [
      {
        ref: 'test-article-1',
        score: 1.0,
        matchData: {
          metadata: {
            [query]: {
              title: {},
              content: {},
            },
          },
        },
      },
    ]),
    add: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
  };

  const mockSearchData = [
    {
      slug: 'test-article-1',
      title: 'Test Article 1',
      description: 'Test description 1',
      content: 'Test content 1',
      tags: ['test', 'article'],
      author: 'Test Author',
      publishedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      slug: 'test-article-2',
      title: 'Test Article 2',
      description: 'Test description 2',
      content: 'Test content 2',
      tags: ['test', 'guide'],
      author: 'Test Author',
      publishedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  return {
    index: mockSearchIndex,
    data: mockSearchData,
  };
}

/**
 * Mock newsletter functionality
 */
export function mockNewsletter() {
  return {
    subscribe: vi.fn((email: string, groupId?: string) => {
      if (email === 'duplicate@test.com') {
        return Promise.resolve({
          success: false,
          error: 'Email already subscribed',
          status: 400,
        });
      }
      
      return Promise.resolve({
        success: true,
        groups: groupId ? [groupId] : [],
        status: 200,
      });
    }),
    unsubscribe: vi.fn(() => Promise.resolve({ success: true })),
    getSubscriptionStatus: vi.fn(() => Promise.resolve({ subscribed: false })),
  };
}

/**
 * Mock performance monitoring
 */
export function mockPerformanceMonitoring() {
  const mockEntries = [
    {
      name: 'navigation',
      entryType: 'navigation',
      startTime: 0,
      duration: 1000,
      loadEventEnd: 1000,
      domContentLoadedEventEnd: 500,
    },
    {
      name: 'first-contentful-paint',
      entryType: 'paint',
      startTime: 300,
      duration: 0,
    },
    {
      name: 'largest-contentful-paint',
      entryType: 'largest-contentful-paint',
      startTime: 800,
      duration: 0,
      size: 1000,
    },
  ];

  const mockPerformance = {
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn((name: string) => 
      mockEntries.filter(entry => entry.name === name)
    ),
    getEntriesByType: vi.fn((type: string) => 
      mockEntries.filter(entry => entry.entryType === type)
    ),
    now: vi.fn(() => Date.now()),
    timing: {
      navigationStart: 0,
      fetchStart: 100,
      domContentLoadedEventEnd: 500,
      loadEventEnd: 1000,
    },
  };

  Object.defineProperty(global, 'performance', {
    value: mockPerformance,
    writable: true,
  });

  return mockPerformance;
}

/**
 * Mock error reporting
 */
export function mockErrorReporting() {
  const errors: any[] = [];
  
  const mockErrorReporter = {
    captureException: vi.fn((error: Error) => {
      errors.push(error);
    }),
    captureMessage: vi.fn((message: string) => {
      errors.push(new Error(message));
    }),
    setContext: vi.fn(),
    setUser: vi.fn(),
    addBreadcrumb: vi.fn(),
    getErrors: () => [...errors],
    clearErrors: () => errors.length = 0,
  };

  // Mock global error handlers
  global.addEventListener('error', (event) => {
    mockErrorReporter.captureException(event.error);
  });

  global.addEventListener('unhandledrejection', (event) => {
    mockErrorReporter.captureException(event.reason);
  });

  return mockErrorReporter;
}

/**
 * Mock image optimization
 */
export function mockImageOptimization() {
  // Mock Next.js Image component
  vi.mock('next/image', () => ({
    default: ({ src, alt, width, height, ...props }: any) => 
      React.createElement('img', {
        src: `${src}?w=${width}&h=${height}&q=75`,
        alt,
        width,
        height,
        loading: 'lazy',
        ...props,
      }),
  }));

  // Mock image loading states
  const mockImageLoader = {
    load: vi.fn((src: string) => Promise.resolve({
      src,
      width: 800,
      height: 600,
      loaded: true,
    })),
    preload: vi.fn((src: string) => Promise.resolve()),
    getOptimizedSrc: vi.fn((src: string, options: any) => 
      `${src}?w=${options.width}&h=${options.height}&q=${options.quality || 75}`
    ),
  };

  return mockImageLoader;
}

/**
 * Mock social media integration
 */
export function mockSocialMedia() {
  return {
    twitter: {
      share: vi.fn((url: string, text: string) => 
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      ),
      follow: vi.fn((username: string) => 
        `https://twitter.com/intent/follow?screen_name=${username}`
      ),
    },
    facebook: {
      share: vi.fn((url: string) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      ),
    },
    linkedin: {
      share: vi.fn((url: string, title: string) => 
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      ),
    },
  };
}