#!/usr/bin/env node

/**
 * Minimal Build Script
 * 
 * Runs Next.js build in minimal mode for emergency deployments
 */

const { execSync } = require('child_process');

// Set environment variables
process.env.DEPLOYMENT_MODE = 'minimal';
process.env.SKIP_OG_GENERATION = 'true';

console.log('🚀 Starting minimal build...');
console.log('⚡ Mode: minimal (emergency deployment mode)');

try {
  // Run Next.js build
  execSync('npx next build', { stdio: 'inherit' });
  
  // Run build verification
  console.log('\n🔍 Verifying build output...');
  execSync('npm run build:verify', { stdio: 'inherit' });
  
  console.log('\n🎉 Minimal build completed successfully!');
} catch (error) {
  console.error('\n❌ Minimal build failed:', error.message);
  process.exit(1);
}