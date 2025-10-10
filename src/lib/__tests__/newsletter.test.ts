import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';
import { 
  validateEmail, 
  validateSubscription, 
  subscribeToNewsletter,
  trackNewsletterSubscription,
  getPrivacyNotice,
  getSubscriptionBenefits
} from '../newsletter';
import { vi } from 'vitest';

// Mock the constants
vi.mock('../constants', () => ({
  siteConfig: {
    newsletter: {
      mailchimpUrl: 'https://example.us1.list-manage.com/subscribe/post?u=123&id=456',
    },
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('Newsletter Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window object
    delete (window as any).plausible;
    delete (window as any).gtag;
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('user123@test-domain.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test..test@example.com')).toBe(false);
    });

    it('handles whitespace correctly', () => {
      expect(validateEmail('  test@example.com  ')).toBe(true);
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });

  describe('validateSubscription', () => {
    it('validates correct subscription data', () => {
      const result = validateSubscription({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('requires email address', () => {
      const result = validateSubscription({
        email: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email address is required');
    });

    it('validates email format', () => {
      const result = validateSubscription({
        email: 'invalid-email',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid email address');
    });

    it('validates name length limits', () => {
      const longName = 'a'.repeat(51);
      const result = validateSubscription({
        email: 'test@example.com',
        firstName: longName,
        lastName: longName,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('First name must be less than 50 characters');
      expect(result.errors).toContain('Last name must be less than 50 characters');
    });

    it('allows optional fields to be empty', () => {
      const result = validateSubscription({
        email: 'test@example.com',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('subscribeToNewsletter', () => {
    it('successfully subscribes with valid data', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          message: 'Thank you for subscribing! Please check your email to confirm your subscription.',
        }),
      });

      const result = await subscribeToNewsletter({
        email: 'test@example.com',
        firstName: 'John',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('Thank you for subscribing');
      expect(result.requiresConfirmation).toBe(false);
    });

    it('handles validation errors', async () => {
      const result = await subscribeToNewsletter({
        email: 'invalid-email',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('valid email address');
    });



    it('handles network errors', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await subscribeToNewsletter({
        email: 'test@example.com',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('try again later');
    });

    it('sends correct form data to API route', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          message: 'Subscribed successfully',
        }),
      });

      await subscribeToNewsletter({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/newsletter/subscribe',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
          }),
        })
      );
    });
  });

  describe('trackNewsletterSubscription', () => {
    it('tracks with Plausible when available', () => {
      const mockPlausible = vi.fn();
      (window as any).plausible = mockPlausible;

      trackNewsletterSubscription('test@example.com');

      expect(mockPlausible).toHaveBeenCalledWith('Newsletter Subscription', {
        props: {
          email_domain: 'example.com',
          provider: 'mailerlite',
        },
      });
    });

    it('tracks with Google Analytics when available', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackNewsletterSubscription('test@example.com');

      expect(mockGtag).toHaveBeenCalledWith('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: 'newsletter',
        custom_parameters: {
          provider: 'mailerlite',
        },
      });
    });

    it('handles missing email domain gracefully', () => {
      const mockPlausible = vi.fn();
      (window as any).plausible = mockPlausible;

      trackNewsletterSubscription('invalid-email');

      expect(mockPlausible).toHaveBeenCalledWith('Newsletter Subscription', {
        props: {
          email_domain: 'unknown',
          provider: 'mailerlite',
        },
      });
    });

    it('does nothing when analytics are not available', () => {
      // Should not throw any errors
      expect(() => trackNewsletterSubscription('test@example.com')).not.toThrow();
    });
  });

  describe('getPrivacyNotice', () => {
    it('returns GDPR-compliant privacy notice', () => {
      const notice = getPrivacyNotice();
      
      expect(notice).toContain('agree to receive');
      expect(notice).toContain('unsubscribe');
      expect(notice).toContain('privacy');
      expect(notice).toContain('never share');
      expect(notice).toContain('Privacy Policy');
    });
  });

  describe('getSubscriptionBenefits', () => {
    it('returns array of subscription benefits', () => {
      const benefits = getSubscriptionBenefits();
      
      expect(Array.isArray(benefits)).toBe(true);
      expect(benefits.length).toBeGreaterThan(0);
      expect(benefits.every(benefit => typeof benefit === 'string')).toBe(true);
      expect(benefits.some(benefit => benefit.includes('crypto'))).toBe(true);
      expect(benefits.some(benefit => benefit.includes('unsubscribe'))).toBe(true);
    });
  });
});