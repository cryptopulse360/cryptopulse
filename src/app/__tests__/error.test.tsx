import { render, screen, fireEvent } from '@testing-library/react';
import Error from '../error';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('Error Page', () => {
  const mockError = new Error('Test error message');
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error message and controls', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go Home' })).toHaveAttribute('href', '/');
  });

  it('calls reset function when Try Again is clicked', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('hides error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('displays error digest when available', () => {
    const errorWithDigest = Object.assign(mockError, { digest: 'abc123' });
    
    render(<Error error={errorWithDigest} reset={mockReset} />);
    
    expect(screen.getByText('Error ID: abc123')).toBeInTheDocument();
  });

  it('logs error in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Mock window object
    Object.defineProperty(window, 'location', {
      value: { href: 'https://example.com' },
      writable: true,
    });

    render(<Error error={mockError} reset={mockReset} />);

    expect(fetch).toHaveBeenCalledWith('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('Test error message'),
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('handles logging errors gracefully', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Mock fetch to throw an error
    (fetch as jest.Mock).mockRejectedValue(new Error('Logging failed'));

    render(<Error error={mockError} reset={mockReset} />);

    // Should still render error UI even if logging fails
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('has proper accessibility structure', () => {
    render(<Error error={mockError} reset={mockReset} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Oops! Something went wrong');
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go Home' })).toBeInTheDocument();
  });
});