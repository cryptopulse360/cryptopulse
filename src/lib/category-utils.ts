export function getCategoryTitle(slug: string): string {
  const slugMap: Record<string, string> = {
    'breaking-news': 'Breaking News',
    'price-analyses-forecasts': 'Price Analyses & Forecasts',
    'trend-articles': 'Trend Articles',
    'educational-glossary-articles': 'Educational & Glossary Articles',
    'top-lists-rankings': 'Top Lists & Rankings',
    'how-to-guides': 'How-To Guides',
    'coin-tool-reviews': 'Coin & Tool Reviews',
    'strategy-deep-dive-articles': 'Strategy Deep Dive Articles',
  }
  return slugMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
