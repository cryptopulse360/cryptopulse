# Test Environment Configuration

This directory contains comprehensive test setup and utilities for the CryptoPulse website. The configuration ensures reliable, consistent test results across different environments.

## Files Overview

### Core Setup Files

- **`setup.ts`** - Main test setup file that configures the global test environment
- **`test-utils.tsx`** - Custom React Testing Library utilities and providers
- **`environment-config.ts`** - Environment configuration for consistent test behavior
- **`external-mocks.ts`** - Mocks for external dependencies and APIs
- **`accessibility-setup.ts`** - Accessibility testing utilities and setup
- **`performance-setup.ts`** - Performance testing environment setup

## Features

### 1. Comprehensive Browser API Mocking

- **DOM APIs**: IntersectionObserver, ResizeObserver, MutationObserver
- **Storage APIs**: localStorage, sessionStorage with full implementation
- **Performance APIs**: Performance timing, navigation, paint metrics
- **Media APIs**: matchMedia for responsive design testing
- **Network APIs**: fetch, navigator.connection, online/offline events

### 2. Next.js Integration

- **Router mocking**: useRouter, useParams, usePathname, useSearchParams
- **Component mocking**: Image, Link, Head components
- **Navigation mocking**: notFound, redirect functions
- **Environment variables**: Consistent test environment setup

### 3. External Dependencies

- **Analytics**: Plausible, Google Analytics mocking
- **Search**: Lunr.js search library mocking
- **Content**: MDX, gray-matter, reading-time mocking
- **Images**: @vercel/og, image optimization mocking

### 4. Accessibility Testing

- **Screen reader simulation**: ARIA live regions, announcements
- **Keyboard navigation**: Tab trapping, focus management
- **Semantic structure**: Landmarks, headings, form labels
- **Color contrast**: Basic contrast validation

### 5. Performance Testing

- **Network conditions**: Fast, slow, offline simulation
- **Device capabilities**: Memory, CPU, connection type
- **Performance metrics**: FCP, LCP, CLS simulation
- **Resource loading**: Preload, prefetch mocking

## Usage Examples

### Basic Component Testing

```typescript
import { render, screen } from '@/test/test-utils';
import { MyComponent } from '@/components/MyComponent';

test('renders component correctly', () => {
  render(<MyComponent />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### Accessibility Testing

```typescript
import { testAccessibility, testKeyboardNavigation } from '@/test/accessibility-setup';
import { MyModal } from '@/components/MyModal';

test('modal is accessible', async () => {
  await testAccessibility(<MyModal isOpen={true} />);
});

test('modal keyboard navigation works', () => {
  testKeyboardNavigation(
    () => render(<MyModal isOpen={true} />),
    [
      {
        element: '[data-testid="modal-close"]',
        key: 'Escape',
        expectedAction: () => expect(mockOnClose).toHaveBeenCalled(),
      },
    ]
  );
});
```

### Performance Testing

```typescript
import { setupPerformanceTestEnvironment, mockSlowConnection } from '@/test/performance-setup';

test('handles slow connection gracefully', () => {
  mockSlowConnection();
  setupPerformanceTestEnvironment();
  
  render(<MyComponent />);
  // Test component behavior under slow network conditions
});
```

### Mock External APIs

```typescript
import { mockFetch } from '@/test/test-utils';

test('handles API responses', async () => {
  mockFetch({
    '/api/newsletter/subscribe': { success: true, groups: [] },
    '/api/search-index': { index: '{}', data: [] },
  });
  
  // Test component that uses these APIs
});
```

## Configuration

### Vitest Configuration

The test environment is configured in `vitest.config.ts` with:

- **Environment**: jsdom for DOM testing
- **Setup files**: All test setup files are automatically loaded
- **Globals**: Test functions available globally
- **Coverage**: v8 provider with comprehensive reporting
- **Timeouts**: Extended for complex async operations

### Environment Variables

Test-specific environment variables:

```bash
NODE_ENV=test
NEXT_PUBLIC_SITE_URL=http://localhost:3000
TZ=UTC
```

## Best Practices

### 1. Test Organization

- Group related tests in describe blocks
- Use descriptive test names
- Test one thing per test case
- Use setup/teardown appropriately

### 2. Mocking Strategy

- Mock external dependencies at the module level
- Use real implementations for internal utilities
- Mock browser APIs that aren't available in Node.js
- Provide realistic mock data

### 3. Accessibility Testing

- Test keyboard navigation for interactive elements
- Verify ARIA attributes and relationships
- Check semantic HTML structure
- Test screen reader announcements

### 4. Performance Testing

- Test under different network conditions
- Verify lazy loading behavior
- Check resource optimization
- Test performance monitoring

### 5. Error Handling

- Test error boundaries
- Verify error logging
- Test graceful degradation
- Check error recovery mechanisms

## Troubleshooting

### Common Issues

1. **Mock not working**: Ensure mock is defined before component import
2. **Async test failures**: Use proper async/await or waitFor
3. **DOM not updating**: Use act() for state updates
4. **Timer issues**: Use vi.useFakeTimers() and vi.runAllTimers()

### Debug Tips

- Use `screen.debug()` to see rendered DOM
- Check mock call history with `vi.mocked(fn).mock.calls`
- Use `waitFor()` for async DOM updates
- Enable verbose logging for detailed test output

## Maintenance

### Adding New Mocks

1. Add mock to appropriate setup file
2. Export utility functions if needed
3. Update documentation
4. Add tests for mock behavior

### Updating Dependencies

1. Check for breaking changes in testing libraries
2. Update mock implementations as needed
3. Run full test suite to verify compatibility
4. Update documentation for new features

## Performance

The test setup is optimized for:

- **Fast startup**: Minimal setup overhead
- **Parallel execution**: Tests can run concurrently
- **Memory efficiency**: Proper cleanup and mock resets
- **Consistent timing**: Deterministic test behavior