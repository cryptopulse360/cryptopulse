import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ContactPage from '../page';
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
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock the SEO metadata generation
vi.mock('@/components/seo/SEOHead', () => ({
  generateSEOMetadata: vi.fn(() => ({
    title: 'Contact Us | CryptoPulse',
    description: 'Get in touch with the CryptoPulse team for partnerships, feedback, or general inquiries.',
  })),
}));

// Mock the site config
vi.mock('@/lib/constants', () => ({
  siteConfig: {
    url: 'https://cryptopulse.github.io',
    social: {
      twitter: 'https://twitter.com/cryptopulse',
      github: 'https://github.com/cryptopulse',
      linkedin: 'https://linkedin.com/company/cryptopulse',
    },
  },
}));

describe('ContactPage', () => {
  beforeEach(() => {
    render(<ContactPage />);
  });

  it('renders the contact page', () => {
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
  });

  it('displays contact information', () => {
    expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
    expect(screen.getByText(/hello@cryptopulse.com/i)).toBeInTheDocument();
    expect(screen.getByText(/editorial@cryptopulse.com/i)).toBeInTheDocument();
    expect(screen.getByText(/partnerships@cryptopulse.com/i)).toBeInTheDocument();
    expect(screen.getByText(/legal@cryptopulse.com/i)).toBeInTheDocument();
  });

  it('includes social media links', () => {
    expect(screen.getByText(/follow us/i)).toBeInTheDocument();
    
    const twitterLink = screen.getByRole('link', { name: /@cryptopulse/i });
    const githubLink = screen.getByRole('link', { name: /github.com\/cryptopulse/i });
    const linkedinLink = screen.getByRole('link', { name: /cryptopulse company/i });
    
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/cryptopulse');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/cryptopulse');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/cryptopulse');
    
    // Check external link attributes
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('includes FAQ section', () => {
    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();
    expect(screen.getByText(/how can i contribute content/i)).toBeInTheDocument();
    expect(screen.getByText(/sponsored content or advertisements/i)).toBeInTheDocument();
    expect(screen.getByText(/report an error or request a correction/i)).toBeInTheDocument();
  });

  it('displays response times', () => {
    expect(screen.getByText(/response times/i)).toBeInTheDocument();
    expect(screen.getByText(/1-2 business days/i)).toBeInTheDocument();
    expect(screen.getByText(/5-7 business days/i)).toBeInTheDocument();
  });

  it('includes content guidelines', () => {
    expect(screen.getByText(/content guidelines/i)).toBeInTheDocument();
    expect(screen.getByText(/content must be original/i)).toBeInTheDocument();
    expect(screen.getByText(/well-researched and factually accurate/i)).toBeInTheDocument();
  });

  it('provides technical support information', () => {
    expect(screen.getByText(/technical support/i)).toBeInTheDocument();
    expect(screen.getByText(/clear your browser cache/i)).toBeInTheDocument();
  });

  it('has newsletter subscription link', () => {
    const newsletterLink = screen.getByRole('link', { name: /subscribe to newsletter/i });
    expect(newsletterLink).toHaveAttribute('href', '/newsletter');
  });

  it('has proper heading structure for accessibility', () => {
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });
    const h3s = screen.getAllByRole('heading', { level: 3 });
    
    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(4); // Multiple sections
    expect(h3s.length).toBeGreaterThan(8); // FAQ and contact details
  });

  it('includes links to other pages', () => {
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  it('has proper grid layout for contact information', () => {
    expect(screen.getByText(/general inquiries/i)).toBeInTheDocument();
    expect(screen.getByText(/editorial team/i)).toBeInTheDocument();
    expect(screen.getByText(/partnerships/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy & legal/i)).toBeInTheDocument();
  });

  it('includes stay connected section', () => {
    expect(screen.getByText(/stay connected/i)).toBeInTheDocument();
    expect(screen.getByText(/subscribe to our newsletter/i)).toBeInTheDocument();
  });
});