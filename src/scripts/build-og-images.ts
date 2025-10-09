#!/usr/bin/env tsx

import { buildOGImages, cleanOGImages } from '../lib/build-og-images';

async function main() {
  try {
    console.log('🚀 Starting OG image generation...');
    
    // Clean up old images first
    await cleanOGImages();
    
    // Generate new images
    await buildOGImages();
    
    console.log('🎉 OG image generation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 OG image generation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();