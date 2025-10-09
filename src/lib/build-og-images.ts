import { getAllArticles } from './mdx';
import { generateArticleOGImage, generatePageOGImage } from './og-image';
import { siteConfig } from './constants';
import fs from 'fs/promises';
import path from 'path';

/**
 * Pre-generate OG images during build process for static export
 */
export async function buildOGImages() {
  console.log('🖼️  Generating Open Graph images...');
  
  try {
    // Ensure output directory exists
    const ogDir = path.join(process.cwd(), 'public', 'images', 'og');
    await fs.mkdir(ogDir, { recursive: true });
    
    // Generate OG images for all articles
    const articles = await getAllArticles();
    const imagePromises: Promise<void>[] = [];
    
    for (const article of articles) {
      const imagePromise = generateStaticOGImage(
        article.slug,
        {
          title: article.title,
          description: article.description,
          author: article.author,
          tags: article.tags,
        }
      );
      imagePromises.push(imagePromise);
    }
    
    // Generate OG images for main pages
    const pagePromises = [
      generateStaticOGImage('home', {
        title: siteConfig.name,
        description: siteConfig.description,
        author: siteConfig.author,
      }),
      generateStaticOGImage('articles', {
        title: 'All Articles',
        description: 'Browse all cryptocurrency articles and analysis',
        author: siteConfig.author,
      }),
      generateStaticOGImage('tags', {
        title: 'Browse by Tags',
        description: 'Explore articles by cryptocurrency topics and tags',
        author: siteConfig.author,
      }),
    ];
    
    // Wait for all images to be generated
    await Promise.all([...imagePromises, ...pagePromises]);
    
    console.log(`✅ Generated ${articles.length + 3} OG images`);
  } catch (error) {
    console.error('❌ Error generating OG images:', error);
    throw error;
  }
}

/**
 * Generate a static OG image file using SVG (fallback approach)
 */
async function generateStaticOGImage(
  filename: string,
  options: {
    title: string;
    description?: string;
    author?: string;
    tags?: string[];
  }
): Promise<void> {
  try {
    const ogPath = path.join(process.cwd(), 'public', 'images', 'og', `${filename}.svg`);
    
    // Generate SVG content
    const svgContent = generateOGImageSVG(options);
    
    // Save as SVG (can be converted to PNG later if needed)
    await fs.writeFile(ogPath, svgContent, 'utf-8');
    
    console.log(`✅ Generated OG image: ${filename}.svg`);
  } catch (error) {
    console.error(`❌ Error generating OG image for ${filename}:`, error);
    
    // Create a simple fallback
    await createFallbackOGImage(filename, options);
  }
}

/**
 * Generate SVG content for OG image
 */
function generateOGImageSVG(options: {
  title: string;
  description?: string;
  author?: string;
  tags?: string[];
}): string {
  const { title, description, author, tags } = options;
  
  // Truncate title if too long
  const displayTitle = title.length > 80 ? `${title.substring(0, 77)}...` : title;
  const titleFontSize = title.length > 60 ? 48 : 56;
  
  // Truncate description
  const displayDescription = description && description.length > 120 
    ? `${description.substring(0, 117)}...` 
    : description;
  
  // Generate tags HTML
  const tagsHTML = tags && tags.length > 0 
    ? tags.slice(0, 3).map((tag, index) => `
      <rect x="${1140 - (index + 1) * 120}" y="60" width="110" height="28" rx="6" fill="#1e40af"/>
      <text x="${1140 - (index + 1) * 120 + 55}" y="78" text-anchor="middle" fill="#dbeafe" font-size="14" font-weight="500">#${tag.trim()}</text>
    `).join('')
    : '';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Logo background -->
  <rect x="60" y="60" width="48" height="48" rx="12" fill="#f59e0b"/>
  
  <!-- Bitcoin symbol -->
  <text x="84" y="88" text-anchor="middle" fill="#0f172a" font-size="24" font-weight="bold">₿</text>
  
  <!-- Logo text -->
  <text x="124" y="88" fill="#f8fafc" font-size="28" font-weight="bold">CryptoPulse</text>
  
  <!-- Tags -->
  ${tagsHTML}
  
  <!-- Title -->
  <text x="60" y="250" fill="#f8fafc" font-size="${titleFontSize}" font-weight="bold">
    <tspan x="60" dy="0">${escapeXML(displayTitle)}</tspan>
  </text>
  
  <!-- Description -->
  ${displayDescription ? `
  <text x="60" y="320" fill="#cbd5e1" font-size="24">
    <tspan x="60" dy="0">${escapeXML(displayDescription)}</tspan>
  </text>
  ` : ''}
  
  <!-- Footer line -->
  <line x1="60" y1="540" x2="1140" y2="540" stroke="#334155" stroke-width="1"/>
  
  <!-- Author avatar -->
  ${author ? `
  <circle cx="76" cy="580" r="16" fill="#475569"/>
  <text x="76" y="586" text-anchor="middle" fill="#f8fafc" font-size="16">${author.charAt(0).toUpperCase()}</text>
  <text x="104" y="586" fill="#e2e8f0" font-size="18" font-weight="500">${escapeXML(author)}</text>
  ` : ''}
  
  <!-- Site URL -->
  <text x="1140" y="586" text-anchor="end" fill="#64748b" font-size="16">cryptopulse.news</text>
</svg>`;
}

/**
 * Escape XML special characters
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Create a simple fallback OG image
 */
async function createFallbackOGImage(filename: string, options: { title: string }): Promise<void> {
  try {
    const ogPath = path.join(process.cwd(), 'public', 'images', 'og', `${filename}.svg`);
    
    const fallbackSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f172a"/>
  <text x="600" y="315" text-anchor="middle" fill="#f8fafc" font-size="48" font-weight="bold">CryptoPulse</text>
  <text x="600" y="365" text-anchor="middle" fill="#cbd5e1" font-size="24">${escapeXML(options.title)}</text>
</svg>`;
    
    await fs.writeFile(ogPath, fallbackSVG, 'utf-8');
    
    console.log(`⚠️  Generated fallback OG image: ${filename}.svg`);
  } catch (error) {
    console.error(`❌ Failed to create fallback OG image for ${filename}:`, error);
  }
}

/**
 * Get static OG image path for an article
 */
export function getStaticOGImagePath(slug: string): string {
  return `/images/og/${slug}.svg`;
}

/**
 * Check if static OG image exists
 */
export async function staticOGImageExists(slug: string): Promise<boolean> {
  try {
    const ogPath = path.join(process.cwd(), 'public', 'images', 'og', `${slug}.svg`);
    await fs.access(ogPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean up old OG images
 */
export async function cleanOGImages(): Promise<void> {
  try {
    const ogDir = path.join(process.cwd(), 'public', 'images', 'og');
    const files = await fs.readdir(ogDir);
    
    for (const file of files) {
      if (file.endsWith('.svg') || file.endsWith('.png')) {
        await fs.unlink(path.join(ogDir, file));
      }
    }
    
    console.log('🧹 Cleaned up old OG images');
  } catch (error) {
    // Directory might not exist, which is fine
    console.log('📁 OG images directory not found, skipping cleanup');
  }
}