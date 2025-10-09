/**
 * Newsletter subscription utilities and MailerLite integration
 */

import { siteConfig } from './constants';

export interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  requiresConfirmation?: boolean;
}

/**
 * Validates email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();

  // Basic regex check
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }

  // Additional checks for edge cases
  if (trimmedEmail.includes('..')) {
    return false;
  }

  return true;
}

/**
 * Validates newsletter subscription data
 */
export function validateSubscription(data: NewsletterSubscription): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.email) {
    errors.push('Email address is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (data.firstName && data.firstName.length > 50) {
    errors.push('First name must be less than 50 characters');
  }

  if (data.lastName && data.lastName.length > 50) {
    errors.push('Last name must be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Subscribes user to newsletter via our API route (which calls MailerLite)
 */
export async function subscribeToNewsletter(
  data: NewsletterSubscription
): Promise<NewsletterResponse> {
  // Validate input data
  const validation = validateSubscription(data);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.errors[0],
    };
  }

  try {
    // Submit to our API route
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email.trim(),
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message,
        requiresConfirmation: false,
      };
    } else {
      return {
        success: false,
        message: result.message || 'Something went wrong. Please try again later.',
      };
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}

/**
 * Alternative method using MailerLite embedded form (client-side only)
 * This is useful if you want to use MailerLite's embedded forms instead of API
 */
export async function subscribeViaEmbeddedForm(
  data: NewsletterSubscription,
  formUrl: string
): Promise<NewsletterResponse> {
  // Validate input data
  const validation = validateSubscription(data);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.errors[0],
    };
  }

  try {
    // Prepare form data for MailerLite embedded form
    const formData = new FormData();
    formData.append('fields[email]', data.email.trim());

    if (data.firstName) {
      formData.append('fields[name]', data.firstName.trim());
    }

    if (data.lastName) {
      formData.append('fields[last_name]', data.lastName.trim());
    }

    // Submit to MailerLite embedded form
    const response = await fetch(formUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Required for embedded forms
    });

    // Since we're using no-cors mode, we can't read the response
    return {
      success: true,
      message: 'Thank you for subscribing! Please check your email to confirm your subscription.',
      requiresConfirmation: true,
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}

/**
 * Tracks newsletter subscription events for analytics
 */
export function trackNewsletterSubscription(email: string): void {
  // Track with Plausible if available
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('Newsletter Subscription', {
      props: {
        email_domain: email.split('@')[1] || 'unknown',
        provider: 'mailerlite',
      },
    });
  }

  // Track with Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'newsletter_subscription', {
      event_category: 'engagement',
      event_label: 'newsletter',
      custom_parameters: {
        provider: 'mailerlite',
      },
    });
  }
}

/**
 * Gets GDPR-compliant privacy notice text
 */
export function getPrivacyNotice(): string {
  return 'By subscribing, you agree to receive our newsletter and marketing communications. You can unsubscribe at any time. We respect your privacy and will never share your email address with third parties. See our Privacy Policy for more details.';
}

/**
 * Gets newsletter subscription benefits text
 */
export function getSubscriptionBenefits(): string[] {
  return [
    'Weekly crypto market analysis and insights',
    'Breaking news alerts for major market movements',
    'Exclusive content and early access to new articles',
    'Educational resources for crypto investors',
    'No spam, unsubscribe anytime',
  ];
}

/**
 * Unsubscribes user from newsletter (requires server-side implementation)
 */
export async function unsubscribeFromNewsletter(email: string): Promise<NewsletterResponse> {
  if (!siteConfig.newsletter.mailerliteApiKey) {
    return {
      success: false,
      message: 'Unsubscribe service is currently unavailable.',
    };
  }

  try {
    // First, find the subscriber
    const searchResponse = await fetch(`https://connect.mailerlite.com/api/subscribers?filter[email]=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${siteConfig.newsletter.mailerliteApiKey}`,
        'Accept': 'application/json',
      },
    });

    const searchResult = await searchResponse.json();

    if (!searchResponse.ok || !searchResult.data || searchResult.data.length === 0) {
      return {
        success: false,
        message: 'Email address not found in our newsletter list.',
      };
    }

    const subscriberId = searchResult.data[0].id;

    // Delete the subscriber
    const deleteResponse = await fetch(`https://connect.mailerlite.com/api/subscribers/${subscriberId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${siteConfig.newsletter.mailerliteApiKey}`,
        'Accept': 'application/json',
      },
    });

    if (deleteResponse.ok) {
      return {
        success: true,
        message: 'You have been successfully unsubscribed from our newsletter.',
      };
    } else {
      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again later.',
      };
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}