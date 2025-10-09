'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error:', error);
    }

    // Optional: Send error to logging service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        fetch('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            type: 'root-error',
          }),
        }).catch(() => {
          // Silently fail if logging fails
        });
      } catch {
        // Silently fail if logging fails
      }
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🚨</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Critical Error
              </h1>
              <p className="text-gray-600 mb-6">
                A critical error occurred that prevented the application from loading properly.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <summary className="cursor-pointer font-medium text-red-800 mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-red-700 overflow-auto whitespace-pre-wrap">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                    {error.stack && `\n\nStack:\n${error.stack}`}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Restart Application
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Please refresh the page or try again later.</p>
                {error.digest && (
                  <p className="mt-1">Error ID: {error.digest}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}