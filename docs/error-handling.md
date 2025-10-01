# Error Handling Documentation

This document describes the comprehensive error handling system implemented in the CryptoPulse website.

## Overview

The error handling system provides multiple layers of protection against errors and graceful degradation when issues occur:

1. **Global Error Boundaries** - Catch React component errors
2. **Custom 404 Page** - Handle missing pages with navigation
3. **API Error Handling** - Graceful fallbacks for external requests
4. **Client-side Error Logging** - Optional error reporting
5. **Safe Component Wrappers** - Prevent individual component failures

## Components

### ErrorBoundary

The main error boundary component that catches JavaScript errors in React components.

```tsx
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

// Wrap components that might throw errors
<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<div>Custom error message</div>}>
  <RiskyComponent />
</ErrorBoundary>
```

**Features:**
- Catches and displays component errors
- Shows error details in development mode
- Provides retry functionality
- Logs errors to external service (optional)
- Custom fallback UI support

### SafeImage

A wrapper around Next.js Image component with error handling.

```tsx
import { SafeImage } from '@/components/error/SafeImage';

<SafeImage
  src="/images/article.jpg"
  alt="Article image"
  fallbackSrc="/images/placeholder.jpg"
  width={800}
  height={400}
/>
```

**Features:**
- Automatic fallback to placeholder image
- Graceful degradation when images fail to load
- Maintains layout when images are unavailable

### SafeComponent

A component wrapper that provides error boundaries for individual components.

```tsx
import { SafeComponent } from '@/components/error/SafeComponent';

<SafeComponent
  title="Widget Error"
  message="This widget is temporarily unavailable"
>
  <ComplexWidget />
</SafeComponent>
```

## Error Pages

### 404 Not Found (`/app/not-found.tsx`)

Custom 404 page with:
- Clear error message
- Search functionality
- Navigation links to popular sections
- Responsive design with dark mode support

### Global Error Page (`/app/error.tsx`)

Handles runtime errors in pages:
- User-friendly error message
- Retry functionality
- Error logging in production
- Development error details

### Root Error Page (`/app/global-error.tsx`)

Handles critical errors that prevent the app from loading:
- Minimal HTML structure
- Application restart functionality
- Critical error logging

## Utility Functions

### Safe Execution

```tsx
import { safeAsync, safeSync } from '@/lib/error-handling';

// Safe async execution with fallback
const data = await safeAsync(
  () => fetchData(),
  { fallback: 'data' }
);

// Safe sync execution with fallback
const result = safeSync(
  () => processData(),
  'default value'
);
```

### Retry Logic

```tsx
import { retryAsync } from '@/lib/error-handling';

// Retry failed operations with exponential backoff
const data = await retryAsync(
  () => fetch('/api/data'),
  3, // max retries
  1000 // base delay in ms
);
```

### Safe Fetch

```tsx
import { safeFetch } from '@/lib/error-handling';

// Fetch with automatic retries and fallback
const data = await safeFetch(
  '/api/articles',
  { method: 'GET' },
  [], // fallback data
  2 // max retries
);
```

### Input Sanitization

```tsx
import { sanitizeInput } from '@/lib/error-handling';

// Sanitize user input to prevent XSS
const cleanInput = sanitizeInput(userInput, 500); // max 500 chars
```

### User-Friendly Messages

```tsx
import { getUserFriendlyErrorMessage } from '@/lib/error-handling';

try {
  await riskyOperation();
} catch (error) {
  const message = getUserFriendlyErrorMessage(error);
  showToast(message); // Show user-friendly error
}
```

## Error Logging

### Client-Side Logging

Errors are automatically logged to `/api/log-error` in production:

```typescript
// Automatic logging from ErrorBoundary
{
  message: "Component error message",
  stack: "Error stack trace",
  timestamp: "2024-01-01T00:00:00.000Z",
  userAgent: "Mozilla/5.0...",
  url: "https://cryptopulse.github.io/articles/bitcoin",
  type: "component-error"
}
```

### API Error Logging

The `/api/log-error` endpoint:
- Validates and sanitizes error data
- Rate limits to prevent spam
- Can be integrated with external logging services
- Fails silently if logging fails

### Integration with External Services

To integrate with services like Sentry, LogRocket, or Datadog:

```typescript
// In /api/log-error/route.ts
async function sendToLoggingService(errorData: any) {
  // Sentry example
  Sentry.captureException(new Error(errorData.message), {
    extra: errorData,
  });
  
  // Custom service example
  await fetch('https://your-logging-service.com/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData),
  });
}
```

## Testing Error Scenarios

### Manual Testing

Use the test script to verify error handling:

```typescript
import { testErrorHandling } from '@/scripts/test-error-handling';

// Run in browser console
await testErrorHandling();
```

### Component Testing

Test error boundaries in components:

```tsx
// Create a component that throws errors
function ErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Success</div>;
}

// Test with ErrorBoundary
<ErrorBoundary>
  <ErrorComponent shouldThrow={true} />
</ErrorBoundary>
```

### Network Error Testing

Test network error handling:

```typescript
// Simulate network failure
const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
global.fetch = mockFetch;

// Test safe fetch
const result = await safeFetch('/api/test', {}, { fallback: true });
expect(result).toEqual({ fallback: true });
```

## Best Practices

### 1. Wrap Risky Components

Always wrap components that might fail:

```tsx
// ❌ Risky - can crash entire page
<ComplexWidget />

// ✅ Safe - isolated error handling
<ErrorBoundary>
  <ComplexWidget />
</ErrorBoundary>
```

### 2. Provide Meaningful Fallbacks

```tsx
// ❌ Generic fallback
<ErrorBoundary fallback={<div>Error</div>}>

// ✅ Contextual fallback
<ErrorBoundary fallback={<div>Unable to load articles. Please try again.</div>}>
```

### 3. Use Safe Utilities for External Calls

```tsx
// ❌ Unhandled fetch
const data = await fetch('/api/data').then(r => r.json());

// ✅ Safe fetch with fallback
const data = await safeFetch('/api/data', {}, []);
```

### 4. Sanitize User Input

```tsx
// ❌ Unsanitized input
const comment = userInput;

// ✅ Sanitized input
const comment = sanitizeInput(userInput, 1000);
```

### 5. Provide User-Friendly Messages

```tsx
// ❌ Technical error message
catch (error) {
  alert(error.message); // "TypeError: Failed to fetch"
}

// ✅ User-friendly message
catch (error) {
  const message = getUserFriendlyErrorMessage(error);
  showToast(message); // "Network connection issue. Please check your internet connection."
}
```

## Error Recovery Strategies

### 1. Automatic Retry

For transient errors (network issues):

```typescript
const data = await retryAsync(() => fetchData(), 3);
```

### 2. Graceful Degradation

Provide alternative functionality:

```tsx
function SearchComponent() {
  const [searchError, setSearchError] = useState(false);
  
  if (searchError) {
    return (
      <div>
        <p>Search is temporarily unavailable.</p>
        <Link href="/articles">Browse all articles</Link>
      </div>
    );
  }
  
  return <SearchInput onError={() => setSearchError(true)} />;
}
```

### 3. Progressive Enhancement

Build core functionality first, enhance with features:

```tsx
function ArticlePage({ article }) {
  return (
    <div>
      {/* Core content - always works */}
      <ArticleContent article={article} />
      
      {/* Enhanced features - can fail gracefully */}
      <SafeComponent>
        <RelatedArticles articleId={article.id} />
      </SafeComponent>
      
      <SafeComponent>
        <CommentSection articleId={article.id} />
      </SafeComponent>
    </div>
  );
}
```

## Monitoring and Alerts

### Performance Impact

Error handling should not impact performance:
- Error boundaries only activate on errors
- Safe utilities have minimal overhead
- Logging is asynchronous and non-blocking

### Error Metrics

Track important error metrics:
- Error frequency by page/component
- Error types and patterns
- User impact and recovery rates
- Performance impact of error handling

### Alerting

Set up alerts for:
- High error rates
- Critical component failures
- API endpoint failures
- User experience degradation

## Conclusion

This comprehensive error handling system ensures that:
- Users always see a functional website
- Errors are handled gracefully with meaningful messages
- Development teams get detailed error information
- The site remains performant even when errors occur
- User experience is preserved during failures

The system is designed to fail gracefully and provide multiple layers of protection against various types of errors that can occur in a modern web application.