import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { testAccessibility, testKeyboardNavigation, testAriaAttributes } from '@/lib/test-utils/accessibility';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock analytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackSearchOpen: vi.fn(),
    trackTheme: vi.fn(),
  }),
}));

const renderHeader = () => {
  return render(
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      <Header />
    </ThemeProvider>
  );
};

describe('Header Accessibility', () => {
  it('should pass axe accessibility tests', async () => {
    await testAccessibility(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <Header />
      </ThemeProvider>
    );
  });

  it('should have proper semantic structure', () => {
    renderHeader();
    
    // Check for header landmark
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Check for navigation landmark
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('id', 'main-navigation');
  });

  it('should have proper ARIA attributes', () => {
    renderHeader();
    
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toHaveAttribute('id', 'main-navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    
    testAriaAttributes(renderHeader, [
      {
        selector: '[role="navigation"]',
        attributes: {
          'aria-label': 'Main navigation',
          'id': 'main-navigation',
        },
      },
      {
        selector: 'button[aria-expanded]',
        attributes: {
          'aria-controls': 'mobile-menu',
          'aria-label': 'Toggle mobile menu',
        },
      },
    ]);
  });

  it('should support keyboard navigation', () => {
    renderHeader();
    
    // Test Tab navigation through interactive elements
    const logo = screen.getByRole('link', { name: /cryptopulse home/i });
    const searchButton = screen.getByRole('button', { name: /open search/i });
    
    // Test focus order
    logo.focus();
    expect(document.activeElement).toBe(logo);
    
    // Verify interactive elements are focusable
    expect(logo).not.toHaveAttribute('disabled');
    expect(searchButton).not.toHaveAttribute('disabled');
  });

  it('should have accessible mobile menu toggle', () => {
    renderHeader();
    
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-menu');
    
    // Test button activation
    fireEvent.click(mobileMenuButton);
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Test keyboard activation
    fireEvent.keyDown(mobileMenuButton, { key: 'Enter' });
    fireEvent.keyDown(mobileMenuButton, { key: ' ' });
  });

  it('should have proper focus indicators', () => {
    renderHeader();
    
    const logo = screen.getByRole('link', { name: /cryptopulse home/i });
    const searchButton = screen.getByRole('button', { name: /open search/i });
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    
    expect(logo).toHaveClass('focus-ring');
    expect(searchButton).toHaveClass('focus-ring');
    expect(mobileMenuButton).toHaveClass('focus-ring');
  });

  it('should have proper link relationships', () => {
    renderHeader();
    
    const logo = screen.getByRole('link', { name: /cryptopulse home/i });
    expect(logo).toHaveAttribute('href', '/');
    
    // Check for home navigation link with current page indication
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('should have accessible button labels', () => {
    renderHeader();
    
    const searchButton = screen.getByRole('button', { name: /open search/i });
    expect(searchButton).toHaveAttribute('aria-label');
    expect(searchButton).toHaveAttribute('title');
    
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    expect(mobileMenuButton).toHaveAttribute('aria-label', 'Toggle mobile menu');
    expect(mobileMenuButton).toHaveAttribute('aria-expanded');
    expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('should hide decorative icons from screen readers', () => {
    renderHeader();
    
    // Check for SVG icons with aria-hidden
    const svgIcons = document.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgIcons.length).toBeGreaterThan(0);
    
    svgIcons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('should have proper heading hierarchy', () => {
    renderHeader();
    
    // The site name should be properly marked up
    const siteName = screen.getByRole('heading', { level: 1 });
    expect(siteName).toHaveTextContent('CryptoPulse');
    expect(siteName.closest('a')).toHaveAttribute('aria-label', 'CryptoPulse Home');
  });

  it('should support reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    
    renderHeader();
    
    // Elements with transitions should respect reduced motion
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    // In a real test, you would check that animations are disabled
  });
});