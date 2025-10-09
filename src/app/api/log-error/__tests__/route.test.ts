import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('/api/log-error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully logs error data', async () => {
    const errorData = {
      message: 'Test error',
      stack: 'Error stack trace',
      timestamp: '2024-01-01T00:00:00.000Z',
      userAgent: 'Mozilla/5.0',
      url: 'https://example.com',
      type: 'client-error',
    };

    const request = new NextRequest('http://localhost/api/log-error', {
      method: 'POST',
      body: JSON.stringify(errorData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('sanitizes malicious input', async () => {
    const maliciousData = {
      message: '<script>alert("xss")</script>Malicious message',
      stack: 'javascript:alert("hack")',
      userAgent: 'onclick="hack()" Mozilla/5.0',
    };

    const request = new NextRequest('http://localhost/api/log-error', {
      method: 'POST',
      body: JSON.stringify(maliciousData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    // Verify that console.error was called with sanitized data
    expect(console.error).toHaveBeenCalledWith(
      'Client Error Logged:',
      expect.objectContaining({
        message: 'Malicious message', // Script tags removed
        stack: 'alert("hack")', // javascript: removed
        userAgent: ' Mozilla/5.0', // onclick removed
      })
    );
  });

  it('handles missing fields gracefully', async () => {
    const incompleteData = {
      message: 'Test error',
      // Missing other fields
    };

    const request = new NextRequest('http://localhost/api/log-error', {
      method: 'POST',
      body: JSON.stringify(incompleteData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('handles invalid JSON gracefully', async () => {
    const request = new NextRequest('http://localhost/api/log-error', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to log error' });
  });

  it('limits field lengths', async () => {
    const longData = {
      message: 'a'.repeat(1000), // Should be truncated to 500
      stack: 'b'.repeat(3000), // Should be truncated to 2000
      digest: 'c'.repeat(200), // Should be truncated to 100
    };

    const request = new NextRequest('http://localhost/api/log-error', {
      method: 'POST',
      body: JSON.stringify(longData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(console.error).toHaveBeenCalledWith(
      'Client Error Logged:',
      expect.objectContaining({
        message: expect.stringMatching(/^a{500}$/),
        stack: expect.stringMatching(/^b{2000}$/),
        digest: expect.stringMatching(/^c{100}$/),
      })
    );
  });

  it('logs in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const errorData = { message: 'Test error' };
    const request = new NextRequest('http://localhost/api/log-error', {
      method: 'POST',
      body: JSON.stringify(errorData),
    });

    POST(request);

    expect(console.error).toHaveBeenCalledWith(
      'Client Error Logged:',
      expect.objectContaining({
        message: 'Test error',
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('does not log in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const errorData = { message: 'Test error' };
    const request = new NextRequest('http://localhost/api/log-error', {
      method: 'POST',
      body: JSON.stringify(errorData),
    });

    POST(request);

    expect(console.error).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });
});
