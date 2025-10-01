import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { NewsletterSignupPage } from '../NewsletterSignupPage';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';

// Mock the newsletter service
vi.mock('@/lib/newsletter', () => ({
  subscribeToNewsletter: vi.fn(),
  trackNewsletterSubscription: vi.fn(),
  getPrivacyNotice: vi.fn(() => 'Mock privacy notice'),
  getSubscriptionBenefits: vi.fn(() => [
    'Weekly crypto market analysis',
    'Breaking news alerts',
    'Exclusive content',
    'Educational resources',
    'No spam, unsubscribe anytime',
  ]),
}));

describe('NewsletterSignupPage', () => {
  it('renders the main heading', () => {
    render(<NewsletterSignupPage />);
    
    expect(screen.getByText('Stay Ahead of the Crypto Curve')).toBeInTheDocument();
  });

  it('renders subscription benefits', () => {
    render(<NewsletterSignupPage />);
    
    expect(screen.getByText('What You\'ll Get')).toBeInTheDocument();
    expect(screen.getByText(/weekly crypto market analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/breaking news alerts/i)).toBeInTheDocument();
  });

  it('renders the newsletter form', () => {
    render(<NewsletterSignupPage />);
    
    expect(screen.getByText('Start Your Free Subscription')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('renders social proof section', () => {
    render(<NewsletterSignupPage />);
    
    expect(screen.getByText('Join 10,000+ subscribers')).toBeInTheDocument();
    expect(screen.getByText(/trusted by crypto enthusiasts/i)).toBeInTheDocument();
  });

  it('renders trust indicators', () => {
    render(<NewsletterSignupPage />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('GDPR Compliant')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Spam Emails')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<NewsletterSignupPage />);
    
    const privacyLinks = screen.getAllByRole('link', { name: /privacy policy/i });
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(privacyLinks[0]).toHaveAttribute('href', '/privacy');
    
    const articlesLink = screen.getByRole('link', { name: /browse articles/i });
    expect(articlesLink).toHaveAttribute('href', '/articles');
    
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders security indicators', () => {
    render(<NewsletterSignupPage />);
    
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('No Spam')).toBeInTheDocument();
    expect(screen.getByText('Unsubscribe Anytime')).toBeInTheDocument();
  });
});