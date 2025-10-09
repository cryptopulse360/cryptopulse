#!/usr/bin/env node

/**
 * Deployment Test Script
 * 
 * This script tests the deployment configuration and build process
 * to ensure everything is ready for GitHub Pages deployment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REQUIRED_FILES = [
  'public/.nojekyll',
  'public/robots.txt',
  'src/app/not-found.tsx',
  'next.config.js',
  'package.json',
  '.github/workflows/deploy.yml'
];

const BUILD_OUTPUT_FILES = [
  'out/index.html',
  'out/.nojekyll',
  'out/robots.txt',
  'out/404.html',
  'out/_next'
];

function checkRequiredFiles() {
  console.log('🔍 Checking required files...');
  
  const missingFiles = [];
  
  for (const file of REQUIRED_FILES) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
      missingFiles.push(file);
    }
  }
  
  return missingFiles.length === 0;
}

function testBuild() {
  console.log('\n🏗️ Testing build process...');
  
  try {
    // Clean previous build
    if (fs.existsSync('out')) {
      fs.rmSync('out', { recursive: true, force: true });
      console.log('🧹 Cleaned previous build');
    }
    
    // Run build
    console.log('📦 Running build...');
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build completed successfully');
    
    return true;
  } catch (error) {
    console.log('❌ Build failed:', error.message);
    return false;
  }
}

function checkBuildOutput() {
  console.log('\n📁 Checking build output...');
  
  if (!fs.existsSync('out')) {
    console.log('❌ Build output directory not found');
    return false;
  }
  
  const missingFiles = [];
  
  for (const file of BUILD_OUTPUT_FILES) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`⚠️ ${file} - Not found (may be optional)`);
      if (file.includes('index.html') || file.includes('404.html')) {
        missingFiles.push(file);
      }
    }
  }
  
  // Check for essential HTML files
  const htmlFiles = fs.readdirSync('out').filter(f => f.endsWith('.html'));
  console.log(`📄 Found ${htmlFiles.length} HTML files`);
  
  // Check for static assets
  const nextDir = path.join('out', '_next');
  if (fs.existsSync(nextDir)) {
    const staticFiles = fs.readdirSync(nextDir, { recursive: true });
    console.log(`📦 Found ${staticFiles.length} static assets`);
  }
  
  return missingFiles.length === 0;
}

function validateHTMLFiles() {
  console.log('\n🔍 Validating HTML files...');
  
  const htmlFiles = fs.readdirSync('out')
    .filter(f => f.endsWith('.html'))
    .slice(0, 5); // Check first 5 files
  
  let validFiles = 0;
  
  for (const file of htmlFiles) {
    const filePath = path.join('out', file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic HTML validation
    const hasDoctype = content.includes('<!DOCTYPE html>');
    const hasTitle = content.includes('<title>');
    const hasMetaCharset = content.includes('charset=');
    
    if (hasDoctype && hasTitle && hasMetaCharset) {
      console.log(`✅ ${file} - Valid HTML structure`);
      validFiles++;
    } else {
      console.log(`⚠️ ${file} - Missing HTML elements`);
    }
  }
  
  return validFiles === htmlFiles.length;
}

function checkDeploymentConfig() {
  console.log('\n⚙️ Checking deployment configuration...');
  
  // Check GitHub Actions workflow
  const workflowPath = '.github/workflows/deploy.yml';
  if (fs.existsSync(workflowPath)) {
    const workflow = fs.readFileSync(workflowPath, 'utf8');
    
    const hasPagesDeploy = workflow.includes('actions/deploy-pages');
    const hasStaticExport = workflow.includes('upload-pages-artifact');
    const hasProperPermissions = workflow.includes('pages: write');
    
    if (hasPagesDeploy && hasStaticExport && hasProperPermissions) {
      console.log('✅ GitHub Actions workflow configured correctly');
    } else {
      console.log('⚠️ GitHub Actions workflow may need updates');
      return false;
    }
  } else {
    console.log('❌ GitHub Actions workflow not found');
    return false;
  }
  
  // Check Next.js config
  const nextConfigPath = 'next.config.js';
  if (fs.existsSync(nextConfigPath)) {
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    
    const hasStaticExport = config.includes("output: 'export'");
    const hasTrailingSlash = config.includes('trailingSlash: true');
    
    if (hasStaticExport && hasTrailingSlash) {
      console.log('✅ Next.js configured for static export');
    } else {
      console.log('⚠️ Next.js configuration needs updates');
      return false;
    }
  }
  
  return true;
}

function generateReport() {
  console.log('\n📊 Deployment Test Report');
  console.log('=========================');
  
  const filesOk = checkRequiredFiles();
  const buildOk = testBuild();
  const outputOk = buildOk ? checkBuildOutput() : false;
  const htmlOk = outputOk ? validateHTMLFiles() : false;
  const configOk = checkDeploymentConfig();
  
  console.log('\n🎯 Test Results:');
  console.log(`Required Files: ${filesOk ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Build Process: ${buildOk ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Build Output: ${outputOk ? '✅ Pass' : '❌ Fail'}`);
  console.log(`HTML Validation: ${htmlOk ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Deployment Config: ${configOk ? '✅ Pass' : '❌ Fail'}`);
  
  const allPassed = filesOk && buildOk && outputOk && htmlOk && configOk;
  
  console.log('\n🚀 Deployment Readiness:');
  if (allPassed) {
    console.log('✅ All tests passed! Ready for GitHub Pages deployment.');
    console.log('\nNext steps:');
    console.log('1. Push changes to GitHub');
    console.log('2. Enable GitHub Pages in repository settings');
    console.log('3. Set source to "GitHub Actions"');
    console.log('4. Monitor the deployment in Actions tab');
  } else {
    console.log('❌ Some tests failed. Please fix the issues before deploying.');
  }
  
  return allPassed;
}

// Main execution
if (require.main === module) {
  console.log('🧪 CryptoPulse Deployment Test Suite');
  console.log('====================================');
  
  const success = generateReport();
  process.exit(success ? 0 : 1);
}

module.exports = {
  checkRequiredFiles,
  testBuild,
  checkBuildOutput,
  validateHTMLFiles,
  checkDeploymentConfig,
  generateReport
};