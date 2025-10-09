import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StructuredData } from '../StructuredData';

describe('StructuredData', () => {
  it('should render JSON-LD script tag', () => {
    const testData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test Article',
    };

    const { container } = render(<StructuredData data={testData} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    
    const scriptContent = script?.textContent;
    expect(scriptContent).toContain('"@context": "https://schema.org"');
    expect(scriptContent).toContain('"@type": "Article"');
    expect(scriptContent).toContain('"headline": "Test Article"');
  });

  it('should handle complex nested data', () => {
    const complexData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
      publisher: {
        '@type': 'Organization',
        name: 'CryptoPulse',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.png',
        },
      },
      keywords: ['crypto', 'bitcoin'],
    };

    const { container } = render(<StructuredData data={complexData} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    const scriptContent = script?.textContent;
    
    expect(scriptContent).toContain('"name": "John Doe"');
    expect(scriptContent).toContain('"name": "CryptoPulse"');
    expect(scriptContent).toContain('"crypto"');
    expect(scriptContent).toContain('"bitcoin"');
  });

  it('should handle empty data object', () => {
    const { container } = render(<StructuredData data={{}} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script?.textContent?.trim()).toBe('{}');
  });

  it('should properly escape special characters', () => {
    const dataWithSpecialChars = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test "Article" with <special> & characters',
      description: 'Description with\nnewlines and\ttabs',
    };

    const { container } = render(<StructuredData data={dataWithSpecialChars} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    const scriptContent = script?.textContent;
    
    // JSON.stringify should properly escape these characters
    expect(scriptContent).toContain('\\"Article\\"');
    expect(scriptContent).toContain('\\n');
    expect(scriptContent).toContain('\\t');
  });
});