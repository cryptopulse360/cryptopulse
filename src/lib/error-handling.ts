/**
 * Error handling utilities for graceful fallbacks and error recovery
 */

export interface ErrorLogEntry {
  message: string;
  stack?: string;
  digest?: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
  type?: string;
  componentStack?: string;
}

/**
 * Safely execute an async function with fallback
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  errorMessage?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(errorMessage || 'Async operation failed:', error);
    }
    return fallback;
  }
}

/**
 * Safely execute a synchronous function with fallback
 */
export function safeSync<T>(
  fn: () => T,
  fallback: T,
  errorMessage?: string
): T {
  try {
    return fn();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(errorMessage || 'Sync operation failed:', error);
    }
    return fallback;
  }
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Create a safe wrapper for external API calls
 */
export function createSafeApiCall<T>(
  fallbackData: T,
  errorMessage?: string
) {
  return async (apiCall: () => Promise<T>): Promise<T> => {
    return safeAsync(apiCall, fallbackData, errorMessage);
  };
}

/**
 * Handle fetch requests with automatic retries and fallbacks
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit,
  fallback?: T,
  maxRetries: number = 2
): Promise<T | null> {
  try {
    const response = await retryAsync(async () => {
      const res = await fetch(url, {
        ...options,
        // Add timeout
        signal: AbortSignal.timeout(10000),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      return res;
    }, maxRetries);
    
    return await response.json();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Fetch failed for ${url}:`, error);
    }
    
    return fallback || null;
  }
}

/**
 * Log errors to external service (optional)
 */
export async function logError(errorData: ErrorLogEntry): Promise<void> {
  // Only log in production and if window is available
  if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
    return;
  }
  
  try {
    // This could be replaced with actual logging service
    await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });
  } catch {
    // Silently fail if logging fails
  }
}

/**
 * Error fallback configuration
 */
export interface ErrorFallbackConfig {
  title: string;
  message: string;
  showRetry: boolean;
}

/**
 * Create error boundary fallback configuration
 */
export function createErrorFallback(
  title: string = 'Something went wrong',
  message: string = 'Please try refreshing the page.',
  showRetry: boolean = true
): ErrorFallbackConfig {
  return {
    title,
    message,
    showRetry
  };
}

/**
 * Handle image loading errors
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc?: string
): void {
  const img = event.currentTarget;
  
  if (fallbackSrc && img.src !== fallbackSrc) {
    img.src = fallbackSrc;
  } else {
    // Hide image if no fallback available
    img.style.display = 'none';
  }
}

/**
 * Create a safe component wrapper configuration
 */
export interface SafeComponentConfig {
  fallbackMessage: string;
  showError: boolean;
}

export function createSafeComponentConfig(
  fallbackMessage: string = 'Unable to load component',
  showError: boolean = false
): SafeComponentConfig {
  return {
    fallbackMessage,
    showError
  };
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // First trim the input, then apply sanitization
  const trimmedInput = input.trim();
  
  return trimmedInput
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers with values
    .replace(/on\w+\s*=\s*[^\s>]*/gi, ''); // Remove event handlers without quotes
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.name === 'TypeError' ||
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch')
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: Error): string {
  if (isNetworkError(error)) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  if (error.message.includes('404')) {
    return 'The requested content was not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}