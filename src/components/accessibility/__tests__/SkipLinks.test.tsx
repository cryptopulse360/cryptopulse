import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipLinks } from '../SkipLinks';

describe('SkipLinks', () => {
  it('should render skip links with proper accessibility attributes', () => {
    render(<SkipLinks />);
    
    const mainContentLink = screen.getByRole('link', { name: /skip to main content/i });
    const navigationLink = screen.getByRole('link', { name: /skip to navigation/i });
    const searchLink = screen.getByRole('link', { name: /skip to search/i });
    
    expect(mainContentLink).toBeInTheDocument();
    expect(navigationLink).toBeInTheDocument();
    expect(searchLink).toBeInTheDocument();
    
    expect(mainContentLink).toHaveAttribute('href', '#main-content');
    expect(navigationLink).toHaveAttribute('href', '#main-navigation');
    expect(searchLink).toHaveAttribute('href', '#search');
  });

  it('should have proper CSS classes for screen reader visibility', () => {
    const { container } = render(<SkipLinks />);
    
    const skipLinksContainer = container.firstChild as HTMLElement;
    expect(skipLinksContainer).toHaveClass('sr-only', 'focus-within:not-sr-only');
  });

  it('should have proper focus styles', () => {
    render(<SkipLinks />);
    
    const links = screen.getAllByRole('link');
    
    links.forEach(link => {
      expect(link).toHaveClass('focus:outline-none');
      expect(link).toHaveClass('focus:ring-2');
      expect(link).toHaveClass('focus:ring-blue-500');
    });
  });

  it('should be positioned absolutely for proper skip link behavior', () => {
    render(<SkipLinks />);
    
    const links = screen.getAllByRole('link');
    
    links.forEach(link => {
      expect(link).toHaveClass('absolute');
      expect(link).toHaveClass('transform');
      expect(link).toHaveClass('-translate-y-full');
      expect(link).toHaveClass('focus:translate-y-0');
    });
  });
});