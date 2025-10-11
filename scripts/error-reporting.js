#!/usr/bin/env node

/**
 * Error Reporting and Troubleshooting Script
 * 
 * Provides comprehensive error analysis and troubleshooting guidance
 * for deployment failures with actionable recovery steps.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Error categories and their troubleshooting steps
const ERROR_CATEGORIES = {
  BUILD_FAILURE: {
    name: 'Build Failure',
    patterns: [
      /build.*failed/i,
      /compilation.*error/i,
      /syntax.*error/i,
      /module.*not.*found/i,
      /cannot.*resolve/i,
      /typescript.*error/i
    ],
    troubleshooting: [
      'Check for syntax errors in your code',
      'Verify all dependencies are installed (npm ci)',
      'Check TypeScript configuration and types',
      'Try building locally first (npm run build)',
      'Check for missing or incorrect imports',
      'Verify environment variables are set correctly'
    ],
    recovery: [
      'Run npm run build:minimal for emergency deployment',
      'Use SKIP_TYPE_CHECK=true to bypass TypeScript errors',
      'Check recent commits for breaking changes',
      'Revert to last known working commit if needed'
    ]
  },

  MEMORY_ERROR: {
    name: 'Memory/Resource Error',
    patterns: [
      /out.*of.*memory/i,
      /heap.*out.*of.*memory/i,
      /javascript.*heap.*out.*of.*memory/i,
      /killed.*signal.*9/i,
      /process.*out.*of.*memory/i
    ],
    troubleshooting: [
      'Build is consuming too much memory',
      'Try using build:minimal or build:emergency modes',
      'Check for memory leaks in build process',
      'Reduce concurrent build processes',
      'Clear build cache (rm -rf .next)'
    ],
    recovery: [
      'Use NODE_OPTIONS="--max-old-space-size=2048" for smaller memory limit',
      'Run npm run build:emergency for minimal memory usage',
      'Split build into smaller chunks if possible',
      'Use build:basic mode as last resort'
    ]
  },

  NETWORK_ERROR: {
    name: 'Network/Connectivity Error',
    patterns: [
      /network.*error/i,
      /econnreset/i,
      /enotfound/i,
      /econnrefused/i,
      /timeout/i,
      /socket.*hang.*up/i,
      /request.*timeout/i,
      /dns.*error/i
    ],
    troubleshooting: [
      'Check internet connectivity',
      'Verify npm registry is accessible',
      'Check for firewall or proxy issues',
      'Try using different npm registry',
      'Check GitHub API status'
    ],
    recovery: [
      'Retry the deployment (network issues are often temporary)',
      'Use npm ci --prefer-offline to use cached packages',
      'Check GitHub status page for service issues',
      'Wait a few minutes and try again'
    ]
  },

  GITHUB_PAGES_ERROR: {
    name: 'GitHub Pages Deployment Error',
    patterns: [
      /pages.*deployment.*failed/i,
      /github.*pages.*error/i,
      /artifact.*upload.*failed/i,
      /deploy.*pages.*failed/i,
      /pages.*build.*failed/i
    ],
    troubleshooting: [
      'Check GitHub Pages is enabled in repository settings',
      'Verify repository has proper permissions',
      'Check if custom domain DNS is configured correctly',
      'Ensure CNAME file is properly formatted',
      'Check GitHub Pages service status'
    ],
    recovery: [
      'Try deploying again (GitHub Pages issues are often temporary)',
      'Check repository settings > Pages configuration',
      'Verify workflow permissions include pages: write',
      'Remove custom domain temporarily if DNS issues persist'
    ]
  },

  DEPENDENCY_ERROR: {
    name: 'Dependency/Package Error',
    patterns: [
      /npm.*error/i,
      /package.*not.*found/i,
      /dependency.*error/i,
      /module.*resolution.*failed/i,
      /peer.*dependency/i,
      /version.*conflict/i
    ],
    troubleshooting: [
      'Check package.json for correct dependencies',
      'Verify package-lock.json is not corrupted',
      'Check for peer dependency warnings',
      'Ensure Node.js version compatibility',
      'Check for conflicting package versions'
    ],
    recovery: [
      'Delete node_modules and package-lock.json, then npm install',
      'Use npm ci --legacy-peer-deps if peer dependency issues',
      'Check if specific package versions need to be pinned',
      'Try npm audit fix for security vulnerabilities'
    ]
  },

  TIMEOUT_ERROR: {
    name: 'Timeout Error',
    patterns: [
      /timeout/i,
      /timed.*out/i,
      /operation.*timeout/i,
      /request.*timeout/i,
      /build.*timeout/i
    ],
    troubleshooting: [
      'Build process is taking too long',
      'Check for infinite loops or hanging processes',
      'Verify system resources are available',
      'Check for slow network connections',
      'Look for blocking operations in build'
    ],
    recovery: [
      'Use faster build modes (build:fast or build:minimal)',
      'Increase timeout limits in workflow',
      'Split large builds into smaller parts',
      'Check for and remove blocking operations'
    ]
  },

  PERMISSION_ERROR: {
    name: 'Permission/Access Error',
    patterns: [
      /permission.*denied/i,
      /access.*denied/i,
      /forbidden/i,
      /unauthorized/i,
      /eacces/i,
      /eperm/i
    ],
    troubleshooting: [
      'Check repository permissions',
      'Verify GitHub token has correct scopes',
      'Check workflow permissions configuration',
      'Ensure GitHub Pages is enabled',
      'Verify branch protection rules'
    ],
    recovery: [
      'Check repository settings > Actions > General permissions',
      'Ensure workflow has pages: write and id-token: write permissions',
      'Verify GitHub Pages source is set to GitHub Actions',
      'Check if organization policies are blocking deployment'
    ]
  }
};

/**
 * Analyze error message and categorize it
 */
function analyzeError(errorMessage) {
  const message = errorMessage.toLowerCase();
  const categories = [];

  for (const [key, category] of Object.entries(ERROR_CATEGORIES)) {
    const matches = category.patterns.some(pattern => pattern.test(message));
    if (matches) {
      categories.push({
        type: key,
        ...category
      });
    }
  }

  return categories;
}

/**
 * Generate troubleshooting report
 */
function generateTroubleshootingReport(error, context = {}) {
  const timestamp = new Date().toISOString();
  const categories = analyzeError(error.message || error.toString());
  
  const report = {
    timestamp,
    error: {
      message: error.message || error.toString(),
      stack: error.stack,
      code: error.code
    },
    context: {
      repository: process.env.GITHUB_REPOSITORY,
      branch: process.env.GITHUB_REF_NAME,
      commit: process.env.GITHUB_SHA,
      workflow: process.env.GITHUB_WORKFLOW,
      deploymentMode: process.env.DEPLOYMENT_MODE,
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      ...context
    },
    analysis: {
      categories: categories.map(cat => cat.type),
      primaryCategory: categories[0]?.type || 'UNKNOWN',
      confidence: categories.length > 0 ? 'HIGH' : 'LOW'
    },
    troubleshooting: categories.length > 0 ? categories[0].troubleshooting : [
      'Error type not recognized - check logs for specific details',
      'Try running the command locally to reproduce the issue',
      'Check recent changes that might have caused the failure',
      'Consult documentation for the specific tool or service'
    ],
    recovery: categories.length > 0 ? categories[0].recovery : [
      'Try running the deployment again',
      'Check for temporary service outages',
      'Revert to last known working state',
      'Contact support if issue persists'
    ]
  };

  return report;
}

/**
 * Format troubleshooting report for console output
 */
function formatConsoleReport(report) {
  const lines = [];
  
  lines.push('');
  lines.push('🚨 DEPLOYMENT ERROR ANALYSIS');
  lines.push('═'.repeat(50));
  lines.push('');
  
  // Error summary
  lines.push('📋 Error Summary:');
  lines.push(`   Message: ${report.error.message}`);
  if (report.error.code) {
    lines.push(`   Code: ${report.error.code}`);
  }
  lines.push('');
  
  // Context information
  lines.push('🔍 Context:');
  if (report.context.repository) {
    lines.push(`   Repository: ${report.context.repository}`);
  }
  if (report.context.branch) {
    lines.push(`   Branch: ${report.context.branch}`);
  }
  if (report.context.deploymentMode) {
    lines.push(`   Deployment Mode: ${report.context.deploymentMode}`);
  }
  lines.push(`   Platform: ${report.context.platform} (${report.context.arch})`);
  lines.push(`   Node.js: ${report.context.nodeVersion}`);
  lines.push('');
  
  // Analysis
  lines.push('🎯 Analysis:');
  lines.push(`   Primary Category: ${report.analysis.primaryCategory}`);
  lines.push(`   Confidence: ${report.analysis.confidence}`);
  if (report.analysis.categories.length > 1) {
    lines.push(`   Other Categories: ${report.analysis.categories.slice(1).join(', ')}`);
  }
  lines.push('');
  
  // Troubleshooting steps
  lines.push('🔧 Troubleshooting Steps:');
  report.troubleshooting.forEach((step, index) => {
    lines.push(`   ${index + 1}. ${step}`);
  });
  lines.push('');
  
  // Recovery actions
  lines.push('🚑 Recovery Actions:');
  report.recovery.forEach((action, index) => {
    lines.push(`   ${index + 1}. ${action}`);
  });
  lines.push('');
  
  // Additional help
  lines.push('💡 Additional Help:');
  lines.push('   • Check GitHub Actions logs for detailed error information');
  lines.push('   • Review recent commits for potential breaking changes');
  lines.push('   • Test the build locally before pushing to main branch');
  lines.push('   • Consider using a fallback build mode for emergency deployments');
  lines.push('');
  
  // Quick commands
  lines.push('⚡ Quick Recovery Commands:');
  lines.push('   npm run build:minimal     # Minimal build for emergency deployment');
  lines.push('   npm run build:emergency   # Ultra-fast emergency build');
  lines.push('   npm run deploy:verify     # Verify current deployment status');
  lines.push('');
  
  lines.push('═'.repeat(50));
  
  return lines.join('\n');
}

/**
 * Save error report to file
 */
function saveErrorReport(report, filename = null) {
  if (!filename) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    filename = `error-report-${timestamp}.json`;
  }
  
  fs.writeFileSync(filename, JSON.stringify(report, null, 2));
  return filename;
}

/**
 * Generate GitHub Actions error annotations
 */
function generateGitHubAnnotations(report) {
  const annotations = [];
  
  // Main error annotation
  annotations.push(`::error title=${report.analysis.primaryCategory}::${report.error.message}`);
  
  // Troubleshooting notice
  const troubleshootingText = report.troubleshooting.slice(0, 3).join('; ');
  annotations.push(`::notice title=Troubleshooting::${troubleshootingText}`);
  
  // Recovery notice
  const recoveryText = report.recovery.slice(0, 2).join('; ');
  annotations.push(`::notice title=Recovery Actions::${recoveryText}`);
  
  return annotations;
}

/**
 * Main error reporting function
 */
function reportError(error, context = {}) {
  try {
    // Generate comprehensive report
    const report = generateTroubleshootingReport(error, context);
    
    // Output to console
    console.log(formatConsoleReport(report));
    
    // Save detailed report
    const reportFile = saveErrorReport(report);
    console.log(`📄 Detailed error report saved to: ${reportFile}`);
    
    // Generate GitHub Actions annotations if in CI
    if (process.env.GITHUB_ACTIONS) {
      const annotations = generateGitHubAnnotations(report);
      annotations.forEach(annotation => console.log(annotation));
    }
    
    return report;
    
  } catch (reportingError) {
    console.error('❌ Error in error reporting system:', reportingError.message);
    console.error('Original error:', error.message || error.toString());
  }
}

/**
 * Wrap function with error reporting
 */
function withErrorReporting(fn, context = {}) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      reportError(error, context);
      throw error;
    }
  };
}

/**
 * Check system health and report potential issues
 */
function checkSystemHealth() {
  const issues = [];
  
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 18) {
    issues.push({
      type: 'warning',
      message: `Node.js version ${nodeVersion} is below recommended version 18+`
    });
  }
  
  // Check available memory
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
  
  if (memoryUsage > 90) {
    issues.push({
      type: 'error',
      message: `System memory usage is very high (${memoryUsage.toFixed(1)}%)`
    });
  } else if (memoryUsage > 80) {
    issues.push({
      type: 'warning',
      message: `System memory usage is high (${memoryUsage.toFixed(1)}%)`
    });
  }
  
  // Check disk space (if possible)
  try {
    const stats = fs.statSync(process.cwd());
    // Note: Getting actual disk space requires platform-specific code
    // This is a simplified check
  } catch (error) {
    issues.push({
      type: 'warning',
      message: 'Could not check disk space'
    });
  }
  
  // Check for common problematic files
  const problematicFiles = [
    'node_modules/.package-lock.json',
    '.next/cache',
    'out'
  ];
  
  problematicFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      if (stats.isDirectory()) {
        // Check directory size (simplified)
        issues.push({
          type: 'info',
          message: `Directory ${file} exists (consider cleaning if build issues occur)`
        });
      }
    }
  });
  
  return issues;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'health') {
    console.log('🏥 System Health Check');
    console.log('═'.repeat(30));
    
    const issues = checkSystemHealth();
    
    if (issues.length === 0) {
      console.log('✅ No issues detected');
    } else {
      issues.forEach(issue => {
        const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon} ${issue.message}`);
      });
    }
    
    process.exit(0);
  }
  
  if (command === 'test') {
    // Test error reporting with sample error
    const testError = new Error('Sample deployment error for testing');
    testError.code = 'TEST_ERROR';
    
    reportError(testError, {
      testMode: true,
      sampleContext: 'This is a test of the error reporting system'
    });
    
    process.exit(0);
  }
  
  if (command === 'help' || !command) {
    console.log(`
🚨 Error Reporting and Troubleshooting Script

Usage:
  node scripts/error-reporting.js <command>

Commands:
  health    Check system health and potential issues
  test      Test error reporting with sample error
  help      Show this help message

This script is typically used by other deployment scripts to provide
comprehensive error analysis and troubleshooting guidance.
`);
    process.exit(0);
  }
}

module.exports = {
  reportError,
  withErrorReporting,
  generateTroubleshootingReport,
  analyzeError,
  checkSystemHealth,
  ERROR_CATEGORIES
};