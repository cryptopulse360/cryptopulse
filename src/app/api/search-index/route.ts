import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/mdx';
import { createSearchIndex, generateSearchData } from '@/lib/search';

export async function GET() {
  try {
    // Get all articles
    const articles = await getAllArticles();
    
    // Generate search data
    const searchData = generateSearchData(articles);
    
    // Create search index
    const index = createSearchIndex(articles);
    
    // Return serialized index and data
    return NextResponse.json({
      index: index.toJSON(),
      data: searchData,
    });
  } catch (error) {
    console.error('Failed to generate search index:', error);
    
    // Return empty index as fallback
    return NextResponse.json({
      index: null,
      data: [],
    }, { status: 500 });
  }
}