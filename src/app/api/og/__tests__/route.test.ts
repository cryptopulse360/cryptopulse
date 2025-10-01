import { describe, it, expect, vi } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

// Mock @vercel/og
vi.mock('@vercel/og', () => ({
  ImageResponse: vi.fn().mockImplementation((element, options) => {
    return new Response('mocked-image-response', {
      headers: { 'Content-Type': 'image/png' },
    });
  }),
}));

describe('/api/og', () => {
  it('should generate OG image with default parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/og');
    
    const response = await GET(request);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should generate OG image with custom title', async () => {
    const request = new NextRequest('http://localhost:3000/api/og?title=Custom%20Title');
    
    const response = await GET(request);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should generate OG image with all parameters', async () => {
    const url = 'http://localhost:3000/api/og?' + new URLSearchParams({
      title: 'Bitcoin Analysis',
      description: 'Deep dive into Bitcoin trends',
      author: 'John Crypto',
      tags: 'bitcoin,analysis,crypto',
    }).toString();
    
    const request = new NextRequest(url);
    
    const response = await GET(request);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should handle errors gracefully', async () => {
    // Mock ImageResponse to throw an error
    const { ImageResponse } = await import('@vercel/og');
    vi.mocked(ImageResponse).mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const request = new NextRequest('http://localhost:3000/api/og?title=Test');
    
    const response = await GET(request);
    
    // Should still return a response (fallback image)
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should handle special characters in parameters', async () => {
    const url = 'http://localhost:3000/api/og?' + new URLSearchParams({
      title: 'Bitcoin & Ethereum: A Comparison!',
      description: 'Analysis of BTC vs ETH (2024)',
    }).toString();
    
    const request = new NextRequest(url);
    
    const response = await GET(request);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should limit tags to first 3', async () => {
    const url = 'http://localhost:3000/api/og?' + new URLSearchParams({
      title: 'Test Article',
      tags: 'tag1,tag2,tag3,tag4,tag5',
    }).toString();
    
    const request = new NextRequest(url);
    
    const response = await GET(request);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should adjust font size for long titles', async () => {
    const longTitle = 'This is a very long title that should trigger the smaller font size adjustment';
    const url = 'http://localhost:3000/api/og?' + new URLSearchParams({
      title: longTitle,
    }).toString();
    
    const request = new NextRequest(url);
    
    const response = await GET(request);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });

  it('should truncate long descriptions', async () => {
    const longDescription = 'a'.repeat(150) + ' This part should be truncated';
    const url = 'http://localhost:3000/api/og?' + new URLSearchParams({
      title: 'Test Title',
      description: longDescription,
    }).toString();
    
    const request = new NextRequest(url);
    
    const response = await GET(request);
    
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Content-Type')).toBe('image/png');
  });
});