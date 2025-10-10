/**
 * Test environment configuration
 * Ensures consistent test behavior across different environments
 */

import { vi } from 'vitest';

/**
 * Configure test environment for reliability
 */
export function configureTestEnvironment() {
  // Set consistent timezone for date tests
  process.env.TZ = 'UTC';

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

  // Configure consistent viewport size
  Object.defineProperty(window, 'innerWidth', {
    value: 1024,
    writable: true,
  });

  Object.defineProperty(window, 'innerHeight', {
    value: 768,
    writable: true,
  });

  // Mock screen properties
  Object.defineProperty(window, 'screen', {
    value: {
      width: 1920,
      height: 1080,
      availWidth: 1920,
      availHeight: 1040,
      colorDepth: 24,
      pixelDepth: 24,
    },
    writable: true,
  });

  // Configure device pixel ratio
  Object.defineProperty(window, 'devicePixelRatio', {
    value: 1,
    writable: true,
  });

  // Mock user agent for consistent browser detection
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Test Environment) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    writable: true,
  });

  // Mock platform
  Object.defineProperty(navigator, 'platform', {
    value: 'Test',
    writable: true,
  });

  // Configure consistent color scheme preference
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      const matches = (() => {
        if (query.includes('prefers-color-scheme: dark')) return false;
        if (query.includes('prefers-reduced-motion: reduce')) return false;
        if (query.includes('prefers-contrast: high')) return false;
        if (query.includes('max-width: 768px')) return false; // Mobile
        if (query.includes('max-width: 1024px')) return true; // Tablet
        return false;
      })();

      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });

  // Mock crypto API for consistent random values in tests
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: vi.fn((arr: any) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      }),
      randomUUID: vi.fn(() => '12345678-1234-1234-1234-123456789012'),
      subtle: {
        digest: vi.fn(() => Promise.resolve(new ArrayBuffer(32))),
      },
    },
    writable: true,
  });

  // Mock URL constructor for consistent URL handling
  global.URL = class MockURL {
    href: string;
    origin: string;
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;

    constructor(url: string, base?: string) {
      const fullUrl = base ? new URL(url, base).href : url;
      this.href = fullUrl;
      
      const parsed = new URL(fullUrl);
      this.origin = parsed.origin;
      this.protocol = parsed.protocol;
      this.hostname = parsed.hostname;
      this.port = parsed.port;
      this.pathname = parsed.pathname;
      this.search = parsed.search;
      this.hash = parsed.hash;
    }

    toString() {
      return this.href;
    }

    static createObjectURL = vi.fn(() => 'blob:test-url');
    static revokeObjectURL = vi.fn();
  } as any;

  // Mock URLSearchParams for consistent query parameter handling
  global.URLSearchParams = class MockURLSearchParams {
    private params: Map<string, string> = new Map();

    constructor(init?: string | URLSearchParams | Record<string, string>) {
      if (typeof init === 'string') {
        const pairs = init.replace(/^\?/, '').split('&');
        pairs.forEach(pair => {
          const [key, value] = pair.split('=');
          if (key) this.params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
        });
      } else if (init instanceof URLSearchParams) {
        init.forEach((value, key) => this.params.set(key, value));
      } else if (init && typeof init === 'object') {
        Object.entries(init).forEach(([key, value]) => this.params.set(key, value));
      }
    }

    get(key: string) {
      return this.params.get(key);
    }

    set(key: string, value: string) {
      this.params.set(key, value);
    }

    has(key: string) {
      return this.params.has(key);
    }

    delete(key: string) {
      this.params.delete(key);
    }

    forEach(callback: (value: string, key: string) => void) {
      this.params.forEach(callback);
    }

    toString() {
      const pairs: string[] = [];
      this.params.forEach((value, key) => {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
      return pairs.join('&');
    }
  } as any;

  // Mock Blob for file handling tests
  global.Blob = class MockBlob {
    size: number;
    type: string;
    
    constructor(parts: any[] = [], options: { type?: string } = {}) {
      this.size = parts.reduce((size, part) => size + (part?.length || 0), 0);
      this.type = options.type || '';
    }

    slice() {
      return new MockBlob();
    }

    stream() {
      return new ReadableStream();
    }

    text() {
      return Promise.resolve('mock text');
    }

    arrayBuffer() {
      return Promise.resolve(new ArrayBuffer(this.size));
    }
  } as any;

  // Mock File for file upload tests
  global.File = class MockFile extends global.Blob {
    name: string;
    lastModified: number;

    constructor(parts: any[], name: string, options: any = {}) {
      super(parts, options);
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
    }
  } as any;

  // Mock FileReader for file reading tests
  global.FileReader = class MockFileReader {
    result: string | ArrayBuffer | null = null;
    error: any = null;
    readyState: number = 0;
    onload: ((event: any) => void) | null = null;
    onerror: ((event: any) => void) | null = null;
    onloadend: ((event: any) => void) | null = null;

    readAsText(file: Blob) {
      setTimeout(() => {
        this.result = 'mock file content';
        this.readyState = 2;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      }, 0);
    }

    readAsDataURL(file: Blob) {
      setTimeout(() => {
        this.result = 'data:text/plain;base64,bW9jayBmaWxlIGNvbnRlbnQ=';
        this.readyState = 2;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      }, 0);
    }

    readAsArrayBuffer(file: Blob) {
      setTimeout(() => {
        this.result = new ArrayBuffer(file.size);
        this.readyState = 2;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      }, 0);
    }

    abort() {
      this.readyState = 2;
    }
  } as any;

  return {
    cleanup: () => {
      vi.useRealTimers();
      vi.clearAllMocks();
    },
  };
}

/**
 * Mock responsive breakpoints for testing
 */
export function mockResponsiveBreakpoints() {
  const breakpoints = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
  };

  return {
    setBreakpoint: (breakpoint: keyof typeof breakpoints) => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === breakpoints[breakpoint],
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    },
    breakpoints,
  };
}

/**
 * Mock network conditions for testing
 */
export function mockNetworkConditions(type: 'fast' | 'slow' | 'offline' = 'fast') {
  const conditions = {
    fast: {
      online: true,
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
      saveData: false,
    },
    slow: {
      online: true,
      effectiveType: '2g',
      downlink: 0.5,
      rtt: 2000,
      saveData: true,
    },
    offline: {
      online: false,
      effectiveType: 'slow-2g',
      downlink: 0,
      rtt: 0,
      saveData: true,
    },
  };

  Object.defineProperty(navigator, 'onLine', {
    value: conditions[type].online,
    writable: true,
  });

  Object.defineProperty(navigator, 'connection', {
    value: conditions[type],
    writable: true,
  });

  // Mock network events
  const networkEvents = {
    online: vi.fn(),
    offline: vi.fn(),
  };

  global.addEventListener = vi.fn((event: string, handler: any) => {
    if (event === 'online' || event === 'offline') {
      networkEvents[event] = handler;
    }
  });

  return {
    goOnline: () => {
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
      networkEvents.online();
    },
    goOffline: () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
      networkEvents.offline();
    },
  };
}