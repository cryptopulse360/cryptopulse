import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders the site logo and name', () => {
    render(<Footer />);
    
    expect(screen.getByLabelText('CryptoPulse Home')).toBeInTheDocument();
    expect(screen.getByText('CryptoPulse')).toBeInTheDocument();
  });

  it('renders the site description', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Your trusted source for cryptocurrency news/)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    expect(screen.getByLabelText('Follow us on Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('View our GitHub repository')).toBeInTheDocument();
  });

  it('renders footer navigation sections', () => {
    render(<Footer />);
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  it('renders newsletter signup section', () => {
    render(<Footer />);
    
    expect(screen.getByText('Stay Updated')).toBeInTheDocument();
    expect(screen.getByText(/Get the latest crypto news/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('renders copyright information', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} CryptoPulse. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders privacy policy and disclaimer links', () => {
    render(<Footer />);
    
    expect(screen.getAllByText('Privacy Policy')).toHaveLength(2); // One in footer nav, one in bottom section
    expect(screen.getAllByText('Disclaimer')).toHaveLength(2); // One in footer nav, one in bottom section
  });

  it('has proper external link attributes', () => {
    render(<Footer />);
    
    const twitterLink = screen.getByLabelText('Follow us on Twitter');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    const githubLink = screen.getByLabelText('View our GitHub repository');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});