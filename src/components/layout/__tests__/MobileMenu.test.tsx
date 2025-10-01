import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenu } from '../MobileMenu';
import { vi } from 'vitest';

describe('MobileMenu', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    pathname: '/',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<MobileMenu {...defaultProps} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<MobileMenu {...defaultProps} isOpen={true} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile navigation menu')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<MobileMenu {...defaultProps} isOpen={true} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(<MobileMenu {...defaultProps} isOpen={true} pathname="/articles" />);
    
    const articlesLink = screen.getByText('Articles');
    expect(articlesLink).toHaveClass('text-blue-600');
    expect(articlesLink).toHaveAttribute('aria-current', 'page');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);
    
    const backdrop = screen.getByRole('dialog').previousElementSibling;
    fireEvent.click(backdrop!);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when navigation item is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);
    
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when escape key is pressed', () => {
    const onClose = vi.fn();
    render(<MobileMenu {...defaultProps} isOpen={true} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<MobileMenu {...defaultProps} isOpen={true} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Mobile navigation menu');
    expect(dialog).toHaveAttribute('id', 'mobile-menu');
  });
});