#!/usr/bin/env node

/**
 * Deployment Error Handler Integration Script
 * 
 * Orchestrates error handling, retry logic, and recovery mechanisms
 * for the streamlined deployment workflow.
 */

const { reportError, withErrorReporting, checkSystemHealth } = require('./error-reporting');
const { runDeploymentWithRetry } = require('./deployment-retry');
const { runFallbackBuild } = require('./build-fallback');
const fs = require('fs');
const path = require('path');

/**
 * Deployment phases with error handling
 */
const DEPLOYMENT_PHASES = {
  HEALTH_CHECK: 'health-check',
  INSTALL: 'install',
  BUILD: 'build',
  VERIFY: 'verify-build',
  DEPLOY: 'deploy',
  POST_VERIFY: 'post-verify'
};

/**
 * Run deployment phase with comprehensive error handling
 */
async function runPhaseWithErrorHandling(phase, options = {}) {
  console.log(`\n🚀 Starting deployment phase: ${phase}`);
  
  const startTime = Date.now();
  let result = null;
  
  try {
    switch (phase) {
      case DEPLOYMENT_PHASES.HEALTH_CHECK:
        result = await runHealthCheck();
        break;
        
      case DEPLOYMENT_PHASES.INSTALL:
        result = await runDeploymentWithRetry('install', options);
        break;
        
      case DEPLOYMENT_PHASES.BUILD:
        result = await runBuildWithFallback(options);
        break;
        
      case DEPLOYMENT_PHASES.VERIFY:
        result = await runBuildVerification();
        break;
        
      case DEPLOYMENT_PHASES.DEPLOY:
        result = await runDeploymentWithRetry('deploy', options);
        break;
        
      case DEPLOYMENT_PHASES.POST_VERIFY:
        result = await runDeploymentWithRetry('verify', options);
        break;
        
      default:
        throw new Error(`Unknown deployment phase: ${phase}`);
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Phase '${phase}' completed successfully in ${duration}ms`);
    
    return {
      phase,
      success: true,
      duration,
      result
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ Phase '${phase}' failed after ${duration}ms`);
    
    // Generate error report
    const errorReport = reportError(error, {
      phase,
      duration,
      deploymentMode: process.env.DEPLOYMENT_MODE,
      ...options
    });
    
    return {
      phase,
      success: false,
      duration,
      error: error.message,
      errorReport
    };
  }
}

/**
 * Run system health check
 */
async function runHealthCheck() {
  console.log('🏥 Running system health check...');
  
  const issues = checkSystemHealth();
  
  if (issues.length > 0) {
    console.log('⚠️ Health check found potential issues:');
    issues.forEach(issue => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`  ${icon} ${issue.message}`);
    });
    
    // Fail if critical errors found
    const criticalIssues = issues.filter(i => i.type === 'error');
    if (criticalIssues.length > 0) {
      throw new Error(`Critical system issues detected: ${criticalIssues.map(i => i.message).join(', ')}`);
    }
  } else {
    console.log('✅ System health check passed');
  }
  
  return { issues };
}

/**
 * Run build with fallback strategies
 */
async function runBuildWithFallback(options = {}) {
  console.log('🔨 Running build with fallback strategies...');
  
  const buildMode = options.buildMode || process.env.DEPLOYMENT_MODE || 'fast';
  
  try {
    // Try primary build strategy
    await runDeploymentWithRetry('build', { ...options, buildMode });
    return { strategy: buildMode, fallback: false };
    
  } catch (primaryError) {
    console.log(`⚠️ Primary build (${buildMode}) failed, attempting fallback...`);
    
    try {
      // Use fallback build system
      const result = await runFallbackBuild(buildMode);
      return { 
        strategy: result.strategy, 
        fallback: true,
        primaryError: primaryError.message
      };
      
    } catch (fallbackError) {
      // Both primary and fallback failed
      console.log('💥 Both primary and fallback builds failed');
      
      // Generate comprehensive error report
      reportError(fallbackError, {
        primaryError: primaryError.message,
        fallbackAttempted: true,
        buildMode
      });
      
      throw fallbackError;
    }
  }
}

/**
 * Verify build output
 */
async function runBuildVerification() {
  console.log('🔍 Verifying build output...');
  
  const outputDir = path.join(process.cwd(), 'out');
  
  if (!fs.existsSync(outputDir)) {
    throw new Error('Build output directory not found');
  }
  
  // Check essential files
  const essentialFiles = [
    'index.html',
    '_next/static'
  ];
  
  const missingFiles = [];
  const fileStats = {};
  
  for (const file of essentialFiles) {
    const filePath = path.join(outputDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    } else {
      const stats = fs.statSync(filePath);
      fileStats[file] = {
        size: stats.size,
        isDirectory: stats.isDirectory()
      };
    }
  }
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing essential build files: ${missingFiles.join(', ')}`);
  }
  
  // Verify HTML content
  const indexPath = path.join(outputDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.length < 100) {
    throw new Error('index.html appears to be empty or corrupted');
  }
  
  if (!indexContent.includes('<html') || !indexContent.includes('</html>')) {
    throw new Error('index.html does not contain valid HTML structure');
  }
  
  console.log('✅ Build verification passed');
  return { fileStats, contentLength: indexContent.length };
}

/**
 * Run complete deployment with error handling
 */
async function runCompleteDeployment(options = {}) {
  console.log('🚀 Starting complete deployment with error handling...');
  
  const phases = [
    DEPLOYMENT_PHASES.HEALTH_CHECK,
    DEPLOYMENT_PHASES.INSTALL,
    DEPLOYMENT_PHASES.BUILD,
    DEPLOYMENT_PHASES.VERIFY
    // Note: DEPLOY and POST_VERIFY phases are handled by GitHub Actions
  ];
  
  const results = [];
  let overallSuccess = true;
  
  for (const phase of phases) {
    const result = await runPhaseWithErrorHandling(phase, options);
    results.push(result);
    
    if (!result.success) {
      overallSuccess = false;
      
      // Determine if we should continue or abort
      const criticalPhases = [DEPLOYMENT_PHASES.BUILD, DEPLOYMENT_PHASES.VERIFY];
      if (criticalPhases.includes(phase)) {
        console.log(`💥 Critical phase '${phase}' failed, aborting deployment`);
        break;
      } else {
        console.log(`⚠️ Non-critical phase '${phase}' failed, continuing...`);
      }
    }
  }
  
  // Generate deployment report
  const report = {
    timestamp: new Date().toISOString(),
    success: overallSuccess,
    phases: results,
    summary: {
      totalPhases: phases.length,
      completedPhases: results.length,
      successfulPhases: results.filter(r => r.success).length,
      failedPhases: results.filter(r => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0)
    }
  };
  
  // Save report
  const reportPath = 'deployment-error-handling-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Deployment report saved to: ${reportPath}`);
  
  if (overallSuccess) {
    console.log('\n🎉 Deployment completed successfully with error handling!');
  } else {
    console.log('\n💥 Deployment failed despite error handling attempts');
    throw new Error('Deployment failed - check error reports for details');
  }
  
  return report;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'complete';
  
  const options = {
    buildMode: args[1] || process.env.DEPLOYMENT_MODE || 'fast',
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    verbose: process.env.VERBOSE === 'true'
  };
  
  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(`
🚨 Deployment Error Handler Integration Script

Usage:
  node scripts/deployment-error-handler.js [command] [buildMode]

Commands:
  complete     Run complete deployment with error handling (default)
  health       Run system health check only
  build        Run build phase with fallback strategies
  verify       Run build verification only
  help         Show this help message

Build Modes:
  fast         Fast deployment mode (default)
  minimal      Minimal deployment mode
  emergency    Emergency deployment mode
  basic        Basic deployment mode

Environment Variables:
  DEPLOYMENT_MODE    Deployment mode (fast, minimal, emergency, basic)
  MAX_RETRIES        Maximum retry attempts (default: 3)
  VERBOSE            Enable verbose logging (true/false)

Examples:
  node scripts/deployment-error-handler.js complete fast
  node scripts/deployment-error-handler.js build minimal
  node scripts/deployment-error-handler.js health
`);
    process.exit(0);
  }
  
  // Set deployment mode
  if (options.buildMode) {
    process.env.DEPLOYMENT_MODE = options.buildMode;
  }
  
  // Run command
  const runCommand = async () => {
    switch (command) {
      case 'complete':
        return await runCompleteDeployment(options);
        
      case 'health':
        return await runPhaseWithErrorHandling(DEPLOYMENT_PHASES.HEALTH_CHECK, options);
        
      case 'build':
        return await runPhaseWithErrorHandling(DEPLOYMENT_PHASES.BUILD, options);
        
      case 'verify':
        return await runPhaseWithErrorHandling(DEPLOYMENT_PHASES.VERIFY, options);
        
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  };
  
  runCommand()
    .then((result) => {
      console.log(`\n✅ Command '${command}' completed successfully`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n❌ Command '${command}' failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  runCompleteDeployment,
  runPhaseWithErrorHandling,
  runBuildWithFallback,
  DEPLOYMENT_PHASES
};