#!/usr/bin/env node

/**
 * Full Build Script
 * 
 * Runs Next.js build in full mode with all optimizations
 */

const { execSync } = require('child_process');

// Set environment variables
process.env.DEPLOYMENT_MODE = 'full';
process.env.SKIP_OG_GENERATION = 'false';

console.log('🚀 Starting full build...');
console.log('🔧 Mode: full (with OG images and all optimizations)');

try {
  // Generate OG images first
  console.log('\n🖼️ Generating OG images...');
  execSync('npm run build:og', { stdio: 'inherit' });
  
  // Run Next.js build
  console.log('\n📦 Building application...');
  execSync('npx next build', { stdio: 'inherit' });
  
  // Run build verification
  console.log('\n🔍 Verifying build output...');
  execSync('npm run build:verify', { stdio: 'inherit' });
  
  console.log('\n🎉 Full build completed successfully!');
} catch (error) {
  console.error('\n❌ Full build failed:', error.message);
  process.exit(1);
}