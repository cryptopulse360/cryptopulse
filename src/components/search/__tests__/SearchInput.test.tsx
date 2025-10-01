import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../SearchInput';
import { beforeEach } from 'node:test';

describe('SearchInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default placeholder', () => {
    render(<SearchInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search articles...');
    expect(input).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(
      <SearchInput {...defaultProps} placeholder="Custom placeholder" />
    );
    
    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('should display the current value', () => {
    render(<SearchInput {...defaultProps} value="bitcoin" />);
    
    const input = screen.getByDisplayValue('bitcoin');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ethereum' } });
    
    expect(onChange).toHaveBeenCalledWith('ethereum');
  });

  it('should call onSubmit when Enter is pressed', () => {
    const onSubmit = vi.fn();
    render(<SearchInput {...defaultProps} onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should prevent default behavior on Enter', () => {
    const onSubmit = vi.fn();
    render(<SearchInput {...defaultProps} onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    fireEvent.keyDown(input, event);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not call onSubmit for other keys', () => {
    const onSubmit = vi.fn();
    render(<SearchInput {...defaultProps} onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should auto-focus when autoFocus is true', () => {
    render(<SearchInput {...defaultProps} autoFocus />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('should not auto-focus when autoFocus is false', () => {
    render(<SearchInput {...defaultProps} autoFocus={false} />);
    
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveFocus();
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchInput {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Search articles');
  });

  it('should render search icon', () => {
    render(<SearchInput {...defaultProps} />);
    
    const icon = screen.getByRole('textbox').parentElement?.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<SearchInput {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('block', 'w-full', 'pl-10');
  });
});