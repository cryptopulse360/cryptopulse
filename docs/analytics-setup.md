# Analytics Setup Guide

This document explains how to set up and use privacy-friendly analytics with Plausible Analytics in the CryptoPulse website.

## Overview

The website uses Plausible Analytics, a privacy-friendly analytics service that:
- Doesn't use cookies
- Doesn't track users across sites
- Is GDPR compliant by default
- Provides essential website metrics

## Configuration

### Environment Variables

Set the following environment variable to enable analytics:

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

For example:
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=cryptopulse.github.io
```

### Plausible Account Setup

1. Sign up for a Plausible Analytics account at https://plausible.io
2. Add your domain to your Plausible dashboard
3. Copy the domain name and set it as the `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable

## Features

### Automatic Tracking

The following events are automatically tracked:

- **Page Views**: All page visits are tracked automatically
- **Article Views**: When users view individual articles
- **Search Usage**: When users open search and perform queries
- **Theme Changes**: When users toggle between light/dark/system themes
- **Newsletter Signups**: When users attempt and complete newsletter subscriptions
- **Tag Clicks**: When users click on article tags
- **External Links**: When users click on external links

### Custom Events

The analytics system provides several custom events:

```typescript
// Article interactions
ANALYTICS_EVENTS.ARTICLE_VIEW
ANALYTICS_EVENTS.ARTICLE_SHARE
ANALYTICS_EVENTS.ARTICLE_SEARCH

// Navigation
ANALYTICS_EVENTS.SEARCH_OPEN
ANALYTICS_EVENTS.SEARCH_QUERY
ANALYTICS_EVENTS.TAG_CLICK

// Newsletter
ANALYTICS_EVENTS.NEWSLETTER_SIGNUP
ANALYTICS_EVENTS.NEWSLETTER_SUCCESS

// Theme
ANALYTICS_EVENTS.THEME_TOGGLE

// External links
ANALYTICS_EVENTS.EXTERNAL_LINK
```

## Usage

### Using the Analytics Hook

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackArticle, trackSearch, trackTheme } = useAnalytics();

  const handleArticleView = () => {
    trackArticle('article-slug', 'Article Title', ['tag1', 'tag2']);
  };

  const handleSearch = () => {
    trackSearch('bitcoin', 5); // query and results count
  };

  const handleThemeChange = () => {
    trackTheme('dark');
  };

  // ... component logic
}
```

### Direct Analytics Functions

```typescript
import { 
  trackEvent, 
  trackArticleView, 
  trackSearch,
  trackNewsletterSignup 
} from '@/lib/analytics';

// Track custom event
trackEvent('Custom Event', { property: 'value' });

// Track article view
trackArticleView('article-slug', 'Article Title', ['crypto', 'bitcoin']);

// Track search
trackSearch('ethereum', 3);

// Track newsletter signup
trackNewsletterSignup('footer');
```

## Privacy Compliance

### GDPR Compliance

Plausible Analytics is GDPR compliant by default:
- No cookies are used
- No personal data is collected
- No cross-site tracking
- Data is processed in the EU

### Data Collected

The analytics system only collects:
- Page views and referrers
- Device type and browser (anonymized)
- Country and region (based on IP, not stored)
- Custom events with non-personal properties

### User Rights

Users can:
- Opt out using browser Do Not Track settings
- Request data deletion (though no personal data is stored)
- View the privacy policy for full details

## Testing

### Development Mode

In development mode, analytics events are logged to the console but not sent to Plausible unless the domain is configured.

### Testing Analytics

```typescript
// Mock analytics in tests
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
  trackArticleView: jest.fn(),
  // ... other functions
}));
```

### Verifying Setup

1. Deploy your site with the Plausible domain configured
2. Visit your site and perform various actions
3. Check your Plausible dashboard for incoming data
4. Verify custom events appear in the dashboard

## Troubleshooting

### Analytics Not Working

1. **Check Environment Variable**: Ensure `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set correctly
2. **Verify Domain**: Make sure the domain matches exactly what's in your Plausible dashboard
3. **Check Console**: Look for any JavaScript errors in the browser console
4. **Ad Blockers**: Some ad blockers may block Plausible scripts

### Custom Events Not Appearing

1. **Check Event Names**: Ensure event names match the constants in `ANALYTICS_EVENTS`
2. **Verify Props**: Make sure event properties are simple strings, numbers, or booleans
3. **Test Locally**: Check if events are being called in development mode

### Performance Impact

Plausible Analytics has minimal performance impact:
- Script size: ~1KB gzipped
- No cookies or local storage
- Asynchronous loading
- No impact on Core Web Vitals

## Best Practices

1. **Use Descriptive Event Names**: Make event names clear and consistent
2. **Limit Event Properties**: Only include necessary properties to keep data clean
3. **Test Thoroughly**: Always test analytics in staging before production
4. **Monitor Performance**: Keep an eye on analytics impact on site speed
5. **Respect Privacy**: Only track what's necessary for improving the user experience

## Support

For issues with:
- **Plausible Service**: Contact Plausible support
- **Implementation**: Check the analytics test files for examples
- **Custom Events**: Refer to the analytics utilities in `/src/lib/analytics.ts`