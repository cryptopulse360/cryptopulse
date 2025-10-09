import { Author } from '@/types/author';

/**
 * All site authors
 */
export const allAuthors: Author[] = [
  {
    name: 'Marcus Thompson',
    slug: 'marcus-thompson',
    title: 'Chief Market Analyst',
    specialty: 'Market forecasting & technical analysis',
    background: 'Former retail trader with 10+ years following U.S. stock and crypto markets, known for clear breakdowns of charts and macro trends',
    contentFocus: 'Price forecasts, strategic articles, long-term market outlooks',
    profilePic: '/images/authors/marcus-thompson.jpg',
  },
  {
    name: 'Elena Rodriguez',
    slug: 'elena-rodriguez',
    title: 'DeFi & Innovation Specialist',
    specialty: 'Product reviews & platform comparisons',
    background: 'Hands-on experience testing crypto exchanges, wallets, and trading platforms, skilled at user-experience evaluations',
    contentFocus: 'Exchange reviews, wallet reviews, top-list rankings',
    profilePic: '/images/authors/elena-rodriguez.jpg',
  },
  {
    name: 'David Kim',
    slug: 'david-kim',
    title: 'Regulatory & Policy Expert',
    specialty: 'Trend analysis & deep conceptual pieces',
    background: 'Long-time observer of Asian and global DeFi projects, strong interest in connecting philosophy and technology',
    contentFocus: 'Crypto trends, DeFi deep dives, new narratives in Web3',
    profilePic: '/images/authors/david-kim.jpg',
  },
  {
    name: 'Sarah Chen',
    slug: 'sarah-chen',
    title: 'Trading Psychology & Retail Markets',
    specialty: 'Step-by-step educational guides',
    background: 'Experienced in onboarding crypto beginners through tutorials and community education, clear and patient writing style',
    contentFocus: 'How-to guides, glossary articles, educational explainers',
    profilePic: '/images/authors/sarah-chen.jpg',
  },
  {
    name: 'Ahmed Hassan',
    slug: 'ahmed-hassan',
    title: 'Global Adoption & Emerging Markets',
    specialty: 'Fast-paced news coverage',
    background: 'Strong network in online crypto communities, quick to react to breaking stories and regulatory announcements',
    contentFocus: 'Breaking news, daily market updates, short hot takes',
    profilePic: '/images/authors/ahmed-hassan.jpg',
  },
  {
    name: 'Guest Contributors',
    slug: 'guests',
    title: 'Guest Contributors',
    specialty: 'Diverse topics from external experts and community contributors',
    background: 'Guest authors from the broader crypto and blockchain community sharing specialized insights',
    contentFocus: 'Guest articles on various cryptocurrency themes, market trends, and emerging technologies',
    profilePic: '/images/authors/guest.jpg',
  },
];

/**
 * Get author by exact name match
 */
export function getAuthorByName(name: string): Author | undefined {
  return allAuthors.find(author => author.name === name);
}

/**
 * Get author by slug
 */
export function getAuthorBySlug(slug: string): Author | undefined {
  return allAuthors.find(author => author.slug === slug);
}
