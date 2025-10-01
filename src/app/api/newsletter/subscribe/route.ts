import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check if MailerLite is configured
    const apiKey = process.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      console.error('MailerLite API key not configured');
      return NextResponse.json(
        { success: false, message: 'Newsletter subscription is currently unavailable.' },
        { status: 500 }
      );
    }

    // Prepare subscriber data for MailerLite
    const subscriberData = {
      email: email.trim(),
      fields: {
        name: firstName?.trim() || '',
        last_name: lastName?.trim() || '',
      },
      status: 'active', // Use 'unconfirmed' for double opt-in
    };

    // Submit to MailerLite API
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Thank you for subscribing! You\'ll start receiving our newsletter soon.',
      });
    } else {
      // Handle specific MailerLite errors
      if (result.message && result.message.includes('already exists')) {
        return NextResponse.json({
          success: false,
          message: 'This email is already subscribed to our newsletter.',
        });
      }
      
      console.error('MailerLite API error:', result);
      return NextResponse.json(
        { success: false, message: result.message || 'Something went wrong. Please try again later.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
