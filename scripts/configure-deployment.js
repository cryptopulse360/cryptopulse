#!/usr/bin/env node

/**
 * GitHub Pages Deployment Configuration Script
 * 
 * This script helps configure the repository for GitHub Pages deployment
 * with custom domain support and proper error handling.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILES = {
  CNAME: 'public/CNAME',
  NOJEKYLL: 'public/.nojekyll',
  PACKAGE_JSON: 'package.json',
  NEXT_CONFIG: 'next.config.js'
};

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

function validateCNAME() {
  console.log('🔍 Checking CNAME configuration...');
  
  if (!checkFileExists(CONFIG_FILES.CNAME)) {
    console.log('⚠️ CNAME file not found');
    return false;
  }
  
  const cnameContent = readFile(CONFIG_FILES.CNAME);
  if (!cnameContent) return false;
  
  // Check if CNAME has actual domain (not just comments)
  const hasCustomDomain = cnameContent
    .split('\n')
    .some(line => line.trim() && !line.trim().startsWith('#'));
  
  if (hasCustomDomain) {
    const domain = cnameContent
      .split('\n')
      .find(line => line.trim() && !line.trim().startsWith('#'))
      .trim();
    console.log(`✅ Custom domain configured: ${domain}`);
    return { configured: true, domain };
  } else {
    console.log('ℹ️ No custom domain configured (using GitHub Pages default)');
    return { configured: false };
  }
}

function validateNoJekyll() {
  console.log('🔍 Checking .nojekyll file...');
  
  if (checkFileExists(CONFIG_FILES.NOJEKYLL)) {
    console.log('✅ .nojekyll file exists');
    return true;
  } else {
    console.log('⚠️ .nojekyll file missing');
    return false;
  }
}

function validateNextConfig() {
  console.log('🔍 Checking Next.js configuration...');
  
  if (!checkFileExists(CONFIG_FILES.NEXT_CONFIG)) {
    console.log('❌ next.config.js not found');
    return false;
  }
  
  const configContent = readFile(CONFIG_FILES.NEXT_CONFIG);
  if (!configContent) return false;
  
  const hasStaticExport = configContent.includes("output: 'export'");
  const hasTrailingSlash = configContent.includes('trailingSlash: true');
  
  if (hasStaticExport && hasTrailingSlash) {
    console.log('✅ Next.js configured for static export');
    return true;
  } else {
    console.log('⚠️ Next.js configuration may need updates for GitHub Pages');
    return false;
  }
}

function validatePackageJson() {
  console.log('🔍 Checking package.json scripts...');
  
  if (!checkFileExists(CONFIG_FILES.PACKAGE_JSON)) {
    console.log('❌ package.json not found');
    return false;
  }
  
  const packageContent = readFile(CONFIG_FILES.PACKAGE_JSON);
  if (!packageContent) return false;
  
  try {
    const packageJson = JSON.parse(packageContent);
    const scripts = packageJson.scripts || {};
    
    const hasBuild = scripts.build;
    const hasExport = scripts.export || scripts.build?.includes('next build');
    
    if (hasBuild) {
      console.log('✅ Build script configured');
      return true;
    } else {
      console.log('⚠️ Build script missing or misconfigured');
      return false;
    }
  } catch (error) {
    console.log('❌ Error parsing package.json:', error.message);
    return false;
  }
}

function checkGitHubPagesSetup() {
  console.log('\n📋 GitHub Pages Setup Checklist:');
  console.log('');
  console.log('1. Repository Settings:');
  console.log('   - Go to Settings > Pages');
  console.log('   - Set Source to "GitHub Actions"');
  console.log('   - Enable "Enforce HTTPS"');
  console.log('');
  console.log('2. Branch Protection (Recommended):');
  console.log('   - Go to Settings > Branches');
  console.log('   - Add rule for "main" branch');
  console.log('   - Enable "Require status checks to pass"');
  console.log('');
  console.log('3. Custom Domain (Optional):');
  console.log('   - Update public/CNAME with your domain');
  console.log('   - Configure DNS records:');
  console.log('     • A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153');
  console.log('     • Or CNAME record: username.github.io');
  console.log('');
}

function generateDeploymentSummary() {
  console.log('\n📊 Deployment Configuration Summary:');
  console.log('=====================================');
  
  const cname = validateCNAME();
  const nojekyll = validateNoJekyll();
  const nextConfig = validateNextConfig();
  const packageJson = validatePackageJson();
  
  console.log('\n🎯 Configuration Status:');
  console.log(`CNAME: ${cname.configured ? '✅ Configured' : '⚪ Default'}`);
  console.log(`NoJekyll: ${nojekyll ? '✅ Present' : '❌ Missing'}`);
  console.log(`Next.js Config: ${nextConfig ? '✅ Valid' : '⚠️ Check needed'}`);
  console.log(`Package Scripts: ${packageJson ? '✅ Valid' : '⚠️ Check needed'}`);
  
  const allValid = nojekyll && nextConfig && packageJson;
  
  console.log('\n🚀 Deployment Readiness:');
  if (allValid) {
    console.log('✅ Ready for deployment!');
    console.log('Push to main branch to trigger automatic deployment.');
  } else {
    console.log('⚠️ Some configuration issues detected.');
    console.log('Please review the warnings above before deploying.');
  }
  
  checkGitHubPagesSetup();
  
  return allValid;
}

// Main execution
if (require.main === module) {
  console.log('🚀 CryptoPulse GitHub Pages Deployment Configuration');
  console.log('==================================================');
  
  generateDeploymentSummary();
}

module.exports = {
  validateCNAME,
  validateNoJekyll,
  validateNextConfig,
  validatePackageJson,
  generateDeploymentSummary
};