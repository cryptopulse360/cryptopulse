import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LazyLoad, withLazyLoading } from '../LazyLoad';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('LazyLoad', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  it('renders fallback initially', () => {
    render(
      <LazyLoad fallback={<div>Loading...</div>}>
        <div>Content</div>
      </LazyLoad>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders children when visible', () => {
    let intersectionCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
      };
    });

    render(
      <LazyLoad fallback={<div>Loading...</div>}>
        <div>Content</div>
      </LazyLoad>
    );

    // Simulate intersection
    intersectionCallback([{ isIntersecting: true }]);

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('sets up intersection observer with correct options', () => {
    render(
      <LazyLoad rootMargin="100px" threshold={0.5}>
        <div>Content</div>
      </LazyLoad>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '100px',
        threshold: 0.5,
      }
    );
  });
});

describe('withLazyLoading', () => {
  it('creates a lazy-loaded component', () => {
    const TestComponent = ({ text }: { text: string }) => <div>{text}</div>;
    const LazyTestComponent = withLazyLoading(TestComponent, <div>Loading...</div>);

    render(<LazyTestComponent text="Hello" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});