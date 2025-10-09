import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/error-handling';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate and sanitize the error data
    const errorData = {
      message: sanitizeInput(body.message || '', 500),
      stack: sanitizeInput(body.stack || '', 2000),
      digest: sanitizeInput(body.digest || '', 100),
      timestamp: body.timestamp || new Date().toISOString(),
      userAgent: sanitizeInput(body.userAgent || '', 500),
      url: sanitizeInput(body.url || '', 500),
      type: sanitizeInput(body.type || 'unknown', 50),
      componentStack: sanitizeInput(body.componentStack || '', 2000),
    };
    
    // In a real application, you would send this to a logging service
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error Logged:', errorData);
    }
    
    // Example: Send to external logging service
    // await sendToLoggingService(errorData);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

// Optional: Add rate limiting to prevent spam
const errorLogCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = errorLogCounts.get(ip);
  
  if (!entry || now > entry.resetTime) {
    errorLogCounts.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return false;
  }
  
  if (entry.count >= 10) { // Max 10 errors per minute per IP
    return true;
  }
  
  entry.count++;
  return false;
}

// Example function to send to external logging service
async function sendToLoggingService(errorData: any): Promise<void> {
  // This is where you would integrate with services like:
  // - Sentry
  // - LogRocket
  // - Datadog
  // - Custom logging endpoint
  
  // Example Sentry integration:
  // Sentry.captureException(new Error(errorData.message), {
  //   extra: errorData,
  // });
  
  // Example custom logging service:
  // await fetch('https://your-logging-service.com/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorData),
  // });
}