import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { OptimizedImage } from '../OptimizedImage';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onLoad, onError, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      {...props}
      onLoad={() => onLoad && onLoad()}
      onError={() => onError && onError()}
    />
  ),
}));

describe('OptimizedImage', () => {
  it('renders image with correct props', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('shows loading state initially', () => {
    const { container } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('animate-pulse');
  });

  it('removes loading state after image loads', async () => {
    const { container } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByAltText('Test image');
    fireEvent.load(image);

    await waitFor(() => {
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass('animate-pulse');
    });
  });

  it('shows error state when image fails to load', async () => {
    render(
      <OptimizedImage
        src="/invalid-image.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByAltText('Test image');
    fireEvent.error(image);

    await waitFor(() => {
      expect(screen.getByText('Image not available')).toBeInTheDocument();
    });
  });

  it('applies priority loading for above-the-fold images', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        priority={true}
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('applies lazy loading for below-the-fold images', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        priority={false}
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('applies custom className', () => {
    const { container } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={400}
        height={300}
        className="custom-class"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('custom-class');
  });
});