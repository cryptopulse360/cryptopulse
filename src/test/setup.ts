import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import lunr from 'lunr';

global.React = React;

global.fetch = vi.fn((input, init) => {
  if (typeof input === 'string' && input === '/api/search-index') {
    const mockData = [{
      slug: 'bitcoin-technical-analysis-2024',
      title: 'Bitcoin Technical Analysis 2024',
      description: 'In-depth technical analysis of Bitcoin for 2024',
      content: 'Bitcoin price analysis and predictions for 2024...',
      tags: ['bitcoin', 'analysis'],
      author: 'John Doe',
      publishedAt: '2024-01-01T00:00:00.000Z'
    }];

    const mockIndex = lunr(function () {
      this.use(lunr.en);
      this.ref('slug');
      this.field('title');
      this.field('description');
      this.field('content');
      this.field('tags');
      this.field('author');
      mockData.forEach(doc => this.add(Object.assign(doc, { id: doc.slug })));
    });

    const indexString = JSON.stringify(mockIndex.toJSON());
    const responseBody = JSON.stringify({ index: indexString, data: mockData });

    return Promise.resolve(new Response(responseBody, {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  return Promise.resolve(new Response(JSON.stringify({}), {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
  }));
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock TagBadge
vi.mock('@/components/article/TagBadge', () => ({
  TagBadge: ({ tag, size }: any) => React.createElement('span', { className: 'tag' }, tag),
}));

// Mock ImageResponse for OG
vi.mock('@vercel/og', () => ({
  ImageResponse: vi.fn(() => ({
    toBuffer: vi.fn(() => new Uint8Array()),
  })),
}));

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn();
IntersectionObserverMock.prototype.observe = vi.fn();
IntersectionObserverMock.prototype.unobserve = vi.fn();
IntersectionObserverMock.prototype.disconnect = vi.fn();
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock ResizeObserver
const ResizeObserverMock = vi.fn();
ResizeObserverMock.prototype.observe = vi.fn();
ResizeObserverMock.prototype.unobserve = vi.fn();
ResizeObserverMock.prototype.disconnect = vi.fn();
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
