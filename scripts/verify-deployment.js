#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that a deployment was successful by checking:
 * - Site accessibility
 * - Basic functionality
 * - CNAME and custom domain validation
 * - Essential pages and assets
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const TIMEOUT = 30000; // 30 seconds
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Make HTTP request with timeout and retries
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const timeout = options.timeout || TIMEOUT;

    const req = protocol.get(url, { timeout }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(timeout);
  });
}

/**
 * Retry function with exponential backoff
 */
async function withRetry(fn, attempts = RETRY_ATTEMPTS) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      
      const delay = RETRY_DELAY * Math.pow(2, i);
      console.log(`⏳ Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Check if site is accessible
 */
async function checkSiteAccessibility(url) {
  console.log(`🌐 Checking site accessibility: ${url}`);
  
  try {
    const response = await withRetry(() => makeRequest(url));
    
    if (response.statusCode === 200) {
      console.log('✅ Site is accessible');
      return { success: true, statusCode: response.statusCode };
    } else {
      console.log(`⚠️ Site returned status code: ${response.statusCode}`);
      return { success: false, statusCode: response.statusCode };
    }
  } catch (error) {
    console.log(`❌ Site accessibility check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Validate basic HTML structure
 */
async function validateBasicStructure(url) {
  console.log(`🔍 Validating basic HTML structure: ${url}`);
  
  try {
    const response = await withRetry(() => makeRequest(url));
    
    if (response.statusCode !== 200) {
      return { success: false, error: `HTTP ${response.statusCode}` };
    }

    const html = response.body;
    const checks = [
      { name: 'DOCTYPE', test: /<!DOCTYPE html>/i },
      { name: 'HTML tag', test: /<html[^>]*>/i },
      { name: 'Head section', test: /<head[^>]*>.*<\/head>/is },
      { name: 'Body section', test: /<body[^>]*>.*<\/body>/is },
      { name: 'Title tag', test: /<title[^>]*>.*<\/title>/is }
    ];

    const results = checks.map(check => ({
      name: check.name,
      passed: check.test.test(html)
    }));

    const allPassed = results.every(r => r.passed);
    
    if (allPassed) {
      console.log('✅ Basic HTML structure is valid');
    } else {
      console.log('⚠️ Some HTML structure checks failed:');
      results.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.name}: Failed`);
      });
    }

    return { success: allPassed, results };
  } catch (error) {
    console.log(`❌ HTML structure validation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Check essential pages
 */
async function checkEssentialPages(baseUrl) {
  console.log('📄 Checking essential pages...');
  
  const pages = [
    { path: '/', name: 'Home page', critical: true },
    { path: '/articles/', name: 'Articles page', critical: true },
    { path: '/tags/', name: 'Tags page', critical: false },
    { path: '/about/', name: 'About page', critical: false },
    { path: '/sitemap.xml', name: 'Sitemap', critical: false },
    { path: '/rss.xml', name: 'RSS feed', critical: false }
  ];

  const results = [];

  for (const page of pages) {
    const url = baseUrl.endsWith('/') ? baseUrl + page.path.slice(1) : baseUrl + page.path;
    try {
      const response = await makeRequest(url);
      const success = response.statusCode === 200;
      
      results.push({
        path: page.path,
        name: page.name,
        critical: page.critical,
        success,
        statusCode: response.statusCode
      });

      if (success) {
        console.log(`  ✅ ${page.name} (${page.path})`);
      } else {
        const icon = page.critical ? '❌' : '⚠️';
        console.log(`  ${icon} ${page.name} (${page.path}) - Status: ${response.statusCode}`);
      }
    } catch (error) {
      results.push({
        path: page.path,
        name: page.name,
        critical: page.critical,
        success: false,
        error: error.message
      });
      
      const icon = page.critical ? '❌' : '⚠️';
      console.log(`  ${icon} ${page.name} (${page.path}) - Error: ${error.message}`);
    }
  }

  const totalPages = pages.length;
  const successCount = results.filter(r => r.success).length;
  const criticalPages = pages.filter(p => p.critical);
  const criticalSuccessCount = results.filter(r => r.critical && r.success).length;
  
  console.log(`📊 Essential pages: ${successCount}/${totalPages} accessible`);
  console.log(`🔥 Critical pages: ${criticalSuccessCount}/${criticalPages.length} accessible`);

  // Success if all critical pages work and at least 80% of total pages work
  const criticalSuccess = criticalSuccessCount === criticalPages.length;
  const overallSuccess = successCount >= Math.ceil(totalPages * 0.8);

  return {
    success: criticalSuccess && overallSuccess,
    results,
    successRate: successCount / totalPages,
    criticalSuccess,
    criticalSuccessRate: criticalSuccessCount / criticalPages.length
  };
}

/**
 * Check critical assets
 */
async function checkCriticalAssets(baseUrl) {
  console.log('🎨 Checking critical assets...');
  
  const assets = [
    { path: '/favicon.ico', name: 'Favicon', critical: false },
    { path: '/manifest.json', name: 'Web manifest', critical: false },
    { path: '/robots.txt', name: 'Robots.txt', critical: false }
  ];

  const results = [];

  for (const asset of assets) {
    const url = baseUrl.endsWith('/') ? baseUrl + asset.path.slice(1) : baseUrl + asset.path;
    try {
      const response = await makeRequest(url);
      const success = response.statusCode === 200;
      
      results.push({
        path: asset.path,
        name: asset.name,
        success,
        statusCode: response.statusCode
      });

      if (success) {
        console.log(`  ✅ ${asset.name}`);
      } else {
        console.log(`  ℹ️ ${asset.name} (${response.statusCode}) - Optional asset`);
      }
    } catch (error) {
      results.push({
        path: asset.path,
        name: asset.name,
        success: false,
        error: error.message
      });
      console.log(`  ℹ️ ${asset.name} - Not found (optional)`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`📊 Assets found: ${successCount}/${assets.length}`);

  return {
    success: true, // Assets are optional, so always return success
    results,
    successRate: successCount / assets.length
  };
}

/**
 * Validate CNAME configuration
 */
async function validateCNAME(baseUrl) {
  console.log('🔗 Validating CNAME configuration...');
  
  // Check if CNAME file exists in build output
  const cnamePath = path.join(process.cwd(), 'out', 'CNAME');
  
  if (!fs.existsSync(cnamePath)) {
    console.log('ℹ️ No CNAME file found - using GitHub Pages default domain');
    return { success: true, customDomain: false };
  }

  try {
    const customDomain = fs.readFileSync(cnamePath, 'utf8').trim();
    console.log(`🔗 Custom domain configured: ${customDomain}`);

    // Try to access the site via custom domain
    const customUrl = `https://${customDomain}`;
    
    try {
      const response = await makeRequest(customUrl);
      if (response.statusCode === 200) {
        console.log('✅ Custom domain is accessible');
        return { success: true, customDomain: true, domain: customDomain };
      } else {
        console.log(`⚠️ Custom domain returned status: ${response.statusCode}`);
        console.log('ℹ️ DNS propagation may still be in progress');
        return { success: true, customDomain: true, domain: customDomain, warning: 'DNS propagation pending' };
      }
    } catch (error) {
      console.log(`⚠️ Custom domain not yet accessible: ${error.message}`);
      console.log('ℹ️ This is normal for new domains - DNS propagation can take up to 24 hours');
      return { success: true, customDomain: true, domain: customDomain, warning: 'DNS propagation pending' };
    }
  } catch (error) {
    console.log(`❌ Error reading CNAME file: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Get deployment URL from various sources
 */
function getDeploymentUrl() {
  // Priority order for URL detection:
  // 1. Explicit DEPLOYMENT_URL environment variable
  // 2. GitHub Pages URL from deployment output
  // 3. Constructed from GITHUB_REPOSITORY
  // 4. Check for CNAME file to determine custom domain
  // 5. Fallback to localhost for local testing

  if (process.env.DEPLOYMENT_URL) {
    return process.env.DEPLOYMENT_URL;
  }

  if (process.env.GITHUB_PAGES_URL) {
    return process.env.GITHUB_PAGES_URL;
  }

  // Check for custom domain in CNAME file
  const cnamePath = path.join(process.cwd(), 'out', 'CNAME');
  if (fs.existsSync(cnamePath)) {
    try {
      const customDomain = fs.readFileSync(cnamePath, 'utf8').trim();
      if (customDomain && !customDomain.startsWith('#')) {
        return `https://${customDomain}`;
      }
    } catch (error) {
      console.log(`⚠️ Could not read CNAME file: ${error.message}`);
    }
  }

  // Construct from GitHub repository
  if (process.env.GITHUB_REPOSITORY) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    if (repo === `${owner}.github.io`) {
      return `https://${owner}.github.io`;
    } else {
      return `https://${owner}.github.io/${repo}`;
    }
  }

  // Fallback for local testing
  if (process.env.NODE_ENV !== 'production') {
    console.log('ℹ️ No deployment URL found, using localhost for local testing');
    return 'http://localhost:3000';
  }

  return null;
}

/**
 * Main verification function
 */
async function verifyDeployment() {
  console.log('🚀 Starting deployment verification...\n');

  const deploymentUrl = getDeploymentUrl();

  if (!deploymentUrl) {
    console.log('❌ Could not determine deployment URL');
    console.log('💡 Please set one of the following environment variables:');
    console.log('   - DEPLOYMENT_URL: Direct URL to verify');
    console.log('   - GITHUB_PAGES_URL: GitHub Pages deployment URL');
    console.log('   - GITHUB_REPOSITORY: Repository name (owner/repo)');
    console.log('   Or ensure CNAME file exists in ./out/ directory');
    process.exit(1);
  }

  console.log(`🎯 Target URL: ${deploymentUrl}`);
  
  // Show deployment context
  if (process.env.GITHUB_REPOSITORY) {
    console.log(`📦 Repository: ${process.env.GITHUB_REPOSITORY}`);
  }
  if (process.env.GITHUB_REF_NAME) {
    console.log(`🌿 Branch: ${process.env.GITHUB_REF_NAME}`);
  }
  if (process.env.DEPLOYMENT_MODE) {
    console.log(`⚡ Mode: ${process.env.DEPLOYMENT_MODE}`);
  }
  console.log('');

  const results = {
    url: deploymentUrl,
    timestamp: new Date().toISOString(),
    checks: {}
  };

  // Run all verification checks
  try {
    results.checks.accessibility = await checkSiteAccessibility(deploymentUrl);
    results.checks.htmlStructure = await validateBasicStructure(deploymentUrl);
    results.checks.essentialPages = await checkEssentialPages(deploymentUrl);
    results.checks.assets = await checkCriticalAssets(deploymentUrl);
    results.checks.cname = await validateCNAME();

    // Overall success determination
    const criticalChecks = [
      results.checks.accessibility.success,
      results.checks.htmlStructure.success,
      results.checks.essentialPages.success,
      results.checks.cname.success
    ];

    const overallSuccess = criticalChecks.every(check => check === true);

    console.log('\n📊 Verification Summary:');
    console.log(`  🌐 Site Accessibility: ${results.checks.accessibility.success ? '✅' : '❌'}`);
    console.log(`  📄 HTML Structure: ${results.checks.htmlStructure.success ? '✅' : '❌'}`);
    console.log(`  📋 Essential Pages: ${results.checks.essentialPages.success ? '✅' : '❌'} (${Math.round(results.checks.essentialPages.successRate * 100)}% success)`);
    console.log(`  🎨 Critical Assets: ${results.checks.assets.success ? '✅' : '❌'} (${Math.round(results.checks.assets.successRate * 100)}% found)`);
    console.log(`  🔗 CNAME Config: ${results.checks.cname.success ? '✅' : '❌'}`);

    // Additional details for failed checks
    if (!results.checks.essentialPages.success) {
      console.log(`     Critical pages: ${Math.round(results.checks.essentialPages.criticalSuccessRate * 100)}% accessible`);
    }

    if (overallSuccess) {
      console.log('\n🎉 Deployment verification completed successfully!');
      console.log(`🌐 Your site is live at: ${deploymentUrl}`);
      
      if (results.checks.cname.customDomain) {
        console.log(`🔗 Custom domain: https://${results.checks.cname.domain}`);
        if (results.checks.cname.warning) {
          console.log(`ℹ️ Note: ${results.checks.cname.warning}`);
        }
      }

      // Show performance summary
      const totalChecks = Object.keys(results.checks).length;
      const passedChecks = Object.values(results.checks).filter(check => check.success).length;
      console.log(`\n📈 Overall Score: ${passedChecks}/${totalChecks} checks passed`);
      
    } else {
      console.log('\n⚠️ Deployment verification completed with issues');
      console.log('🔍 Failed checks require attention:');
      
      if (!results.checks.accessibility.success) {
        console.log('   - Site is not accessible - check URL and network connectivity');
      }
      if (!results.checks.htmlStructure.success) {
        console.log('   - HTML structure validation failed - check build output');
      }
      if (!results.checks.essentialPages.success) {
        console.log('   - Essential pages are not accessible - check routing and build');
      }
      if (!results.checks.cname.success) {
        console.log('   - CNAME configuration has issues - check custom domain setup');
      }
      
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Verify the deployment completed successfully');
      console.log('   - Check GitHub Pages settings in repository');
      console.log('   - Ensure DNS is properly configured for custom domains');
      console.log('   - Try accessing the site manually in a browser');
    }

    // Save results for CI/CD
    const outputFile = 'deployment-verification.json';
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`\n📄 Detailed results saved to: ${outputFile}`);
    
    process.exit(overallSuccess ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Deployment verification failed with error:', error.message);
    process.exit(1);
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--url' && i + 1 < args.length) {
      options.url = args[i + 1];
      i++; // Skip next argument as it's the URL value
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--local') {
      options.local = true;
    } else if (arg.startsWith('http')) {
      // Direct URL argument
      options.url = arg;
    }
  }

  return options;
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
🚀 Deployment Verification Script

Usage:
  node scripts/verify-deployment.js [options] [url]

Options:
  --url <url>     Specify the URL to verify
  --local         Test against localhost:3000
  --help, -h      Show this help message

Examples:
  node scripts/verify-deployment.js --url https://mysite.github.io
  node scripts/verify-deployment.js https://example.com
  node scripts/verify-deployment.js --local
  node scripts/verify-deployment.js  # Auto-detect from environment

Environment Variables:
  DEPLOYMENT_URL      Direct URL to verify
  GITHUB_PAGES_URL    GitHub Pages deployment URL  
  GITHUB_REPOSITORY   Repository name (owner/repo)
  DEPLOYMENT_MODE     Deployment mode (fast/full)
`);
}

// Run verification if called directly
if (require.main === module) {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // Override URL if specified via CLI
  if (options.url) {
    process.env.DEPLOYMENT_URL = options.url;
  } else if (options.local) {
    process.env.DEPLOYMENT_URL = 'http://localhost:3000';
    process.env.NODE_ENV = 'development';
  }

  verifyDeployment().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { verifyDeployment };