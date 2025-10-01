import { getAllArticles } from '@/lib/mdx';
import { getHomePageArticles } from '@/lib/article-utils';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { LatestSection } from '@/components/home/LatestSection';
import { generateWebsiteStructuredData, StructuredData } from '@/components/seo';

export default function Home() {
  // Get all articles and organize them for the home page
  const allArticles = getAllArticles();
  const { featured, latest } = getHomePageArticles(allArticles);

  // Generate website structured data
  const websiteStructuredData = generateWebsiteStructuredData();

  return (
    <>
      {/* Website Structured Data */}
      <StructuredData data={websiteStructuredData} />
      
      <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Articles Section */}
      {featured.length > 0 && (
        <FeaturedSection articles={featured} />
      )}

      {/* Latest Articles Section */}
      {latest.length > 0 && (
        <LatestSection articles={latest} />
      )}

      {/* Fallback content if no articles exist */}
      {allArticles.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We&apos;re building an amazing crypto news platform with the latest market insights, 
                technical analysis, and breaking news from the world of digital assets.
              </p>
            </div>
          </div>
        </section>
      )}
      </main>
    </>
  );
}