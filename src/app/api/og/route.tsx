import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'CryptoPulse';
    const description = searchParams.get('description') || 'Latest cryptocurrency news and analysis';
    const author = searchParams.get('author') || 'CryptoPulse Team';
    const tags = searchParams.get('tags')?.split(',') || [];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '60px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Header with logo and branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* Logo placeholder - using a simple crypto icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                ₿
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#f8fafc',
                  letterSpacing: '-0.025em',
                }}
              >
                CryptoPulse
              </div>
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {tags.slice(0, 3).map((tag, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#1e40af',
                      color: '#dbeafe',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    #{tag.trim()}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 60 ? '48px' : '56px',
                fontWeight: 'bold',
                color: '#f8fafc',
                lineHeight: 1.1,
                margin: '0 0 24px 0',
                letterSpacing: '-0.025em',
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            {description && description !== title && (
              <p
                style={{
                  fontSize: '24px',
                  color: '#cbd5e1',
                  lineHeight: 1.4,
                  margin: '0 0 32px 0',
                  maxWidth: '90%',
                }}
              >
                {description.length > 120 ? `${description.substring(0, 120)}...` : description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid #334155',
              paddingTop: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#475569',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#f8fafc',
                }}
              >
                {author.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: '18px',
                  color: '#e2e8f0',
                  fontWeight: '500',
                }}
              >
                {author}
              </span>
            </div>

            <div
              style={{
                fontSize: '16px',
                color: '#64748b',
              }}
            >
              cryptopulse.news
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          CryptoPulse
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}