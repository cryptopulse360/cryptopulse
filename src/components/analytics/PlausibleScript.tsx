/**
 * Plausible Analytics script component for privacy-friendly tracking
 */

'use client';

import React from 'react';
import Script from 'next/script';
import { getAnalyticsConfig } from '@/lib/analytics';

/**
 * PlausibleScript component that loads Plausible Analytics
 * Only loads if analytics is enabled and domain is configured
 */
export function PlausibleScript() {
  const config = getAnalyticsConfig();

  // Don't render if analytics is not enabled
  if (!config.enabled || !config.domain) {
    return null;
  }

  const handleLoad = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Plausible Analytics loaded');
    }
  };

  const handleError = (error: Error) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to load Plausible Analytics:', error);
    }
  };

  return (
    <Script
      defer
      data-domain={config.domain}
      src={config.scriptSrc}
      strategy="afterInteractive"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}