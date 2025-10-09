import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { SafeComponent } from '../SafeComponent';
import { SafeImage } from '../SafeImage';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onError={onError}
        {...props}
      />
    );
  };
});

// Mock fetch for error logging
global.fetch = jest.fn();

describe('Error Handling Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Nested Error Boundaries', () => {
    function OuterComponent() {
      return (
        <ErrorBoundary>
          <div>Outer Component</div>
          <SafeComponent>
            <InnerComponent />
          </SafeComponent>
        </ErrorBoundary>
      );
    }

    function InnerComponent() {
      throw new Error('Inner component error');
    }

    it('handles nested component errors gracefully', () => {
      render(<OuterComponent />);
      
      // Outer component should still render
      expect(screen.getByText('Outer Component')).toBeInTheDocument();
      
      // Inner component error should be caught by SafeComponent
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Image Error Handling', () => {
    it('shows fallback when image fails to load', () => {
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
      
      // Simulate image load error
      fireEvent.error(img);
      
      // Should switch to fallback
      expect(img).toHaveAttribute('src', 'fallback.jpg');
    });

    it('shows placeholder when both original and fallback fail', () => {
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
      
      // Rerender to simulate fallback also failing
      rerender(
        <SafeImage
          src="broken-image.jpg"
          alt="Test image"
          fallbackSrc="also-broken.jpg"
          width={100}
          height={100}
        />
      );
      
      // Second error - should show placeholder
      fireEvent.error(img);
      
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    function RecoverableComponent({ shouldThrow }: { shouldThrow: boolean }) {
      if (shouldThrow) {
        throw new Error('Recoverable error');
      }
      return <div>Component recovered</div>;
    }

    it('allows error recovery through retry', () => {
      let shouldThrow = true;
      
      const { rerender } = render(
        <ErrorBoundary>
          <RecoverableComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      // Should show error UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // Fix the error condition
      shouldThrow = false;
      
      // Click retry
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
      
      // Rerender with fixed condition
      rerender(
        <ErrorBoundary>
          <RecoverableComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
      
      // Should show recovered component
      expect(screen.getByText('Component recovered')).toBeInTheDocument();
    });
  });

  describe('Multiple Error Types', () => {
    function MultiErrorComponent({ errorType }: { errorType: string }) {
      switch (errorType) {
        case 'render':
          throw new Error('Render error');
        case 'network':
          throw new TypeError('Failed to fetch');
        case 'validation':
          throw new Error('Validation failed');
        default:
          return <div>No error</div>;
      }
    }

    it('handles different error types appropriately', () => {
      // Test render error
      render(
        <ErrorBoundary>
          <MultiErrorComponent errorType="render" />
        </ErrorBoundary>
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Error Logging Integration', () => {
    it('logs errors in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      Object.defineProperty(window, 'location', {
        value: { href: 'https://example.com/test' },
        writable: true,
      });

      function ErrorComponent() {
        throw new Error('Production error');
      }

      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(fetch).toHaveBeenCalledWith('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('Production error'),
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Accessibility in Error States', () => {
    function AccessibleErrorComponent() {
      throw new Error('Accessibility test error');
    }

    it('maintains accessibility in error states', () => {
      render(
        <ErrorBoundary>
          <AccessibleErrorComponent />
        </ErrorBoundary>
      );

      // Should have proper heading structure
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Something went wrong');
      
      // Should have actionable buttons
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go Home' })).toBeInTheDocument();
      
      // Should have descriptive text
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    });
  });
});