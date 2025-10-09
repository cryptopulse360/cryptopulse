/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PlausibleScript } from '../PlausibleScript';

// Mock Next.js Script component
vi.mock('next/script', () => ({
  default: function MockScript({ 
    children, 
    onLoad, 
    onError, 
    ...props 
  }: any) {
    return (
      <script 
        {...props}
        onLoad={onLoad}
        onError={onError}
        data-testid="plausible-script"
      >
        {children}
      </script>
    );
  }
}));

// Mock analytics config
vi.mock('@/lib/analytics', () => ({
  getAnalyticsConfig: vi.fn(),
}));

import { getAnalyticsConfig } from '@/lib/analytics';

const mockGetAnalyticsConfig = getAnalyticsConfig as ReturnType<typeof vi.fn>;

describe('PlausibleScript', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render script when analytics is enabled', () => {
    mockGetAnalyticsConfig.mockReturnValue({
      domain: 'test-domain.com',
      enabled: true,
      scriptSrc: 'https://plausible.io/js/script.js',
    });

    const { getByTestId } = render(<PlausibleScript />);
    
    const script = getByTestId('plausible-script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('data-domain', 'test-domain.com');
    expect(script).toHaveAttribute('src', 'https://plausible.io/js/script.js');
    expect(script).toHaveAttribute('defer');
  });

  it('should not render when analytics is disabled', () => {
    mockGetAnalyticsConfig.mockReturnValue({
      domain: undefined,
      enabled: false,
      scriptSrc: 'https://plausible.io/js/script.js',
    });

    const { queryByTestId } = render(<PlausibleScript />);
    
    expect(queryByTestId('plausible-script')).not.toBeInTheDocument();
  });

  it('should not render when domain is not configured', () => {
    mockGetAnalyticsConfig.mockReturnValue({
      domain: undefined,
      enabled: true,
      scriptSrc: 'https://plausible.io/js/script.js',
    });

    const { queryByTestId } = render(<PlausibleScript />);
    
    expect(queryByTestId('plausible-script')).not.toBeInTheDocument();
  });

  it('should handle script load event', () => {
    mockGetAnalyticsConfig.mockReturnValue({
      domain: 'test-domain.com',
      enabled: true,
      scriptSrc: 'https://plausible.io/js/script.js',
    });

    const { getByTestId } = render(<PlausibleScript />);
    
    const script = getByTestId('plausible-script');
    expect(script).toBeInTheDocument();
  });

  it('should handle script error event', () => {
    mockGetAnalyticsConfig.mockReturnValue({
      domain: 'test-domain.com',
      enabled: true,
      scriptSrc: 'https://plausible.io/js/script.js',
    });

    const { getByTestId } = render(<PlausibleScript />);
    
    const script = getByTestId('plausible-script');
    expect(script).toBeInTheDocument();
  });
});