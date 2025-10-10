/**
 * Error handling components and utilities
 */

// Main error boundary component
export { ErrorBoundary, withErrorBoundary, useErrorHandler } from './ErrorBoundary';

// Safe component wrappers
export { SafeComponent, useSafeRender } from './SafeComponent';
export { SafeImage } from './SafeImage';

// Error fallback UI
export { ErrorFallback } from './ErrorFallback';

// Nested error boundary for complex scenarios
export { NestedErrorBoundary, withNestedErrorBoundary } from './NestedErrorBoundary';

// Error recovery with retry mechanisms
export { ErrorRecovery, useErrorRecovery } from './ErrorRecovery';

// Default exports for backward compatibility
export { default as ErrorBoundaryDefault } from './ErrorBoundary';
export { default as SafeComponentDefault } from './SafeComponent';
export { default as SafeImageDefault } from './SafeImage';
export { default as NestedErrorBoundaryDefault } from './NestedErrorBoundary';
export { default as ErrorRecoveryDefault } from './ErrorRecovery';