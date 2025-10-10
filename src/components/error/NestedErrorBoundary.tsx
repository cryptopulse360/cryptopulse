'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { SafeComponent } from './SafeComponent';

interface NestedErrorBoundaryProps {
  children: ReactNode;
  outerFallback?: ReactNode;
  innerFallback?: ReactNode;
  level?: 'outer' | 'inner';
}

/**
 * Nested error boundary for handling complex error scenarios
 * Provides multiple layers of error catching for robust error handling
 */
export function NestedErrorBoundary({
  children,
  outerFallback,
  innerFallback,
  level = 'outer'
}: NestedErrorBoundaryProps) {
  if (level === 'outer') {
    return (
      <ErrorBoundary fallback={outerFallback}>
        <SafeComponent fallback={innerFallback}>
          {children}
        </SafeComponent>
      </ErrorBoundary>
    );
  }

  return (
    <SafeComponent fallback={innerFallback}>
      {children}
    </SafeComponent>
  );
}

/**
 * Higher-order component for wrapping components with nested error boundaries
 */
export function withNestedErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  outerFallback?: ReactNode,
  innerFallback?: ReactNode
) {
  return function WithNestedErrorBoundaryComponent(props: P) {
    return (
      <NestedErrorBoundary 
        outerFallback={outerFallback}
        innerFallback={innerFallback}
      >
        <Component {...props} />
      </NestedErrorBoundary>
    );
  };
}

export default NestedErrorBoundary;