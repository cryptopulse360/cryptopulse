import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Wrapper component with ThemeProvider
function ThemeToggleWrapper({ defaultTheme = 'system' }: { defaultTheme?: 'light' | 'dark' | 'system' }) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
  });

  it('should render theme toggle button', async () => {
    render(<ThemeToggleWrapper />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('should cycle through themes when clicked', async () => {
    render(<ThemeToggleWrapper defaultTheme="light" />);
    
    const button = screen.getByRole('button');
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });
    
    // Click to go to dark mode
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'Switch to system theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cryptopulse-theme', 'dark');
    });
    
    // Click to go to system mode
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cryptopulse-theme', 'system');
    });
    
    // Click to go back to light mode
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cryptopulse-theme', 'light');
    });
  });

  it('should load saved theme from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(<ThemeToggleWrapper />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to system theme');
    });
  });

  it('should show system theme icon when theme is system', async () => {
    render(<ThemeToggleWrapper defaultTheme="system" />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      // The button should contain the system/computer icon
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('should respect system preference when theme is system', async () => {
    // Mock system preference for dark mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeToggleWrapper defaultTheme="system" />);
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('should have proper accessibility attributes', async () => {
    render(<ThemeToggleWrapper />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('should update document classes when theme changes', async () => {
    render(<ThemeToggleWrapper defaultTheme="light" />);
    
    const button = screen.getByRole('button');
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
    
    fireEvent.click(button); // Switch to dark
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});