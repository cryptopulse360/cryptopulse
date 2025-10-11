#!/usr/bin/env tsx

import { buildOGImages, cleanOGImages } from '../lib/build-og-images';

async function main() {
  // Check if OG generation should be skipped
  if (process.env.SKIP_OG_GENERATION === 'true') {
    console.log('⚡ Skipping OG image generation (SKIP_OG_GENERATION=true)');
    process.exit(0);
  }

  // Check deployment mode
  const deploymentMode = process.env.DEPLOYMENT_MODE || 'full';
  if (deploymentMode === 'fast' || deploymentMode === 'minimal') {
    console.log(`⚡ Skipping OG image generation for ${deploymentMode} mode`);
    process.exit(0);
  }

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