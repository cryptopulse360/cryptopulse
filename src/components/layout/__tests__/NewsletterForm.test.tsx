import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { NewsletterForm } from '../NewsletterForm';
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
import { it } from 'node:test';
import { it } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock the newsletter service
vi.mock('@/lib/newsletter', () => ({
  subscribeToNewsletter: vi.fn(),
  trackNewsletterSubscription: vi.fn(),
  getPrivacyNotice: vi.fn(() => 'Mock privacy notice'),
}));

describe('NewsletterForm', () => {
  // Get the mocked functions after the mock is set up
  const { subscribeToNewsletter, trackNewsletterSubscription, getPrivacyNotice } = await import('@/lib/newsletter');
  const mockSubscribeToNewsletter = vi.mocked(subscribeToNewsletter);
  const mockTrackNewsletterSubscription = vi.mocked(trackNewsletterSubscription);
  const mockGetPrivacyNotice = vi.mocked(getPrivacyNotice);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email input and subscribe button', () => {
    render(<NewsletterForm />);
    
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe to newsletter/i })).toBeInTheDocument();
  });

  it('renders optional first name input', () => {
    render(<NewsletterForm />);
    
    expect(screen.getByLabelText('First name (optional)')).toBeInTheDocument();
  });

  it('renders GDPR consent checkbox', () => {
    render(<NewsletterForm />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('required');
  });

  it('renders privacy policy link', () => {
    render(<NewsletterForm />);
    
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  it('shows error when consent is not given', async () => {
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const form = screen.getByTestId('newsletter-form');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Please agree to our privacy policy to continue.')).toBeInTheDocument();
    });
  });

  it('shows error for empty email', async () => {
    render(<NewsletterForm />);
    
    const checkbox = screen.getByRole('checkbox');
    const form = screen.getByTestId('newsletter-form');
    
    fireEvent.click(checkbox);
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
    });
  });

  it('successfully submits with valid data', async () => {
    mockSubscribeToNewsletter.mockResolvedValueOnce({
      success: true,
      message: 'Thank you for subscribing!',
    });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const firstNameInput = screen.getByPlaceholderText('First name (optional)');
    const checkbox = screen.getByRole('checkbox');
    const form = screen.getByTestId('newsletter-form');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.click(checkbox);
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockSubscribeToNewsletter).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'John',
        tags: ['website-signup'],
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });
  });

  it('handles subscription errors', async () => {
    mockSubscribeToNewsletter.mockResolvedValueOnce({
      success: false,
      message: 'Subscription failed',
    });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const checkbox = screen.getByRole('checkbox');
    const form = screen.getByTestId('newsletter-form');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(checkbox);
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Subscription failed')).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    mockSubscribeToNewsletter.mockResolvedValueOnce({
      success: true,
      message: 'Thank you for subscribing!',
    });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
    const firstNameInput = screen.getByPlaceholderText('First name (optional)') as HTMLInputElement;
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    const form = screen.getByTestId('newsletter-form');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.click(checkbox);
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(firstNameInput.value).toBe('');
      expect(checkbox.checked).toBe(false);
    });
  });

  it('disables form during submission', async () => {
    mockSubscribeToNewsletter.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Success' }), 100))
    );

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: /subscribe to newsletter/i });
    const checkbox = screen.getByRole('checkbox');
    const form = screen.getByTestId('newsletter-form');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(checkbox);
    fireEvent.submit(form);
    
    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(screen.getByText('Subscribing...')).toBeInTheDocument();
  });

  it('shows subscription benefits when enabled', () => {
    render(<NewsletterForm showBenefits={true} />);
    
    expect(screen.getByText("What you'll get:")).toBeInTheDocument();
    expect(screen.getByText(/weekly crypto market analysis/i)).toBeInTheDocument();
  });

  it('shows extended privacy notice when enabled', () => {
    render(<NewsletterForm showExtendedPrivacy={true} />);
    
    expect(screen.getByText('Mock privacy notice')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<NewsletterForm />);
    
    const emailInput = screen.getByLabelText('Email address');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');

    const firstNameInput = screen.getByLabelText('First name (optional)');
    expect(firstNameInput).toHaveAttribute('maxLength', '50');
  });

  it('applies custom className', () => {
    const { container } = render(<NewsletterForm className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});