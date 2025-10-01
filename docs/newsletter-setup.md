# Newsletter Subscription System

This document describes how to set up and configure the newsletter subscription system using MailerLite.

## Overview

The newsletter system provides:
- GDPR-compliant email subscription
- MailerLite integration for email management
- Privacy-friendly analytics tracking
- Comprehensive error handling and validation
- Responsive design with accessibility features

## Configuration

### Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# MailerLite API Configuration (keep these secure - use server-side only)
MAILERLITE_API_KEY=your_mailerlite_api_key
MAILERLITE_GROUP_ID=your_mailerlite_group_id_optional
```

**Important**: These are server-side environment variables (without `NEXT_PUBLIC_` prefix) to keep your API key secure.

### Getting Your MailerLite Credentials

1. **API Key**:
   - Log in to your MailerLite account
   - Go to Integrations → Developer API
   - Generate a new API token
   - Copy the token and use it as `MAILERLITE_API_KEY`

2. **Group ID** (Optional):
   - Go to Subscribers → Groups
   - Create a new group or select an existing one
   - The Group ID can be found in the URL or group settings
   - Use this as `MAILERLITE_GROUP_ID`

## Components

### NewsletterForm

The main subscription form component with the following features:
- Email validation
- Optional first name field
- GDPR consent checkbox
- Loading states and error handling
- Configurable display options

```tsx
import { NewsletterForm } from '@/components/layout/NewsletterForm';

// Basic usage
<NewsletterForm />

// With additional features
<NewsletterForm 
  showBenefits={true}
  showExtendedPrivacy={true}
  className="custom-styles"
/>
```

### NewsletterSignupPage

A dedicated landing page for newsletter subscriptions:
- Comprehensive benefits list
- Social proof elements
- Trust indicators
- Enhanced form with extended privacy notice

```tsx
import { NewsletterSignupPage } from '@/components/newsletter/NewsletterSignupPage';

// Used in /newsletter page
<NewsletterSignupPage />
```

## API Functions

### subscribeToNewsletter

Main subscription function that handles MailerLite integration via API route:

```typescript
import { subscribeToNewsletter } from '@/lib/newsletter';

const result = await subscribeToNewsletter({
  email: 'user@example.com',
  firstName: 'John', // optional
  lastName: 'Doe',   // optional
  tags: ['website-signup'], // optional
});

if (result.success) {
  console.log('Subscription successful:', result.message);
} else {
  console.error('Subscription failed:', result.message);
}
```

### Validation Functions

```typescript
import { validateEmail, validateSubscription } from '@/lib/newsletter';

// Validate email format
const isValid = validateEmail('user@example.com');

// Validate complete subscription data
const validation = validateSubscription({
  email: 'user@example.com',
  firstName: 'John',
});

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

### Analytics Tracking

```typescript
import { trackNewsletterSubscription } from '@/lib/newsletter';

// Track successful subscription
trackNewsletterSubscription('user@example.com');
```

## API Routes

### POST /api/newsletter/subscribe

Server-side API route that securely handles MailerLite API calls:

```typescript
// Request body
{
  "email": "user@example.com",
  "firstName": "John",    // optional
  "lastName": "Doe"       // optional
}

// Response
{
  "success": true,
  "message": "Thank you for subscribing! You'll start receiving our newsletter soon."
}
```

## MailerLite Integration Options

### Option 1: API Integration (Recommended)
- Uses MailerLite REST API
- Secure server-side implementation
- Better error handling and validation
- Real-time subscription status

### Option 2: Embedded Form Integration
For simpler setup, you can use MailerLite's embedded forms:

```typescript
import { subscribeViaEmbeddedForm } from '@/lib/newsletter';

const result = await subscribeViaEmbeddedForm(
  { email: 'user@example.com', firstName: 'John' },
  'https://your-mailerlite-form-url'
);
```

## GDPR Compliance

The newsletter system includes several GDPR compliance features:

1. **Explicit Consent**: Users must check a consent checkbox before subscribing
2. **Clear Privacy Notice**: Links to privacy policy and unsubscribe information
3. **Data Minimization**: Only collects necessary information
4. **Right to Unsubscribe**: MailerLite handles unsubscribe requests
5. **Transparent Processing**: Clear information about data usage

## Privacy Features

- API keys kept secure on server-side
- No cookies required for basic functionality
- Privacy-friendly analytics integration (Plausible)
- Secure form submission with HTTPS
- No third-party tracking scripts
- Clear data usage disclosure

## Testing

Run the newsletter tests:

```bash
# Test newsletter utilities
npm test src/lib/__tests__/newsletter.test.ts

# Test newsletter form component
npm test src/components/layout/__tests__/NewsletterForm.test.tsx

# Test newsletter signup page
npm test src/components/newsletter/__tests__/NewsletterSignupPage.test.tsx

# Test API route
npm test src/app/api/newsletter/subscribe/__tests__/route.test.ts
```

## Customization

### Styling

The newsletter components use Tailwind CSS classes and can be customized by:
- Passing custom `className` props
- Modifying the component styles directly
- Using CSS custom properties for theme colors

### Content

Customize newsletter content by modifying:
- `getSubscriptionBenefits()` - List of subscription benefits
- `getPrivacyNotice()` - GDPR compliance text
- Component text and messaging

### Form Fields

Add additional form fields by:
1. Extending the `NewsletterSubscription` interface
2. Adding fields to the `NewsletterForm` component
3. Updating the API route to handle new fields
4. Configuring corresponding custom fields in MailerLite

## Troubleshooting

### Common Issues

1. **Subscription not working**: 
   - Check that `MAILERLITE_API_KEY` is correctly set in server environment
   - Verify API key has proper permissions in MailerLite
   - Check browser network tab for API errors

2. **API errors**: 
   - Ensure API key is valid and not expired
   - Check MailerLite API status
   - Verify group ID exists (if using groups)

3. **Validation errors**: 
   - Check email format validation
   - Verify required field validation

4. **Analytics not tracking**: 
   - Verify Plausible or Google Analytics setup
   - Check analytics tracking functions

### Debug Mode

Enable debug logging by adding to your environment:

```bash
NODE_ENV=development
```

This will log subscription attempts and errors to the browser console and server logs.

## Security Considerations

- API keys stored securely on server-side only
- All form submissions use HTTPS
- Input validation prevents XSS attacks
- No sensitive data stored in localStorage
- MailerLite handles secure data processing
- Rate limiting should be implemented at the server level

## Performance

The newsletter system is optimized for performance:
- Client-side validation reduces server requests
- Lazy loading of non-critical components
- Minimal JavaScript bundle size
- Efficient form state management
- Debounced input validation
- Server-side API calls for better security

## Accessibility

The newsletter forms include:
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management and indicators
- Semantic HTML structure

## MailerLite Features

Take advantage of MailerLite's features:
- **Automation**: Set up welcome email sequences
- **Segmentation**: Use groups to segment subscribers
- **Templates**: Create beautiful email templates
- **Analytics**: Track open rates, click rates, etc.
- **A/B Testing**: Test different email variations
- **Landing Pages**: Create dedicated signup pages

## Migration from Other Providers

If migrating from Mailchimp or other providers:
1. Export your subscriber list from the old provider
2. Import subscribers to MailerLite
3. Update environment variables
4. Test the subscription flow
5. Update any hardcoded references to the old provider