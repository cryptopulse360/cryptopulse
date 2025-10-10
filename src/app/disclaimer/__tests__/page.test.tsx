import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import DisclaimerPage from '../page';

// Mock the SEO metadata generation
vi.mock('@/components/seo/SEOHead', () => ({
  generateSEOMetadata: vi.fn(() => ({
    title: 'Disclaimer | CryptoPulse',
    description: 'Important disclaimers regarding cryptocurrency content, investment advice, and risk warnings.',
  })),
}));

describe('DisclaimerPage', () => {
  beforeEach(() => {
    render(<DisclaimerPage />);
  });

  it('renders the disclaimer page', () => {
    expect(screen.getByRole('heading', { name: /disclaimer/i })).toBeInTheDocument();
  });

  it('displays the last updated date', () => {
    expect(screen.getAllByText(/Last updated: October 10, 2025/i)[0]).toBeInTheDocument();
  });

  it('includes prominent risk warning', () => {
    expect(screen.getAllByText(/⚠️ important risk warning/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/highly volatile and risky/i)).toBeInTheDocument();
    expect(screen.getByText(/never invest more than you can afford to lose/i)).toBeInTheDocument();
  });

  it('clearly states not financial advice', () => {
    expect(screen.getByText(/not financial advice/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing on this website constitutes financial or investment advice/i)).toBeInTheDocument();
  });

  it('lists cryptocurrency risks', () => {
    expect(screen.getByText(/cryptocurrency risks/i)).toBeInTheDocument();
    expect(screen.getByText(/volatility/i)).toBeInTheDocument();
    expect(screen.getByText(/regulatory risk/i)).toBeInTheDocument();
    expect(screen.getByText(/technology risk/i)).toBeInTheDocument();
  });

  it('includes DYOR (Do Your Own Research) guidance', () => {
    expect(screen.getByText(/always conduct your own research/i)).toBeInTheDocument();
    expect(screen.getByText(/dyor \(do your own research\)/i)).toBeInTheDocument();
  });

  it('mentions no guarantees', () => {
    expect(screen.getByText(/no guarantees/i)).toBeInTheDocument();
    expect(screen.getByText(/accuracy or completeness of information/i)).toBeInTheDocument();
  });

  it('covers third-party content', () => {
    expect(screen.getByText(/third-party content and links/i)).toBeInTheDocument();
    expect(screen.getByText(/do not endorse or recommend/i)).toBeInTheDocument();
  });

  it('addresses affiliate relationships', () => {
    expect(screen.getByText(/affiliate relationships/i)).toBeInTheDocument();
    expect(screen.getByText(/clearly disclose these relationships/i)).toBeInTheDocument();
  });

  it('includes limitation of liability', () => {
    expect(screen.getByText(/limitation of liability/i)).toBeInTheDocument();
    expect(screen.getByText(/shall not be liable/i)).toBeInTheDocument();
  });

  it('covers regulatory compliance', () => {
    expect(screen.getByText(/regulatory compliance/i)).toBeInTheDocument();
    expect(screen.getByText(/understand the laws in your jurisdiction/i)).toBeInTheDocument();
  });

  it('addresses market data accuracy', () => {
    expect(screen.getByText(/market data and pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/may be delayed or inaccurate/i)).toBeInTheDocument();
  });

  it('provides contact information', () => {
    expect(screen.getByText(/contact information/i)).toBeInTheDocument();
    expect(screen.getByText(/legal@cryptopulse.com/i)).toBeInTheDocument();
  });

  it('has proper heading structure for accessibility', () => {
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2s = screen.getAllByRole('heading', { level: 2 });
    
    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(8); // Multiple sections
  });

  it('includes content update policy', () => {
    expect(screen.getByText(/content updates/i)).toBeInTheDocument();
    expect(screen.getByText(/information may become outdated quickly/i)).toBeInTheDocument();
  });
});