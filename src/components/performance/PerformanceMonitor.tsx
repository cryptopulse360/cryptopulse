'use client';

import { useEffect } from 'react';
import { PerformanceMonitor } from '@/lib/performance';

interface PerformanceMonitorProps {
  enableReporting?: boolean;
  reportingEndpoint?: string;
}

export function PerformanceMonitorComponent({
  enableReporting = false,
  reportingEndpoint,
}: PerformanceMonitorProps) {
  useEffect(() => {
    // Mark initial load
    PerformanceMonitor.mark('app-start');

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
          if (enableReporting && reportingEndpoint) {
            // Report LCP to analytics
            fetch(reportingEndpoint, {
              method: 'POST',
              body: JSON.stringify({
                metric: 'lcp',
                value: entry.startTime,
                timestamp: Date.now(),
              }),
            }).catch(() => {
              // Silently fail
            });
          }
        }

        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
          if (enableReporting && reportingEndpoint) {
            // Report FID to analytics
            fetch(reportingEndpoint, {
              method: 'POST',
              body: JSON.stringify({
                metric: 'fid',
                value: (entry as any).processingStart - entry.startTime,
                timestamp: Date.now(),
              }),
            }).catch(() => {
              // Silently fail
            });
          }
        }

        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value);
          if (enableReporting && reportingEndpoint) {
            // Report CLS to analytics
            fetch(reportingEndpoint, {
              method: 'POST',
              body: JSON.stringify({
                metric: 'cls',
                value: (entry as any).value,
                timestamp: Date.now(),
              }),
            }).catch(() => {
              // Silently fail
            });
          }
        }
      });
    });

    // Observe Core Web Vitals
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    // Report page load metrics after load
    const handleLoad = () => {
      setTimeout(() => {
        const metrics = PerformanceMonitor.getMetrics();
        if (metrics) {
          console.log('Page Load Metrics:', metrics);
          
          if (enableReporting && reportingEndpoint) {
            fetch(reportingEndpoint, {
              method: 'POST',
              body: JSON.stringify({
                metrics,
                timestamp: Date.now(),
                url: window.location.href,
              }),
            }).catch(() => {
              // Silently fail
            });
          }
        }
      }, 1000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('load', handleLoad);
    };
  }, [enableReporting, reportingEndpoint]);

  // This component doesn't render anything
  return null;
}

// Hook for performance monitoring
export function usePerformanceMonitoring(pageName: string) {
  useEffect(() => {
    PerformanceMonitor.mark(`${pageName}-start`);
    
    return () => {
      PerformanceMonitor.mark(`${pageName}-end`);
      const duration = PerformanceMonitor.measure(
        `${pageName}-duration`,
        `${pageName}-start`,
        `${pageName}-end`
      );
      
      if (duration) {
        console.log(`${pageName} render time:`, duration, 'ms');
      }
    };
  }, [pageName]);
}