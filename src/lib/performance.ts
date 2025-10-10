// Performance optimization utilities

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string, crossOrigin?: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  if (crossOrigin) link.crossOrigin = crossOrigin;
  
  document.head.appendChild(link);
}

/**
 * Prefetch resources for future navigation
 */
export function prefetchResource(href: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
}

/**
 * Lazy load images with intersection observer
 */
export function createImageObserver(callback: (entry: IntersectionObserverEntry) => void) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if matchMedia is available
  if (!window.matchMedia) return false;
  
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) {
    // Fallback if matchMedia fails
    return false;
  }
}

/**
 * Get connection speed information
 */
export function getConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }

  const connection = (navigator as any).connection;
  
  if (connection.effectiveType === '4g') {
    return 'fast';
  } else if (connection.effectiveType === '3g' || connection.effectiveType === '2g') {
    return 'slow';
  }
  
  return 'unknown';
}

/**
 * Critical CSS inlining utility
 */
export function inlineCriticalCSS(css: string): void {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  
  // Insert before any existing stylesheets
  const firstStylesheet = document.querySelector('link[rel="stylesheet"], style');
  if (firstStylesheet) {
    document.head.insertBefore(style, firstStylesheet);
  } else {
    document.head.appendChild(style);
  }
}

/**
 * Load non-critical CSS asynchronously
 */
export function loadCSS(href: string): void {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  
  document.head.appendChild(link);
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  }

  static measure(name: string, startMark: string, endMark?: string): number | null {
    if (typeof performance === 'undefined') return null;
    
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
      
      const measure = performance.getEntriesByName(name, 'measure')[0];
      return measure ? measure.duration : null;
    } catch (error) {
      console.warn('Performance measurement failed:', error);
      return null;
    }
  }

  static getMetrics() {
    if (typeof performance === 'undefined') return null;
    
    try {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (!navigationEntries || navigationEntries.length === 0) return null;
      
      const navigation = navigationEntries[0] as PerformanceNavigationTiming;
      
      return {
        // Core Web Vitals approximations
        fcp: navigation.responseStart - navigation.fetchStart,
        lcp: navigation.loadEventEnd - navigation.fetchStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
      };
    } catch (error) {
      console.warn('Failed to get performance metrics:', error);
      return null;
    }
  }
}

/**
 * Resource hints for better performance
 */
export function addResourceHints(): void {
  if (typeof document === 'undefined') return;
  
  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'plausible.io',
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}