import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import ContactPage from '../page';

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
      x: 'https://x.com/the_cryptopulse',
      pinterest: 'https://pin.it/1cITW7xl0',
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
    expect(screen.getAllByText(/get in touch/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/hello.cryptopulse@outlook.com/i)[0]).toBeInTheDocument();
    expect(screen.getByTestId('support-email')).toHaveTextContent('assistance.cryptopulse@outlook.com');
    expect(screen.getByTestId('business-contact')).toHaveTextContent('business.cryptopulse@outlook.com');
    expect(screen.getByTestId('legal-email')).toHaveTextContent('legal.cryptopulse@outlook.com');
  });

  it('includes social media links', () => {
    expect(screen.getAllByText(/follow us/i)[0]).toBeInTheDocument();
    
    const twitterLink = screen.getByTestId('twitter-link');
    const pinterestLink = screen.getByTestId('pinterest-link');
    
    expect(twitterLink).toHaveAttribute('href', 'https://x.com/the_cryptopulse');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(twitterLink).toHaveAttribute('aria-label', 'Follow us on X (Twitter) @the_cryptopulse');
    
    expect(pinterestLink).toHaveAttribute('href', 'https://pin.it/1cITW7xl0');
    expect(pinterestLink).toHaveAttribute('target', '_blank');
    expect(pinterestLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(pinterestLink).toHaveAttribute('aria-label', 'Follow us on Pinterest @cryptopulse360');
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
    expect(screen.getAllByText(/5-7 business days/i)).toHaveLength(2); // One in FAQ, one in response times
  });

  it('includes content guidelines', () => {
    expect(screen.getByText(/content guidelines/i)).toBeInTheDocument();
    expect(screen.getByText(/content must be original/i)).toBeInTheDocument();
    expect(screen.getByText(/well-researched and factually accurate/i)).toBeInTheDocument();
  });

  it('provides technical support information', () => {
    expect(screen.getByText(/technical support/i)).toBeInTheDocument();
    expect(screen.getByTestId('cache-clearing')).toHaveTextContent(/clearing your browser cache/i);
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
    expect(screen.getByTestId('general-inquiries')).toBeInTheDocument();
    expect(screen.getByTestId('support-contact')).toBeInTheDocument();
    expect(screen.getByTestId('business-contact')).toBeInTheDocument();
    expect(screen.getByTestId('legal-contact')).toBeInTheDocument();
  });

  it('includes stay connected section', () => {
    expect(screen.getByText(/stay connected/i)).toBeInTheDocument();
    expect(screen.getByText(/subscribe to our newsletter/i)).toBeInTheDocument();
  });
});