'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { subscribeToNewsletter, trackNewsletterSubscription, getPrivacyNotice } from '@/lib/newsletter';
import { useAnalytics } from '@/hooks/useAnalytics';

interface NewsletterFormProps {
  /** Show extended privacy notice */
  showExtendedPrivacy?: boolean;
  /** Show subscription benefits */
  showBenefits?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function NewsletterForm({ 
  showExtendedPrivacy = false, 
  showBenefits = false,
  className = ''
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { trackNewsletterAttempt, trackNewsletterComplete } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!consent) {
      setStatus('error');
      setMessage('Please agree to our privacy policy to continue.');
      return;
    }

    setStatus('loading');
    setMessage('');

    // Track newsletter signup attempt
    trackNewsletterAttempt('footer');

    try {
      const result = await subscribeToNewsletter({
        email: email.trim(),
        firstName: firstName.trim() || undefined,
        tags: ['website-signup'],
      });

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
        setFirstName('');
        setConsent(false);
        
        // Track successful subscription
        trackNewsletterSubscription(email);
        trackNewsletterComplete('footer');
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className={className}>
      {showBenefits && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            What you'll receive:
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Weekly cryptocurrency updates</li>
            <li>• News and developments</li>
            <li>• Content and resources</li>
            <li>• Educational materials</li>
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3" data-testid="newsletter-form">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={status === 'loading'}
              required
              aria-describedby="email-error"
            />
          </div>
          
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="newsletter-firstname" className="sr-only">
              First name (optional)
            </label>
            <input
              id="newsletter-firstname"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={status === 'loading'}
              maxLength={50}
            />
          </div>
        </div>

        {/* GDPR Consent Checkbox */}
        <div className="flex items-start space-x-2">
          <input
            id="newsletter-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            disabled={status === 'loading'}
            required
          />
          <label htmlFor="newsletter-consent" className="text-xs text-gray-600 dark:text-gray-400">
            I agree to receive cryptocurrency updates and have reviewed the{' '}
            <Link 
              href="/privacy" 
              className="no-underline text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            . Unsubscribe anytime.
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !consent}
          className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>
        
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
            role={status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            id="email-error"
          >
            {message}
          </div>
        )}

        {showExtendedPrivacy && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getPrivacyNotice()}
            </p>
          </div>
        )}

        {!showExtendedPrivacy && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We respect your privacy and will never spam you.
          </p>
        )}
      </form>
    </div>
  );
}
