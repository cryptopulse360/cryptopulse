/**
 * Privacy-friendly analytics utilities using Plausible Analytics
 */

import { siteConfig } from './constants';

/**
 * Analytics event data structure
 */
export interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
}

/**
 * Custom events for tracking key interactions
 */
export const ANALYTICS_EVENTS = {
  // Article interactions
  ARTICLE_VIEW: 'Article View',
  ARTICLE_SHARE: 'Article Share',
  ARTICLE_SEARCH: 'Article Search',
  
  // Navigation
  SEARCH_OPEN: 'Search Open',
  SEARCH_QUERY: 'Search Query',
  TAG_CLICK: 'Tag Click',
  
  // Newsletter
  NEWSLETTER_SIGNUP: 'Newsletter Signup',
  NEWSLETTER_SUCCESS: 'Newsletter Success',
  
  // Theme
  THEME_TOGGLE: 'Theme Toggle',
  
  // External links
  EXTERNAL_LINK: 'External Link',
} as const;

/**
 * Check if analytics is enabled and configured
 */
export function isAnalyticsEnabled(): boolean {
  return Boolean(siteConfig.analytics.plausibleDomain);
}

/**
 * Track a custom event with Plausible Analytics
 */
export function trackEvent(eventName: string, props?: Record<string, string | number | boolean>): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  // Check if Plausible is loaded
  if (typeof window !== 'undefined' && window.plausible) {
    try {
      if (props) {
        window.plausible(eventName, { props });
      } else {
        window.plausible(eventName);
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
}

/**
 * Track article view with metadata
 */
export function trackArticleView(slug: string, title: string, tags: string[]): void {
  trackEvent(ANALYTICS_EVENTS.ARTICLE_VIEW, {
    slug,
    title,
    tags: tags.join(','),
  });
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultsCount: number): void {
  trackEvent(ANALYTICS_EVENTS.SEARCH_QUERY, {
    query,
    results: resultsCount,
  });
}

/**
 * Track newsletter signup attempt
 */
export function trackNewsletterSignup(source: string): void {
  trackEvent(ANALYTICS_EVENTS.NEWSLETTER_SIGNUP, {
    source,
  });
}

/**
 * Track newsletter signup success
 */
export function trackNewsletterSuccess(source: string): void {
  trackEvent(ANALYTICS_EVENTS.NEWSLETTER_SUCCESS, {
    source,
  });
}

/**
 * Track theme toggle
 */
export function trackThemeToggle(theme: string): void {
  trackEvent(ANALYTICS_EVENTS.THEME_TOGGLE, {
    theme,
  });
}

/**
 * Track tag click
 */
export function trackTagClick(tag: string, source: string): void {
  trackEvent(ANALYTICS_EVENTS.TAG_CLICK, {
    tag,
    source,
  });
}

/**
 * Track external link click
 */
export function trackExternalLink(url: string, source: string): void {
  trackEvent(ANALYTICS_EVENTS.EXTERNAL_LINK, {
    url,
    source,
  });
}

/**
 * Track article share
 */
export function trackArticleShare(slug: string, platform: string): void {
  trackEvent(ANALYTICS_EVENTS.ARTICLE_SHARE, {
    slug,
    platform,
  });
}

/**
 * Get analytics configuration for script loading
 */
export function getAnalyticsConfig() {
  return {
    domain: siteConfig.analytics.plausibleDomain,
    enabled: isAnalyticsEnabled(),
    scriptSrc: 'https://plausible.io/js/script.js',
  };
}