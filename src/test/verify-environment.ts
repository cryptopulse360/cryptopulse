/**
 * Test environment verification script
 * Verifies that all test environment configurations are working correctly
 */

import { describe, it, expect, vi } from 'vitest';

describe('Test Environment Configuration', () => {
  it('should have React available globally', () => {
    expect(global.React).toBeDefined();
    expect(typeof global.React.createElement).toBe('function');
  });

  it('should have proper environment variables set', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
    expect(process.env.TZ).toBe('UTC');
  });

  it('should have fetch mocked', () => {
    expect(global.fetch).toBeDefined();
    expect(vi.isMockFunction(global.fetch)).toBe(true);
  });

  it('should have browser APIs mocked', () => {
    expect(window.matchMedia).toBeDefined();
    expect(global.IntersectionObserver).toBeDefined();
    expect(global.ResizeObserver).toBeDefined();
    expect(global.MutationObserver).toBeDefined();
  });

  it('should have storage APIs mocked', () => {
    expect(window.localStorage).toBeDefined();
    expect(window.sessionStorage).toBeDefined();
    expect(typeof window.localStorage.getItem).toBe('function');
    expect(typeof window.localStorage.setItem).toBe('function');
  });

  it('should have performance API mocked', () => {
    expect(global.performance).toBeDefined();
    expect(typeof global.performance.now).toBe('function');
    expect(typeof global.performance.mark).toBe('function');
    expect(typeof global.performance.measure).toBe('function');
  });

  it('should have animation frame APIs mocked', () => {
    expect(global.requestAnimationFrame).toBeDefined();
    expect(global.cancelAnimationFrame).toBeDefined();
    expect(typeof global.requestAnimationFrame).toBe('function');
    expect(typeof global.cancelAnimationFrame).toBe('function');
  });

  it('should have console methods mocked', () => {
    expect(vi.isMockFunction(console.error)).toBe(true);
    expect(vi.isMockFunction(console.warn)).toBe(true);
    expect(vi.isMockFunction(console.log)).toBe(true);
  });

  it('should have DOM methods mocked', () => {
    expect(typeof Element.prototype.scrollIntoView).toBe('function');
    expect(typeof HTMLElement.prototype.focus).toBe('function');
    expect(typeof HTMLElement.prototype.blur).toBe('function');
  });

  it('should have navigator APIs mocked', () => {
    expect(navigator.clipboard).toBeDefined();
    expect(navigator.geolocation).toBeDefined();
    expect(navigator.connection).toBeDefined();
    expect(navigator.language).toBe('en-US');
  });

  it('should have consistent date/time setup', () => {
    const now = new Date();
    expect(now.getFullYear()).toBe(2024);
    expect(now.getMonth()).toBe(0); // January
    expect(now.getDate()).toBe(1);
  });

  it('should have consistent viewport dimensions', () => {
    expect(window.innerWidth).toBe(1024);
    expect(window.innerHeight).toBe(768);
    expect(window.screen.width).toBe(1920);
    expect(window.screen.height).toBe(1080);
  });
});

describe('Mock Functionality', () => {
  it('should mock fetch responses correctly', async () => {
    const response = await fetch('/api/search-index');
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data).toHaveProperty('index');
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should mock localStorage correctly', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    
    localStorage.removeItem('test');
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('should mock matchMedia correctly', () => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    expect(mediaQuery).toHaveProperty('matches');
    expect(mediaQuery).toHaveProperty('media');
    expect(typeof mediaQuery.addEventListener).toBe('function');
  });

  it('should mock IntersectionObserver correctly', () => {
    const callback = vi.fn();
    const observer = new IntersectionObserver(callback);
    
    expect(observer).toHaveProperty('observe');
    expect(observer).toHaveProperty('unobserve');
    expect(observer).toHaveProperty('disconnect');
    
    const element = document.createElement('div');
    observer.observe(element);
    
    expect(callback).toHaveBeenCalled();
  });

  it('should mock performance API correctly', () => {
    performance.mark('test-mark');
    expect(performance.mark).toHaveBeenCalledWith('test-mark');
    
    const now = performance.now();
    expect(typeof now).toBe('number');
    expect(now).toBeGreaterThan(0);
  });
});

describe('Next.js Mocks', () => {
  it('should have Next.js navigation mocked', async () => {
    const { useRouter } = await import('next/navigation');
    const router = useRouter();
    
    expect(router).toHaveProperty('push');
    expect(router).toHaveProperty('replace');
    expect(router).toHaveProperty('back');
    expect(typeof router.push).toBe('function');
  });

  it('should have Next.js Image component mocked', async () => {
    const { default: Image } = await import('next/image');
    expect(Image).toBeDefined();
  });

  it('should have Next.js Link component mocked', async () => {
    const { default: Link } = await import('next/link');
    expect(Link).toBeDefined();
  });
});

describe('External Dependencies', () => {
  it('should have analytics mocked', async () => {
    const { trackEvent } = await import('@/lib/analytics');
    expect(vi.isMockFunction(trackEvent)).toBe(true);
  });

  it('should have @vercel/og mocked', async () => {
    const { ImageResponse } = await import('@vercel/og');
    expect(vi.isMockFunction(ImageResponse)).toBe(true);
  });
});