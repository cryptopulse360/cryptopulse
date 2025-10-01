import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import PrivacyPolicyPage from '../page';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock the SEO metadata generation
vi.mock('@/components/seo/SEOHead', () => ({
  generateSEOMetadata: vi.fn(() => ({
    title: 'Privacy Policy | CryptoPulse',
    description: 'Learn how CryptoPulse collects, uses, and protects your personal information.',
  })),
}));

describe('PrivacyPolicyPage', () => {
  beforeEach(() => {
    render(<PrivacyPolicyPage />);
  });

  it('renders the privacy policy page', () => {
    expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument();
  });

  it('displays the last updated date', () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    expect(screen.getByText(`Last updated: ${currentDate}`)).toBeInTheDocument();
  });

  it('includes GDPR compliance information', () => {
    expect(screen.getByText(/your rights \(gdpr\)/i)).toBeInTheDocument();
    expect(screen.getByText(/right to access/i)).toBeInTheDocument();
    expect(screen.getByText(/right to erasure/i)).toBeInTheDocument();
  });

  it('mentions privacy-friendly analytics', () => {
    expect(screen.getByText(/privacy-friendly analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/plausible analytics/i)).toBeInTheDocument();
  });

  it('includes newsletter information', () => {
    expect(screen.getByText(/newsletter and email communications/i)).toBeInTheDocument();
    expect(screen.getByText(/mailchimp/i)).toBeInTheDocument();
    expect(screen.getByText(/double opt-in/i)).toBeInTheDocument();
  });

  it('provides contact information', () => {
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy@cryptopulse.com/i)).toBeInTheDocument();
  });

  it('has proper heading structure for accessibility', () => {
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });
    
    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(5); // Multiple sections
  });

  it('includes data security information', () => {
    expect(screen.getByText(/data security/i)).toBeInTheDocument();
    expect(screen.getByText(/https encryption/i)).toBeInTheDocument();
  });

  it('mentions cookies policy', () => {
    expect(screen.getByText(/cookies/i)).toBeInTheDocument();
    expect(screen.getByText(/no tracking cookies/i)).toBeInTheDocument();
  });

  it('includes children privacy section', () => {
    expect(screen.getByText(/children's privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/under 13 years/i)).toBeInTheDocument();
  });

  it('has a summary section', () => {
    expect(screen.getByText(/summary/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy-friendly analytics/i)).toBeInTheDocument();
  });
});