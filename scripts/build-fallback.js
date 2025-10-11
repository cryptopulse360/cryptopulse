#!/usr/bin/env node

/**
 * Fallback Build Configuration Script
 * 
 * Provides multiple fallback build strategies for deployment recovery
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build configuration strategies (ordered from most to least features)
const BUILD_STRATEGIES = [
  {
    name: 'fast',
    description: 'Fast build (skip OG images)',
    env: {
      DEPLOYMENT_MODE: 'fast',
      SKIP_OG_GENERATION: 'true',
      NODE_ENV: 'production'
    },
    command: 'npx next build',
    timeout: 600000, // 10 minutes
    memoryLimit: '4096'
  },
  {
    name: 'minimal',
    description: 'Minimal build (skip OG + type checking)',
    env: {
      DEPLOYMENT_MODE: 'minimal',
      SKIP_OG_GENERATION: 'true',
      SKIP_TYPE_CHECK: 'true',
      NODE_ENV: 'production'
    },
    command: 'npx next build',
    timeout: 480000, // 8 minutes
    memoryLimit: '3072'
  },
  {
    name: 'emergency',
    description: 'Emergency build (minimal features)',
    env: {
      DEPLOYMENT_MODE: 'emergency',
      SKIP_OG_GENERATION: 'true',
      SKIP_TYPE_CHECK: 'true',
      SKIP_LINT: 'true',
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1'
    },
    command: 'npx next build',
    timeout: 360000, // 6 minutes
    memoryLimit: '2048'
  },
  {
    name: 'basic',
    description: 'Basic build (static only)',
    env: {
      DEPLOYMENT_MODE: 'basic',
      SKIP_OG_GENERATION: 'true',
      SKIP_TYPE_CHECK: 'true',
      SKIP_LINT: 'true',
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_ENV: 'production'
    },
    command: 'npx next build',
    timeout: 240000, // 4 minutes
    memoryLimit: '1536',
    preCommands: [
      'rm -rf .next',
      'rm -rf out'
    ]
  }
];

/**
 * Execute command with timeout and memory limit
 */
function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const { 
      timeout = 300000, 
      cwd = process.cwd(), 
      env = {}, 
      memoryLimit = '4096'
    } = options;

    console.log(`🔧 Executing: ${command}`);
    console.log(`⏱️ Timeout: ${timeout / 1000}s`);
    console.log(`💾 Memory limit: ${memoryLimit}MB`);

    const child = spawn('sh', ['-c', command], {
      cwd,
      env: { 
        ...process.env, 
        ...env,
        NODE_OPTIONS: `--max-old-space-size=${memoryLimit}`
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let timeoutId;

    // Set up timeout
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error(`Command timed out after ${timeout / 1000}s`));
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
        reject(new Error(`Command failed with exit code ${code}\nStderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(new Error(`Failed to execute command: ${error.message}`));
    });
  });
}

/**
 * Check if build output is valid
 */
function validateBuildOutput() {
  const outputDir = path.join(process.cwd(), 'out');
  
  if (!fs.existsSync(outputDir)) {
    throw new Error('Build output directory not found');
  }

  const indexPath = path.join(outputDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in build output');
  }

  // Check for minimum file size (should contain actual content)
  const stats = fs.statSync(indexPath);
  if (stats.size < 1000) { // Less than 1KB is suspicious
    throw new Error('index.html appears to be empty or corrupted');
  }

  // Check for basic HTML structure
  const content = fs.readFileSync(indexPath, 'utf8');
  if (!content.includes('<html') || !content.includes('</html>')) {
    throw new Error('index.html does not contain valid HTML structure');
  }

  console.log(`✅ Build output validated (${stats.size} bytes)`);
  return true;
}

/**
 * Run pre-build cleanup commands
 */
async function runPreCommands(commands) {
  if (!commands || commands.length === 0) return;

  console.log('🧹 Running pre-build cleanup...');
  
  for (const command of commands) {
    try {
      await executeCommand(command, { timeout: 30000 });
      console.log(`✅ Cleanup command completed: ${command}`);
    } catch (error) {
      console.log(`⚠️ Cleanup command failed (continuing): ${command}`);
      console.log(`   Error: ${error.message}`);
    }
  }
}

/**
 * Attempt build with specific strategy
 */
async function attemptBuild(strategy) {
  console.log(`\n🚀 Attempting build strategy: ${strategy.name}`);
  console.log(`📝 Description: ${strategy.description}`);
  
  try {
    // Run pre-commands if specified
    if (strategy.preCommands) {
      await runPreCommands(strategy.preCommands);
    }

    // Execute build command
    await executeCommand(strategy.command, {
      timeout: strategy.timeout,
      env: strategy.env,
      memoryLimit: strategy.memoryLimit
    });

    // Validate build output
    validateBuildOutput();

    console.log(`✅ Build strategy '${strategy.name}' completed successfully`);
    return {
      success: true,
      strategy: strategy.name,
      description: strategy.description
    };

  } catch (error) {
    console.log(`❌ Build strategy '${strategy.name}' failed: ${error.message}`);
    return {
      success: false,
      strategy: strategy.name,
      description: strategy.description,
      error: error.message
    };
  }
}

/**
 * Run fallback build process
 */
async function runFallbackBuild(startStrategy = null) {
  console.log('🔄 Starting fallback build process...');
  
  // Find starting strategy index
  let startIndex = 0;
  if (startStrategy) {
    startIndex = BUILD_STRATEGIES.findIndex(s => s.name === startStrategy);
    if (startIndex === -1) {
      console.log(`⚠️ Unknown strategy '${startStrategy}', starting from beginning`);
      startIndex = 0;
    }
  }

  const results = [];
  
  // Try each strategy in order
  for (let i = startIndex; i < BUILD_STRATEGIES.length; i++) {
    const strategy = BUILD_STRATEGIES[i];
    const result = await attemptBuild(strategy);
    results.push(result);
    
    if (result.success) {
      console.log(`\n🎉 Fallback build completed successfully!`);
      console.log(`✅ Used strategy: ${result.strategy} (${result.description})`);
      
      // Save build report
      const report = {
        timestamp: new Date().toISOString(),
        successfulStrategy: result.strategy,
        totalAttempts: i + 1,
        attempts: results
      };
      
      fs.writeFileSync('build-fallback-report.json', JSON.stringify(report, null, 2));
      console.log('📊 Build report saved to: build-fallback-report.json');
      
      return result;
    }
    
    // If not the last strategy, show fallback message
    if (i < BUILD_STRATEGIES.length - 1) {
      const nextStrategy = BUILD_STRATEGIES[i + 1];
      console.log(`🔄 Falling back to: ${nextStrategy.name} (${nextStrategy.description})`);
    }
  }

  // All strategies failed
  console.log('\n💥 All fallback build strategies failed!');
  console.log('🔍 Attempted strategies:');
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`  ${icon} ${result.strategy}: ${result.description}`);
    if (!result.success) {
      console.log(`     Error: ${result.error}`);
    }
  });

  // Save failure report
  const failureReport = {
    timestamp: new Date().toISOString(),
    success: false,
    totalAttempts: results.length,
    attempts: results
  };
  
  fs.writeFileSync('build-fallback-report.json', JSON.stringify(failureReport, null, 2));
  console.log('📊 Failure report saved to: build-fallback-report.json');

  throw new Error('All fallback build strategies failed');
}

/**
 * Get build strategy by name
 */
function getBuildStrategy(name) {
  return BUILD_STRATEGIES.find(s => s.name === name);
}

/**
 * List available build strategies
 */
function listStrategies() {
  console.log('📋 Available build strategies:');
  BUILD_STRATEGIES.forEach((strategy, index) => {
    console.log(`  ${index + 1}. ${strategy.name}: ${strategy.description}`);
    console.log(`     Timeout: ${strategy.timeout / 1000}s, Memory: ${strategy.memoryLimit}MB`);
  });
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'list') {
    listStrategies();
    process.exit(0);
  }

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(`
🔧 Fallback Build Configuration Script

Usage:
  node scripts/build-fallback.js [strategy]
  node scripts/build-fallback.js list
  node scripts/build-fallback.js help

Arguments:
  strategy    Start with specific strategy (fast, minimal, emergency, basic)
              If not specified, starts with 'fast' and falls back as needed

Examples:
  node scripts/build-fallback.js           # Start with fast, fallback as needed
  node scripts/build-fallback.js minimal  # Start with minimal strategy
  node scripts/build-fallback.js list     # List available strategies
`);
    process.exit(0);
  }

  const startStrategy = command;

  runFallbackBuild(startStrategy)
    .then((result) => {
      console.log(`\n🎉 Build completed with strategy: ${result.strategy}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n💥 Fallback build failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  BUILD_STRATEGIES,
  runFallbackBuild,
  attemptBuild,
  getBuildStrategy,
  listStrategies
};