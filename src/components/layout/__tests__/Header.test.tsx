import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Header from '../Header';
import { vi } from 'vitest';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { afterEach } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;

describe('Header', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the site logo and name', () => {
    render(<Header />);
    
    expect(screen.getByLabelText('CryptoPulse Home')).toBeInTheDocument();
    expect(screen.getByText('CryptoPulse')).toBeInTheDocument();
    
    const logo = screen.getByAltText('CryptoPulse Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/logo.PNG');
    
    // Verify tagline is not present
    expect(screen.queryByText('Your trusted source for cryptocurrency news')).not.toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Newsletter')).toBeInTheDocument();
    expect(screen.getByText('Authors')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights the current page in navigation', () => {
    mockUsePathname.mockReturnValue('/articles');
    render(<Header />);
    
    const articlesLink = screen.getByText('Articles');
    expect(articlesLink).toHaveClass('text-blue-600');
    expect(articlesLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders theme toggle and search toggle', () => {
    render(<Header />);
    
    expect(screen.getByLabelText(/Switch to .* mode/)).toBeInTheDocument();
    expect(screen.getByLabelText('Open search')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Initially closed
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(mobileMenuButton);
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to close
    fireEvent.click(mobileMenuButton);
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);
    
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-menu');
  });
});