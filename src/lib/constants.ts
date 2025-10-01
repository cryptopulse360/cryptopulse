import { SiteConfig, NavItem, FooterSection } from '@/types';

/**
 * Main site configuration
 */
export const siteConfig: SiteConfig = {
  name: 'CryptoPulse: Your Wire to the Future of Finance',
  shortName: 'CryptoPulse',
  description: 'CryptoPulse provides clear, reliable insights into cryptocurrency markets, analysis, and blockchain developments.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptopulse.mywire.org',
  author: 'The Pulse Crew',
  social: {
    x: 'https://x.com/the_cryptopulse',
    pinterest: 'https://pin.it/1cITW7xl0',
  },
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },
  newsletter: {
    mailerliteApiKey: process.env.NEXT_PUBLIC_MAILERLITE_API_KEY,
  },
  seo: {
    defaultImage: '/images/og-default.jpg',
    fallbackImage: '/images/og-fallback.png',
    xHandle: '@yourusername',
  },
};

/**
 * Main navigation items
 */
export const mainNavigation: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Articles',
    href: '/articles',
  },
  {
    label: 'Tags',
    href: '/tags',
  },
  {
    label: 'Authors',
    href: '/authors',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

/**
 * Footer navigation sections
 */
export const footerNavigation: FooterSection[] = [
  {
    title: 'Content',
    links: [
      { label: 'Latest Articles', href: '/articles' },
      { label: 'Featured Posts', href: '/featured' },
      { label: 'All Tags', href: '/tags' },
      { label: 'RSS Feed', href: '/rss.xml' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'X (Twitter)', href: siteConfig.social.x, external: true },
      { label: 'Pinterest', href: siteConfig.social.pinterest, external: true },
    ],
  },
];

/**
 * Popular cryptocurrency tags for quick access
 */
export const popularTags = [
  'bitcoin',
  'ethereum',
  'defi',
  'nft',
  'altcoins',
  'trading',
  'blockchain',
  'market-analysis',
  'regulation',
  'mining',
];

/**
 * Article categories
 */
export const articleCategories = [
  'breaking-news',
  'price-analyses-forecasts',
  'trend-articles',
  'educational-glossary-articles',
  'top-lists-rankings',
  'how-to-guides',
  'coin-tool-reviews',
  'strategy-deep-dive-articles',
];

/**
 * SEO and metadata constants
 */
export const seoDefaults = {
  titleTemplate: '%s | CryptoPulse',
  defaultTitle: 'CryptoPulse: Your Wire to the Future of Finance',
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.seo.defaultImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    handle: siteConfig.seo.xHandle,
    site: siteConfig.seo.xHandle,
    cardType: 'summary_large_image',
  },
};

/**
 * Pagination constants
 */
export const pagination = {
  articlesPerPage: 12,
  relatedArticlesCount: 3,
  searchResultsPerPage: 10,
};

/**
 * Performance and optimization constants
 */
export const performance = {
  imageQuality: 85,
  imageSizes: [640, 768, 1024, 1280, 1600],
  lazyLoadingOffset: '200px',
  searchDebounceMs: 300,
};
