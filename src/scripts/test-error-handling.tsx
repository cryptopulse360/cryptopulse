/**
 * Manual test script for error handling functionality
 * This script can be used to verify error handling works correctly
 */

import { safeAsync, safeSync, getUserFriendlyErrorMessage, sanitizeInput } from '@/lib/error-handling';

// Test error handling utilities
export async function testErrorHandling() {
  console.log('Testing Error Handling Utilities...\n');

  // Test safeAsync
  console.log('1. Testing safeAsync:');
  const asyncResult1 = await safeAsync(
    async () => 'Success!',
    'Fallback'
  );
  console.log('  Success case:', asyncResult1); // Should be 'Success!'

  const asyncResult2 = await safeAsync(
    async () => { throw new Error('Test error'); },
    'Fallback'
  );
  console.log('  Error case:', asyncResult2); // Should be 'Fallback'

  // Test safeSync
  console.log('\n2. Testing safeSync:');
  const syncResult1 = safeSync(
    () => 'Success!',
    'Fallback'
  );
  console.log('  Success case:', syncResult1); // Should be 'Success!'

  const syncResult2 = safeSync(
    () => { throw new Error('Test error'); },
    'Fallback'
  );
  console.log('  Error case:', syncResult2); // Should be 'Fallback'

  // Test sanitizeInput
  console.log('\n3. Testing sanitizeInput:');
  const maliciousInput = '<script>alert("xss")</script>Hello World';
  const sanitized = sanitizeInput(maliciousInput);
  console.log('  Original:', maliciousInput);
  console.log('  Sanitized:', sanitized); // Should remove script tags

  // Test getUserFriendlyErrorMessage
  console.log('\n4. Testing getUserFriendlyErrorMessage:');
  const networkError = new TypeError('Failed to fetch');
  const notFoundError = new Error('404 Not Found');
  const genericError = new Error('Something went wrong');

  console.log('  Network error:', getUserFriendlyErrorMessage(networkError));
  console.log('  404 error:', getUserFriendlyErrorMessage(notFoundError));
  console.log('  Generic error:', getUserFriendlyErrorMessage(genericError));

  console.log('\n✅ Error handling tests completed!');
}

// Test component error scenarios
export function createTestErrorComponent() {
  return function TestErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
      throw new Error('Test component error for ErrorBoundary');
    }
    return <div>Component rendered successfully</div>;
  };
}

// Test image error handling
export function testImageErrorHandling() {
  const mockImageElement = {
    src: 'original.jpg',
    style: { display: '' },
  };

  const mockEvent = {
    currentTarget: mockImageElement,
  } as any;

  console.log('Testing image error handling...');
  console.log('Original src:', mockImageElement.src);

  // Simulate image error with fallback
  if (mockImageElement.src !== 'fallback.jpg') {
    mockImageElement.src = 'fallback.jpg';
    console.log('Fallback src set:', mockImageElement.src);
  } else {
    mockImageElement.style.display = 'none';
    console.log('Image hidden after fallback failed');
  }
}

// Export test functions for manual testing
if (typeof window !== 'undefined') {
  (window as any).testErrorHandling = testErrorHandling;
  (window as any).testImageErrorHandling = testImageErrorHandling;
  console.log('Error handling test functions available on window object');
}