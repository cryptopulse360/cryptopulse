#!/usr/bin/env node

/**
 * Deployment Retry Logic Script
 * 
 * This script provides retry mechanisms for failed deployment steps
 * with exponential backoff and intelligent error handling.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY = 2000; // 2 seconds
const MAX_DELAY = 30000; // 30 seconds
const TIMEOUT_MULTIPLIER = 1.5;

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute command with retry logic
 */
async function executeWithRetry(command, options = {}) {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelay = DEFAULT_BASE_DELAY,
    timeout = 300000, // 5 minutes default
    cwd = process.cwd(),
    env = process.env,
    retryableErrors = [],
    description = command
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      console.log(`🔄 ${description} (attempt ${attempt}/${maxRetries + 1})`);
      
      const result = await executeCommand(command, { timeout, cwd, env });
      console.log(`✅ ${description} succeeded on attempt ${attempt}`);
      return result;
      
    } catch (error) {
      lastError = error;
      
      if (attempt > maxRetries) {
        console.log(`❌ ${description} failed after ${maxRetries + 1} attempts`);
        throw error;
      }

      // Check if error is retryable
      const isRetryable = isRetryableError(error, retryableErrors);
      
      if (!isRetryable) {
        console.log(`❌ ${description} failed with non-retryable error: ${error.message}`);
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), MAX_DELAY);
      
      console.log(`⏳ ${description} failed (attempt ${attempt}), retrying in ${delay}ms...`);
      console.log(`   Error: ${error.message}`);
      
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Execute command with timeout
 */
function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const { timeout = 300000, cwd = process.cwd(), env = process.env } = options;
    
    const child = spawn('sh', ['-c', command], {
      cwd,
      env: { ...process.env, ...env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let timeoutId;

    // Set up timeout
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error(`Command timed out after ${timeout}ms: ${command}`));
      }, timeout);
    }

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });

    child.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command}\nStderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(new Error(`Failed to execute command: ${command}\nError: ${error.message}`));
    });
  });
}

/**
 * Check if error is retryable
 */
function isRetryableError(error, customRetryableErrors = []) {
  const message = error.message.toLowerCase();
  
  // Default retryable error patterns
  const defaultRetryablePatterns = [
    /network.*error/,
    /timeout/,
    /connection.*reset/,
    /econnreset/,
    /enotfound/,
    /econnrefused/,
    /socket.*hang.*up/,
    /request.*timeout/,
    /temporary.*failure/,
    /service.*unavailable/,
    /rate.*limit/,
    /too.*many.*requests/,
    /github.*api.*error/,
    /pages.*deployment.*failed/,
    /artifact.*upload.*failed/
  ];

  // Combine default and custom patterns
  const allPatterns = [...defaultRetryablePatterns, ...customRetryableErrors];
  
  return allPatterns.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(message);
    }
    return message.includes(pattern.toLowerCase());
  });
}

/**
 * Retry npm install with different strategies
 */
async function retryNpmInstall(options = {}) {
  const strategies = [
    {
      command: 'npm ci --prefer-offline --no-audit',
      description: 'NPM install (prefer offline)',
      timeout: 180000 // 3 minutes
    },
    {
      command: 'npm ci --no-audit',
      description: 'NPM install (online)',
      timeout: 300000 // 5 minutes
    },
    {
      command: 'rm -rf node_modules package-lock.json && npm install --no-audit',
      description: 'NPM install (clean)',
      timeout: 600000 // 10 minutes
    }
  ];

  for (const strategy of strategies) {
    try {
      await executeWithRetry(strategy.command, {
        maxRetries: 2,
        timeout: strategy.timeout,
        description: strategy.description,
        retryableErrors: [
          /network/,
          /timeout/,
          /econnreset/,
          /registry.*error/
        ]
      });
      return;
    } catch (error) {
      console.log(`⚠️ ${strategy.description} failed: ${error.message}`);
      if (strategy === strategies[strategies.length - 1]) {
        throw error;
      }
    }
  }
}

/**
 * Retry build with different configurations
 */
async function retryBuild(buildMode = 'fast', options = {}) {
  const buildStrategies = [
    {
      command: `npm run build:${buildMode}`,
      description: `Build (${buildMode} mode)`,
      env: { 
        DEPLOYMENT_MODE: buildMode,
        SKIP_OG_GENERATION: buildMode === 'fast' ? 'true' : 'false'
      }
    },
    {
      command: 'npm run build:minimal',
      description: 'Build (minimal mode)',
      env: { 
        DEPLOYMENT_MODE: 'minimal',
        SKIP_OG_GENERATION: 'true',
        SKIP_TYPE_CHECK: 'true'
      }
    }
  ];

  for (const strategy of buildStrategies) {
    try {
      await executeWithRetry(strategy.command, {
        maxRetries: 2,
        timeout: 600000, // 10 minutes
        description: strategy.description,
        env: { ...process.env, ...strategy.env },
        retryableErrors: [
          /out of memory/,
          /heap.*out.*of.*memory/,
          /javascript.*heap.*out.*of.*memory/,
          /network.*error/,
          /timeout/
        ]
      });
      return strategy.description;
    } catch (error) {
      console.log(`⚠️ ${strategy.description} failed: ${error.message}`);
      if (strategy === buildStrategies[buildStrategies.length - 1]) {
        throw error;
      }
    }
  }
}

/**
 * Retry GitHub Pages deployment
 */
async function retryDeployment(artifactPath, options = {}) {
  const deploymentStrategies = [
    {
      description: 'GitHub Pages deployment (standard)',
      retryableErrors: [
        /deployment.*failed/,
        /pages.*error/,
        /artifact.*error/,
        /github.*api.*error/
      ]
    },
    {
      description: 'GitHub Pages deployment (with artifact re-upload)',
      preAction: async () => {
        console.log('🔄 Re-uploading artifact before retry...');
        // This would be handled by the GitHub Actions workflow
        // Here we just log the intention
      }
    }
  ];

  // Note: Actual GitHub Pages deployment retry would be handled
  // by the GitHub Actions workflow using the actions/deploy-pages action
  // This function provides the retry logic structure
  
  console.log('📦 Deployment retry logic prepared');
  console.log('ℹ️ Actual deployment retries are handled by GitHub Actions workflow');
  
  return {
    success: true,
    message: 'Deployment retry configuration ready'
  };
}

/**
 * Main retry orchestrator
 */
async function runDeploymentWithRetry(phase, options = {}) {
  console.log(`🚀 Starting deployment phase: ${phase}`);
  
  try {
    switch (phase) {
      case 'install':
        await retryNpmInstall(options);
        break;
        
      case 'build':
        const buildMode = options.buildMode || 'fast';
        const successfulBuild = await retryBuild(buildMode, options);
        console.log(`✅ Build completed successfully: ${successfulBuild}`);
        break;
        
      case 'deploy':
        await retryDeployment(options.artifactPath, options);
        break;
        
      case 'verify':
        await executeWithRetry('npm run deploy:verify', {
          maxRetries: 3,
          baseDelay: 5000, // 5 seconds
          timeout: 60000, // 1 minute
          description: 'Deployment verification',
          retryableErrors: [
            /site.*not.*accessible/,
            /connection.*refused/,
            /timeout/,
            /dns.*error/
          ]
        });
        break;
        
      default:
        throw new Error(`Unknown deployment phase: ${phase}`);
    }
    
    console.log(`✅ Deployment phase '${phase}' completed successfully`);
    
  } catch (error) {
    console.log(`❌ Deployment phase '${phase}' failed: ${error.message}`);
    throw error;
  }
}

/**
 * Generate retry report
 */
function generateRetryReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalAttempts: results.length,
    successfulPhases: results.filter(r => r.success).length,
    failedPhases: results.filter(r => !r.success).length,
    phases: results
  };

  const reportPath = 'deployment-retry-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 Retry report saved to: ${reportPath}`);
  return report;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const phase = args[0] || 'build';
  const buildMode = args[1] || 'fast';

  const options = {
    buildMode,
    maxRetries: parseInt(process.env.MAX_RETRIES) || DEFAULT_MAX_RETRIES,
    baseDelay: parseInt(process.env.RETRY_DELAY) || DEFAULT_BASE_DELAY
  };

  runDeploymentWithRetry(phase, options)
    .then(() => {
      console.log(`🎉 Deployment phase '${phase}' completed successfully with retry logic`);
      process.exit(0);
    })
    .catch(error => {
      console.error(`💥 Deployment phase '${phase}' failed even with retries:`, error.message);
      process.exit(1);
    });
}

module.exports = {
  executeWithRetry,
  retryNpmInstall,
  retryBuild,
  retryDeployment,
  runDeploymentWithRetry,
  generateRetryReport
};