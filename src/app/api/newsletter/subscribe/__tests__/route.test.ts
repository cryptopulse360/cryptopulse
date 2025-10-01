/**
 * @jest-environment node
 */

import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock fetch globally
global.fetch = jest.fn();

describe('/api/newsletter/subscribe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.MAILERLITE_API_KEY;
    delete process.env.MAILERLITE_GROUP_ID;
  });

  it('should successfully subscribe a user', async () => {
    // Mock environment variables
    process.env.MAILERLITE_API_KEY = 'test-api-key';
    process.env.MAILERLITE_GROUP_ID = 'test-group-id';

    // Mock successful MailerLite response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: '123',
          email: 'test@example.com',
          status: 'active',
        },
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('Thank you for subscribing');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://connect.mailerlite.com/api/subscribers',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key',
        }),
      })
    );
  });

  it('should handle invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain('valid email address');
  });

  it('should handle missing email', async () => {
    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain('valid email address');
  });

  it('should handle missing API key', async () => {
    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toContain('currently unavailable');
  });

  it('should handle MailerLite API errors', async () => {
    process.env.MAILERLITE_API_KEY = 'test-api-key';

    // Mock MailerLite error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Invalid API key',
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe('Invalid API key');
  });

  it('should handle duplicate email subscription', async () => {
    process.env.MAILERLITE_API_KEY = 'test-api-key';

    // Mock MailerLite duplicate email response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Email already exists',
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain('already subscribed');
  });

  it('should handle network errors', async () => {
    process.env.MAILERLITE_API_KEY = 'test-api-key';

    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toContain('Something went wrong');
  });

  it('should include group ID when provided', async () => {
    process.env.MAILERLITE_API_KEY = 'test-api-key';
    process.env.MAILERLITE_GROUP_ID = 'test-group-id';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: '123' } }),
    });

    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    await POST(request);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    
    expect(requestBody.groups).toEqual(['test-group-id']);
  });

  it('should handle empty group ID', async () => {
    process.env.MAILERLITE_API_KEY = 'test-api-key';
    // No group ID set

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: '123' } }),
    });

    const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    await POST(request);

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    
    expect(requestBody.groups).toEqual([]);
  });
});