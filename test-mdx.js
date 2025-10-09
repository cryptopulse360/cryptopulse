// Simple test script to verify MDX processing works
const { getAllArticles, getArticleBySlug } = require('./src/lib/mdx.ts')

try {
  console.log('Testing MDX processing...')
  
  // Test getting all articles
  const articles = getAllArticles()
  console.log(`Found ${articles.length} articles`)
  
  if (articles.length > 0) {
    const firstArticle = articles[0]
    console.log('First article:', {
      slug: firstArticle.slug,
      title: firstArticle.title,
      author: firstArticle.author,
      readingTime: firstArticle.readingTime,
      tags: firstArticle.tags
    })
  }
  
  // Test getting article by slug
  const article = getArticleBySlug('sample-crypto-article')
  if (article) {
    console.log('Article found by slug:', article.title)
    console.log('Content preview:', article.content.substring(0, 100) + '...')
  }
  
  console.log('MDX processing test completed successfully!')
  
} catch (error) {
  console.error('Error testing MDX processing:', error.message)
}