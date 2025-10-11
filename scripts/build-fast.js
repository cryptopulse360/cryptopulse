#!/usr/bin/env node

/**
 * Fast Build Script
 * 
 * Runs Next.js build in fast mode with optimizations for speed
 */

const { execSync } = require('child_process');

// Set environment variables
process.env.DEPLOYMENT_MODE = 'fast';
process.env.SKIP_OG_GENERATION = 'true';

console.log('🚀 Starting fast build...');
console.log('⚡ Mode: fast (skipping OG images and heavy optimizations)');

try {
  // Run Next.js build
  execSync('npx next build', { stdio: 'inherit' });
  
  // Run build verification
  console.log('\n🔍 Verifying build output...');
  execSync('npm run build:verify', { stdio: 'inherit' });
  
  console.log('\n🎉 Fast build completed successfully!');
} catch (error) {
  console.error('\n❌ Fast build failed:', error.message);
  process.exit(1);
}