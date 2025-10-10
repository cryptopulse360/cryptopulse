'use client';

import React, { ReactNode, Component, ErrorInfo } from 'react';
import { createErrorFallback } from '@/lib/error-handling';
import { ErrorFallback } from './ErrorFallback';

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

interface SafeComponentState {
  hasError: boolean;
  error?: Error;
}

export class SafeComponent extends Component<SafeComponentProps, SafeComponentState> {
  constructor(props: SafeComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SafeComponentState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('SafeComponent caught error:', error, errorInfo);
    }

    // Log error for monitoring in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      try {
        fetch('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            type: 'SafeComponent',
          }),
        }).catch(() => {
          // Silently fail if logging fails
        });
      } catch {
        // Silently fail if logging fails
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const config = createErrorFallback(
        this.props.title,
        this.props.message,
        this.props.showRetry
      );

      return (
        <ErrorFallback 
          error={this.state.error} 
          retry={this.handleRetry}
          title={config.title}
          message={config.message}
          showRetry={config.showRetry}
        />
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useSafeRender<T>(
  renderFn: () => T,
  fallback: T,
  deps: React.DependencyList = []
): T {
  try {
    return renderFn();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Safe render failed:', error);
    }

    // Log different error types appropriately
    if (error instanceof TypeError) {
      console.warn('Type error in safe render - check prop types:', error.message);
    } else if (error instanceof ReferenceError) {
      console.warn('Reference error in safe render - check variable definitions:', error.message);
    }

    return fallback;
  }
}

// Default export for backward compatibility
export default SafeComponent;