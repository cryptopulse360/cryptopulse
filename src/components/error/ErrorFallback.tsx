import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  retry?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export function ErrorFallback({ 
  error, 
  retry,
  title = 'Something went wrong',
  message = 'Please try refreshing the page.',
  showRetry = true
}: ErrorFallbackProps) {
  // Determine error type for better user messaging
  const getErrorTypeMessage = (error?: Error): string => {
    if (!error) return message;
    
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return 'Failed to load application resources. Please refresh the page.';
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (error.message.includes('404')) {
      return 'The requested content was not found.';
    }
    
    return message;
  };

  const errorMessage = getErrorTypeMessage(error);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
        {errorMessage}
      </p>
      
      {showRetry && retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label="Retry the failed operation"
        >
          Try Again
        </button>
      )}
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Error Details (Development)
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-auto max-w-md">
            <strong>Error:</strong> {error.name || 'Unknown'}
            {'\n'}
            <strong>Message:</strong> {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}