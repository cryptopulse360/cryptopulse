import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'

import { getAllArticles, getArticleBySlug, getArticlesByCategory, getCategorySlug, getFullCategoryFromSlug } from '@/lib/mdx'
import { articleCategories } from '@/lib/constants'
import { getRelatedArticles } from '@/lib/article-utils'
import { siteConfig } from '@/lib/constants'
import { getCategoryTitle } from '@/lib/category-utils'
import { ArticleCard } from '@/components/article/ArticleCard'
import { TagBadge } from '@/components/article/TagBadge'
import { TableOfContents } from '@/components/article/TableOfContents'
import { RelatedArticles } from '@/components/article/RelatedArticles'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { formatDate } from '@/lib/utils'
import { formatReadingTime } from '@/lib/reading-time'
import { extractTableOfContents, shouldShowTableOfContents } from '@/lib/toc'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import { generateSEOMetadata, generateArticleStructuredData, generateBreadcrumbStructuredData, generateCanonicalUrl, StructuredData } from '@/components/seo'
import { generateArticleUrl } from '@/lib/seo'
import { ArticleViewTracker } from '@/components/analytics/ArticleViewTracker'

async function generateStaticParams() {
  const categoryParams = articleCategories.map((category) => ({
    slug: getCategorySlug(category)
  }))
  const articleParams = getAllArticles().map((article) => ({
    slug: article.slug
  }))
  return [...categoryParams, ...articleParams]
}

export { generateStaticParams }

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params
  const fullCategory = getFullCategoryFromSlug(slug)
  
  if (fullCategory) {
    const canonicalUrl = `${siteConfig.url}/articles/${slug}`
    return generateSEOMetadata({
      title: `${fullCategory} - CryptoPulse`,
      description: `Articles and insights on ${fullCategory.toLowerCase()}. Stay updated with the latest in cryptocurrency ${fullCategory.toLowerCase()}.`,
      canonical: canonicalUrl,
    })
  }

  const article = getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  const articleUrl = generateArticleUrl(slug)
  const canonicalUrl = generateCanonicalUrl(`/articles/${slug}`)

  return generateSEOMetadata({
    title: article.title,
    description: article.description,
    image: article.heroImage,
    url: articleUrl,
    type: 'article',
    article,
    canonical: canonicalUrl,
  })
}

export default function ArticlesSlugPage({ params }: PageProps) {
  const { slug } = params

  // Check if this is a category page
  const fullCategory = getFullCategoryFromSlug(slug)
  if (fullCategory) {
    const niceTitle = getCategoryTitle(slug)
    const articles = getArticlesByCategory(fullCategory)
    
    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Articles', href: '/articles' },
      { label: niceTitle, href: `/articles/${slug}` }
    ]

    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {niceTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore our comprehensive articles and insights on {niceTitle.toLowerCase()}. Stay ahead in the dynamic world of cryptocurrency and blockchain technology.
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="mx-auto max-w-md">
                <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Coming Soon
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  No articles available in {niceTitle.toLowerCase()} yet.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  We're working hard to bring you the latest insights. Check back soon for new content!
                </p>
                <div className="space-y-2">
                  <a href="/articles" className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Explore Other Articles
                  </a>
                  <a href="/newsletter" className="block w-full text-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Get Updates via Newsletter
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  className="h-full"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Otherwise, treat as article page
  const article = getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  const allArticles = getAllArticles()
  const toc = extractTableOfContents(article.content)
  const showToc = shouldShowTableOfContents(toc)
  const relatedArticles = getRelatedArticles(article, allArticles, 3)

  const articleUrl = generateArticleUrl(article.slug)
  const articleStructuredData = generateArticleStructuredData(article, articleUrl)
  
  const breadcrumbItems = [
    { name: 'Home', url: 'https://cryptopulse.github.io' },
    { name: 'Articles', url: 'https://cryptopulse.github.io/articles' },
    { name: article.title, url: articleUrl },
  ]
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbItems)

  return (
    <>
      <ArticleViewTracker article={{ slug: article.slug, title: article.title, tags: article.tags }} />
      
      <StructuredData data={articleStructuredData} />
      <StructuredData data={breadcrumbStructuredData} />
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="flex-1 lg:max-w-4xl">
              <article>
                <header className="mb-8">
                  {article.featured && (
                    <div className="mb-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Featured Article
                      </span>
                    </div>
                  )}

                  {article.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} size="sm" source="article-header" />
                      ))}
                    </div>
                  )}

                  <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
                    {article.title}
                  </h1>

                  <p className="mb-6 text-lg text-gray-600 dark:text-gray-300 md:text-xl">
                    {article.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <svg 
                        className="mr-2 h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                        />
                      </svg>
                      <span className="font-medium">{article.author}</span>
                    </div>

                    <div className="flex items-center">
                      <svg 
                        className="mr-2 h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      <time dateTime={article.publishedAt.toISOString()}>
                        Published {formatDate(article.publishedAt)}
                      </time>
                    </div>

                    {article.updatedAt && (
                      <div className="flex items-center">
                        <svg 
                          className="mr-2 h-4 w-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                          />
                        </svg>
                        <time dateTime={article.updatedAt.toISOString()}>
                          Updated {formatDate(article.updatedAt)}
                        </time>
                      </div>
                    )}

                    <div className="flex items-center">
                      <svg 
                        className="mr-2 h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      {formatReadingTime(article.readingTime)}
                    </div>
                  </div>
                </header>

                {article.heroImage && (
                  <div className="mb-8 overflow-hidden rounded-xl">
                    <Image
                      src={article.heroImage}
                      alt={article.title}
                      width={800}
                      height={450}
                      className="aspect-video w-full object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-img:rounded-lg prose-img:shadow-md prose-hr:border-gray-300 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-blue-400 dark:prose-strong:text-white dark:prose-code:text-pink-400 dark:prose-code:bg-gray-800 dark:prose-blockquote:border-l-blue-400 dark:prose-blockquote:bg-blue-900/20 dark:prose-hr:border-gray-600">
                  <MDXRemote source={article.content} components={mdxComponents} />
                </div>
              </article>
            </div>

            <aside className="lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                {showToc && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <TableOfContents items={toc} />
                  </div>
                )}
                
                <RelatedArticles articles={relatedArticles} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
