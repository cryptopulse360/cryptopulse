import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeScript } from '@/components/ThemeScript';
import { PlausibleScript } from '@/components/analytics/PlausibleScript';
import { SkipLinks } from '@/components/accessibility/SkipLinks';
// import { ErrorBoundary } from '@/components/error';
import { generateSEOMetadata } from '@/components/seo';

// Optimize font loading with display swap and preload
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = generateSEOMetadata({
  canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <ThemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//plausible.io" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} font-sans`}>
        <SkipLinks />
        <ThemeProvider defaultTheme="system" storageKey="yoursite-theme">
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors">
            <Header />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <PlausibleScript />
      </body>
    </html>
  );
}
