/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAnalytics } from '../useAnalytics';

// Mock the analytics functions
vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
  trackArticleView: vi.fn(),
  trackSearch: vi.fn(),
  trackNewsletterSignup: vi.fn(),
  trackNewsletterSuccess: vi.fn(),
  trackThemeToggle: vi.fn(),
  trackTagClick: vi.fn(),
  trackExternalLink: vi.fn(),
  trackArticleShare: vi.fn(),
  ANALYTICS_EVENTS: {
    SEARCH_OPEN: 'Search Open',
  },
}));

import * as analytics from '@/lib/analytics';

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide all tracking functions', () => {
    const { result } = renderHook(() => useAnalytics());
    
    expect(result.current).toHaveProperty('track');
    expect(result.current).toHaveProperty('trackArticle');
    expect(result.current).toHaveProperty('trackSearchQuery');
    expect(result.current).toHaveProperty('trackNewsletterAttempt');
    expect(result.current).toHaveProperty('trackNewsletterComplete');
    expect(result.current).toHaveProperty('trackTheme');
    expect(result.current).toHaveProperty('trackTag');
    expect(result.current).toHaveProperty('trackExternal');
    expect(result.current).toHaveProperty('trackShare');
    expect(result.current).toHaveProperty('trackSearchOpen');
  });

  it('should call trackEvent when track is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.track('Test Event', { prop: 'value' });
    
    expect(analytics.trackEvent).toHaveBeenCalledWith('Test Event', { prop: 'value' });
  });

  it('should call trackArticleView when trackArticle is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackArticle('test-slug', 'Test Title', ['tag1', 'tag2']);
    
    expect(analytics.trackArticleView).toHaveBeenCalledWith('test-slug', 'Test Title', ['tag1', 'tag2']);
  });

  it('should call trackSearch when trackSearchQuery is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackSearchQuery('bitcoin', 5);
    
    expect(analytics.trackSearch).toHaveBeenCalledWith('bitcoin', 5);
  });

  it('should call trackNewsletterSignup when trackNewsletterAttempt is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackNewsletterAttempt('footer');
    
    expect(analytics.trackNewsletterSignup).toHaveBeenCalledWith('footer');
  });

  it('should call trackNewsletterSuccess when trackNewsletterComplete is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackNewsletterComplete('footer');
    
    expect(analytics.trackNewsletterSuccess).toHaveBeenCalledWith('footer');
  });

  it('should call trackThemeToggle when trackTheme is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackTheme('dark');
    
    expect(analytics.trackThemeToggle).toHaveBeenCalledWith('dark');
  });

  it('should call trackTagClick when trackTag is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackTag('bitcoin', 'article-header');
    
    expect(analytics.trackTagClick).toHaveBeenCalledWith('bitcoin', 'article-header');
  });

  it('should call trackExternalLink when trackExternal is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackExternal('https://example.com', 'footer');
    
    expect(analytics.trackExternalLink).toHaveBeenCalledWith('https://example.com', 'footer');
  });

  it('should call trackArticleShare when trackShare is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackShare('test-slug', 'twitter');
    
    expect(analytics.trackArticleShare).toHaveBeenCalledWith('test-slug', 'twitter');
  });

  it('should call trackEvent with SEARCH_OPEN when trackSearchOpen is called', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackSearchOpen();
    
    expect(analytics.trackEvent).toHaveBeenCalledWith('Search Open', undefined);
  });

  it('should maintain function references across re-renders', () => {
    const { result, rerender } = renderHook(() => useAnalytics());
    
    const firstRender = result.current;
    rerender();
    const secondRender = result.current;
    
    expect(firstRender.track).toBe(secondRender.track);
    expect(firstRender.trackArticle).toBe(secondRender.trackArticle);
    expect(firstRender.trackSearchQuery).toBe(secondRender.trackSearchQuery);
  });
});