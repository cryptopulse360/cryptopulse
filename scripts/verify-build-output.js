#!/usr/bin/env node

/**
 * Build Output Verification Script
 * 
 * This script verifies that the build output is complete and valid
 * before deployment. It checks for essential files, validates HTML
 * structure, and ensures the build meets deployment requirements.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = path.join(process.cwd(), 'out');
const DEPLOYMENT_MODE = process.env.DEPLOYMENT_MODE || 'full';

/**
 * Check if essential files exist
 */
function checkEssentialFiles() {
  console.log('📁 Checking essential files...');
  
  const essentialFiles = [
    'index.html',
    '_next/static',
    'articles/index.html',
    'tags/index.html',
    'about/index.html',
    'sitemap.xml',
    'rss.xml'
  ];

  const results = [];
  
  for (const file of essentialFiles) {
    const filePath = path.join(OUTPUT_DIR, file);
    const exists = fs.existsSync(filePath);
    
    results.push({ file, exists });
    
    if (exists) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file}`);
    }
  }

  const missingFiles = results.filter(r => !r.exists);
  const success = missingFiles.length === 0;

  if (!success) {
    console.log(`⚠️ Missing ${missingFiles.length} essential files`);
  }

  return { success, results, missingFiles: missingFiles.map(f => f.file) };
}

/**
 * Validate HTML files
 */
function validateHTMLFiles() {
  console.log('🔍 Validating HTML files...');
  
  const htmlFiles = [
    'index.html',
    'articles/index.html',
    'tags/index.html',
    'about/index.html'
  ];

  const results = [];

  for (const htmlFile of htmlFiles) {
    const filePath = path.join(OUTPUT_DIR, htmlFile);
    
    if (!fs.existsSync(filePath)) {
      results.push({ file: htmlFile, valid: false, error: 'File not found' });
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Basic HTML validation
      const checks = [
        { name: 'DOCTYPE', test: /<!DOCTYPE html>/i },
        { name: 'HTML tag', test: /<html[^>]*>/i },
        { name: 'Head section', test: /<head[^>]*>.*<\/head>/is },
        { name: 'Body section', test: /<body[^>]*>.*<\/body>/is },
        { name: 'Title tag', test: /<title[^>]*>.*<\/title>/is },
        { name: 'Minimum content', test: content.length > 500 }
      ];

      const failedChecks = checks.filter(check => !check.test.test(content));
      const valid = failedChecks.length === 0;

      results.push({
        file: htmlFile,
        valid,
        size: content.length,
        failedChecks: failedChecks.map(c => c.name)
      });

      if (valid) {
        console.log(`  ✅ ${htmlFile} (${content.length} bytes)`);
      } else {
        console.log(`  ❌ ${htmlFile} - Failed: ${failedChecks.map(c => c.name).join(', ')}`);
      }

    } catch (error) {
      results.push({ file: htmlFile, valid: false, error: error.message });
      console.log(`  ❌ ${htmlFile} - Error: ${error.message}`);
    }
  }

  const validFiles = results.filter(r => r.valid).length;
  const success = validFiles === results.length;

  console.log(`📊 HTML validation: ${validFiles}/${results.length} files valid`);

  return { success, results };
}

/**
 * Check static assets
 */
function checkStaticAssets() {
  console.log('🖼️ Checking static assets...');
  
  const staticDir = path.join(OUTPUT_DIR, '_next', 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.log('❌ Static assets directory not found');
    return { success: false, error: 'Static directory missing' };
  }

  try {
    const stats = fs.statSync(staticDir);
    if (!stats.isDirectory()) {
      console.log('❌ Static path is not a directory');
      return { success: false, error: 'Static path invalid' };
    }

    // Check for CSS and JS files
    const files = fs.readdirSync(staticDir, { recursive: true });
    const cssFiles = files.filter(f => f.toString().endsWith('.css'));
    const jsFiles = files.filter(f => f.toString().endsWith('.js'));

    console.log(`  📄 CSS files: ${cssFiles.length}`);
    console.log(`  📄 JS files: ${jsFiles.length}`);

    // In minimal mode, we might have fewer assets
    const minExpectedAssets = DEPLOYMENT_MODE === 'minimal' ? 1 : 3;
    const success = (cssFiles.length + jsFiles.length) >= minExpectedAssets;

    if (success) {
      console.log('✅ Static assets check passed');
    } else {
      console.log(`⚠️ Expected at least ${minExpectedAssets} static assets`);
    }

    return {
      success,
      cssFiles: cssFiles.length,
      jsFiles: jsFiles.length,
      totalAssets: cssFiles.length + jsFiles.length
    };

  } catch (error) {
    console.log(`❌ Error checking static assets: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Check build size and performance
 */
function checkBuildMetrics() {
  console.log('📊 Checking build metrics...');
  
  try {
    // Calculate total build size
    function getDirectorySize(dirPath) {
      let totalSize = 0;
      
      if (!fs.existsSync(dirPath)) return 0;
      
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        
        if (file.isDirectory()) {
          totalSize += getDirectorySize(filePath);
        } else {
          totalSize += fs.statSync(filePath).size;
        }
      }
      
      return totalSize;
    }

    const buildSize = getDirectorySize(OUTPUT_DIR);
    const buildSizeMB = (buildSize / (1024 * 1024)).toFixed(2);

    console.log(`  📦 Total build size: ${buildSizeMB} MB`);

    // Size thresholds based on deployment mode
    const sizeThresholds = {
      minimal: 50, // 50 MB
      fast: 100,   // 100 MB
      full: 200    // 200 MB
    };

    const threshold = sizeThresholds[DEPLOYMENT_MODE] || sizeThresholds.full;
    const sizeOk = buildSize < (threshold * 1024 * 1024);

    if (sizeOk) {
      console.log(`✅ Build size within ${threshold}MB limit`);
    } else {
      console.log(`⚠️ Build size exceeds ${threshold}MB limit`);
    }

    return {
      success: sizeOk,
      buildSize,
      buildSizeMB: parseFloat(buildSizeMB),
      threshold
    };

  } catch (error) {
    console.log(`❌ Error checking build metrics: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main verification function
 */
function verifyBuildOutput() {
  console.log('🔍 Starting build output verification...\n');
  console.log(`📋 Deployment mode: ${DEPLOYMENT_MODE}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error('❌ Build output directory not found');
    console.error('💡 Make sure to run the build command first');
    return false;
  }

  const results = {
    deploymentMode: DEPLOYMENT_MODE,
    timestamp: new Date().toISOString(),
    checks: {}
  };

  // Run all verification checks
  results.checks.essentialFiles = checkEssentialFiles();
  console.log();
  
  results.checks.htmlValidation = validateHTMLFiles();
  console.log();
  
  results.checks.staticAssets = checkStaticAssets();
  console.log();
  
  results.checks.buildMetrics = checkBuildMetrics();
  console.log();

  // Determine overall success
  const allChecks = Object.values(results.checks);
  const overallSuccess = allChecks.every(check => check.success);

  // Summary
  console.log('📊 Verification Summary:');
  console.log(`  Essential Files: ${results.checks.essentialFiles.success ? '✅' : '❌'}`);
  console.log(`  HTML Validation: ${results.checks.htmlValidation.success ? '✅' : '❌'}`);
  console.log(`  Static Assets: ${results.checks.staticAssets.success ? '✅' : '❌'}`);
  console.log(`  Build Metrics: ${results.checks.buildMetrics.success ? '✅' : '❌'}`);

  if (overallSuccess) {
    console.log('\n🎉 Build output verification passed!');
    console.log('✅ Build is ready for deployment');
  } else {
    console.log('\n⚠️ Build output verification failed');
    console.log('🔧 Please fix the issues above before deploying');
    
    // Provide specific guidance
    if (!results.checks.essentialFiles.success) {
      console.log('\n💡 Essential files missing - check your build configuration');
    }
    if (!results.checks.htmlValidation.success) {
      console.log('\n💡 HTML validation failed - check your page generation');
    }
    if (!results.checks.staticAssets.success) {
      console.log('\n💡 Static assets missing - check your asset bundling');
    }
    if (!results.checks.buildMetrics.success) {
      console.log('\n💡 Build size too large - consider optimizing assets');
    }
  }

  // Save results for CI/CD
  try {
    fs.writeFileSync('build-verification.json', JSON.stringify(results, null, 2));
    console.log('\n📄 Results saved to build-verification.json');
  } catch (error) {
    console.log(`\n⚠️ Could not save results: ${error.message}`);
  }

  return overallSuccess;
}

// Run verification if called directly
if (require.main === module) {
  const success = verifyBuildOutput();
  process.exit(success ? 0 : 1);
}

module.exports = { verifyBuildOutput };