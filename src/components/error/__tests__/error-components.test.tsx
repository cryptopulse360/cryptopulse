import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { 
  ErrorBoundary, 
  SafeComponent, 
  SafeImage, 
  ErrorFallback,
  NestedErrorBoundary,
  ErrorRecovery
} from '../index';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: function MockImage({ src, alt, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onError={onError}
        {...props}
      />
    );
  },
}));

// Mock fetch for error logging
global.fetch = vi.fn();

describe('Error Components Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ErrorBoundary', () => {
    function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    }

    it('exports and renders correctly', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('handles errors with proper fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('SafeComponent', () => {
    function ThrowError(): React.ReactElement {
      throw new Error('Safe component error');
    }

    it('exports and handles errors gracefully', () => {
      render(
        <SafeComponent>
          <ThrowError />
        </SafeComponent>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders children when no error occurs', () => {
      render(
        <SafeComponent>
          <div>Safe content</div>
        </SafeComponent>
      );

      expect(screen.getByText('Safe content')).toBeInTheDocument();
    });
  });

  describe('SafeImage', () => {
    it('exports and renders image correctly', () => {
      render(
        <SafeImage
          src="test-image.jpg"
          alt="Test image"
          width={100}
          height={100}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'test-image.jpg');
      expect(img).toHaveAttribute('alt', 'Test image');
    });

    it('handles image load errors with fallback', () => {
      render(
        <SafeImage
          src="broken-image.jpg"
          alt="Test image"
          fallbackSrc="fallback.jpg"
          width={100}
          height={100}
        />
      );

      const img = screen.getByRole('img');
      fireEvent.error(img);

      expect(img).toHaveAttribute('src', 'fallback.jpg');
    });

    it('shows placeholder when both images fail', async () => {
      const { rerender } = render(
        <SafeImage
          src="broken-image.jpg"
          alt="Test image"
          fallbackSrc="also-broken.jpg"
          width={100}
          height={100}
        />
      );

      const img = screen.getByRole('img');
      
      // First error - switch to fallback
      fireEvent.error(img);
      expect(img).toHaveAttribute('src', 'also-broken.jpg');
      
      // Second error - should show placeholder
      fireEvent.error(img);
      
      await waitFor(() => {
        expect(screen.getByText('Image unavailable')).toBeInTheDocument();
      });
    });
  });

  describe('ErrorFallback', () => {
    it('exports and renders error message', () => {
      const error = new Error('Test error message');
      
      render(
        <ErrorFallback 
          error={error}
          title="Custom Error"
          message="Custom error message"
        />
      );

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('handles retry functionality', () => {
      const mockRetry = vi.fn();
      
      render(
        <ErrorFallback 
          retry={mockRetry}
          showRetry={true}
        />
      );

      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);

      expect(mockRetry).toHaveBeenCalledOnce();
    });

    it('shows error details in development', () => {
      const originalEnv = process.env.NODE_ENV;
      
      // Use Object.defineProperty to modify NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      });

      const error = new Error('Development error');
      
      render(<ErrorFallback error={error} />);

      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();

      // Restore original value
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
        configurable: true
      });
    });
  });

  describe('NestedErrorBoundary', () => {
    function ThrowError(): React.ReactElement {
      throw new Error('Nested error');
    }

    it('exports and handles nested errors', () => {
      render(
        <NestedErrorBoundary>
          <div>Outer content</div>
          <ThrowError />
        </NestedErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('ErrorRecovery', () => {
    function UnstableComponent({ shouldThrow }: { shouldThrow: boolean }) {
      if (shouldThrow) {
        throw new Error('Unstable component error');
      }
      return <div>Stable content</div>;
    }

    it('exports and provides recovery functionality', async () => {
      let shouldThrow = true;
      
      const { rerender } = render(
        <ErrorRecovery maxRetries={2}>
          <UnstableComponent shouldThrow={shouldThrow} />
        </ErrorRecovery>
      );

      // Should show error initially
      expect(screen.getByText('Component Error')).toBeInTheDocument();
      
      // Fix the error condition
      shouldThrow = false;
      
      // Click retry
      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);
      
      // Wait for retry delay and rerender
      await waitFor(() => {
        rerender(
          <ErrorRecovery maxRetries={2}>
            <UnstableComponent shouldThrow={shouldThrow} />
          </ErrorRecovery>
        );
      });

      // Should eventually show stable content
      await waitFor(() => {
        expect(screen.getByText('Stable content')).toBeInTheDocument();
      });
    });
  });

  describe('Component Exports', () => {
    it('exports all components from index', () => {
      // Test that all components are properly exported
      expect(ErrorBoundary).toBeDefined();
      expect(SafeComponent).toBeDefined();
      expect(SafeImage).toBeDefined();
      expect(ErrorFallback).toBeDefined();
      expect(NestedErrorBoundary).toBeDefined();
      expect(ErrorRecovery).toBeDefined();
    });
  });

  describe('Error Type Handling', () => {
    function TypeErrorComponent(): React.ReactElement {
      throw new TypeError('Type error test');
    }

    function NetworkErrorComponent(): React.ReactElement {
      throw new Error('Failed to fetch');
    }

    it('handles different error types appropriately', () => {
      render(
        <ErrorBoundary>
          <TypeErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('provides appropriate error messages for network errors', () => {
      render(
        <ErrorFallback 
          error={new Error('Failed to fetch')}
        />
      );

      expect(screen.getByText(/Network connection issue/)).toBeInTheDocument();
    });
  });
});