'use client';

import { ReactNode, Component, ErrorInfo } from 'react';
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
    if (process.env.NODE_ENV === 'development') {
      console.error('SafeComponent caught error:', error, errorInfo);
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
    return fallback;
  }
}