import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('@/components/layout/SearchToggle', () => {
  return {
    SearchToggle: () => <button>Search</button>,
  };
});

describe('NotFound Page', () => {
  it('renders 404 error message', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/The page you're looking for doesn't exist/)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<NotFound />);
    
    expect(screen.getByRole('link', { name: 'Go Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Browse Articles' })).toHaveAttribute('href', '/articles');
  });

  it('renders search toggle', () => {
    render(<NotFound />);
    
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders popular sections links', () => {
    render(<NotFound />);
    
    expect(screen.getByText('Popular Sections')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bitcoin News' })).toHaveAttribute('href', '/tags/bitcoin');
    expect(screen.getByRole('link', { name: 'Ethereum Updates' })).toHaveAttribute('href', '/tags/ethereum');
    expect(screen.getByRole('link', { name: 'DeFi Analysis' })).toHaveAttribute('href', '/tags/defi');
    expect(screen.getByRole('link', { name: 'Market Analysis' })).toHaveAttribute('href', '/tags/market-analysis');
  });

  it('has proper accessibility structure', () => {
    render(<NotFound />);
    
    // Check heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Page Not Found');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Popular Sections');
  });

  it('applies proper styling classes', () => {
    const { container } = render(<NotFound />);
    
    // Check main container has proper classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
  });
});