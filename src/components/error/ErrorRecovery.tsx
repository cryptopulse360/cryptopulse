'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface ErrorRecoveryProps {
  children: ReactNode;
  maxRetries?: number;
  retryDelay?: number;
  fallback?: ReactNode;
  onError?: (error: Error, retryCount: number) => void;
}

interface ErrorRecoveryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

/**
 * Error recovery component with automatic retry mechanisms
 * Provides intelligent error recovery with exponential backoff
 */
export function ErrorRecovery({
  children,
  maxRetries = 3,
  retryDelay = 1000,
  fallback,
  onError
}: ErrorRecoveryProps) {
  const [errorState, setErrorState] = useState<ErrorRecoveryState>({
    hasError: false,
    retryCount: 0
  });

  const handleRetry = useCallback(() => {
    if (errorState.retryCount < maxRetries) {
      const newRetryCount = errorState.retryCount + 1;
      
      // Exponential backoff delay
      const delay = retryDelay * Math.pow(2, newRetryCount - 1);
      
      setTimeout(() => {
        setErrorState({
          hasError: false,
          retryCount: newRetryCount
        });
      }, delay);
    }
  }, [errorState.retryCount, maxRetries, retryDelay]);

  const handleError = useCallback((error: Error) => {
    const newState = {
      hasError: true,
      error,
      retryCount: errorState.retryCount
    };
    
    setErrorState(newState);
    
    if (onError) {
      onError(error, errorState.retryCount);
    }
  }, [errorState.retryCount, onError]);

  if (errorState.hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const canRetry = errorState.retryCount < maxRetries;
    const retryMessage = canRetry 
      ? `Please try again. (Attempt ${errorState.retryCount + 1}/${maxRetries + 1})`
      : 'Maximum retry attempts reached. Please refresh the page.';

    return (
      <ErrorFallback
        error={errorState.error}
        retry={canRetry ? handleRetry : undefined}
        title="Component Error"
        message={retryMessage}
        showRetry={canRetry}
      />
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    handleError(error as Error);
    return null;
  }
}

/**
 * Hook for error recovery functionality
 */
export function useErrorRecovery(maxRetries: number = 3) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  const recover = useCallback(async (
    operation: () => Promise<void> | void,
    delay: number = 1000
  ) => {
    if (retryCount >= maxRetries) {
      throw new Error('Maximum retry attempts exceeded');
    }

    setIsRecovering(true);
    
    try {
      // Exponential backoff
      const backoffDelay = delay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      await operation();
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      setRetryCount(prev => prev + 1);
      throw error;
    } finally {
      setIsRecovering(false);
    }
  }, [retryCount, maxRetries]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRecovering(false);
  }, []);

  return {
    retryCount,
    isRecovering,
    canRetry: retryCount < maxRetries,
    recover,
    reset
  };
}

export default ErrorRecovery;