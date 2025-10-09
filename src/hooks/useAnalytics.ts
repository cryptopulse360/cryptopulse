/**
 * Custom hook for analytics tracking
 */

import { useCallback } from 'react';
import {
  trackEvent,
  trackArticleView,
  trackSearch,
  trackNewsletterSignup,
  trackNewsletterSuccess,
  trackThemeToggle,
  trackTagClick,
  trackExternalLink,
  trackArticleShare,
  ANALYTICS_EVENTS,
} from '@/lib/analytics';

/**
 * Hook that provides analytics tracking functions
 */
export function useAnalytics() {
  const track = useCallback((eventName: string, props?: Record<string, string | number | boolean>) => {
    trackEvent(eventName, props);
  }, []);

  const trackArticle = useCallback((slug: string, title: string, tags: string[]) => {
    trackArticleView(slug, title, tags);
  }, []);

  const trackSearchQuery = useCallback((query: string, resultsCount: number) => {
    trackSearch(query, resultsCount);
  }, []);

  const trackNewsletterAttempt = useCallback((source: string) => {
    trackNewsletterSignup(source);
  }, []);

  const trackNewsletterComplete = useCallback((source: string) => {
    trackNewsletterSuccess(source);
  }, []);

  const trackTheme = useCallback((theme: string) => {
    trackThemeToggle(theme);
  }, []);

  const trackTag = useCallback((tag: string, source: string) => {
    trackTagClick(tag, source);
  }, []);

  const trackExternal = useCallback((url: string, source: string) => {
    trackExternalLink(url, source);
  }, []);

  const trackShare = useCallback((slug: string, platform: string) => {
    trackArticleShare(slug, platform);
  }, []);

  const trackSearchOpen = useCallback(() => {
    track(ANALYTICS_EVENTS.SEARCH_OPEN);
  }, [track]);

  return {
    track,
    trackArticle,
    trackSearchQuery,
    trackNewsletterAttempt,
    trackNewsletterComplete,
    trackTheme,
    trackTag,
    trackExternal,
    trackShare,
    trackSearchOpen,
  };
}