#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating CI/CD setup...\n');

const checks = [
  {
    name: 'GitHub Actions workflows',
    check: () => {
      const workflowDir = '.github/workflows';
      const requiredWorkflows = ['deploy.yml', 'pr-checks.yml', 'security.yml'];
      
      if (!fs.existsSync(workflowDir)) {
        return { success: false, message: 'Workflows directory not found' };
      }
      
      const missingWorkflows = requiredWorkflows.filter(workflow => 
        !fs.existsSync(path.join(workflowDir, workflow))
      );
      
      if (missingWorkflows.length > 0) {
        return { 
          success: false, 
          message: `Missing workflows: ${missingWorkflows.join(', ')}` 
        };
      }
      
      return { success: true, message: 'All required workflows present' };
    }
  },
  {
    name: 'Lighthouse CI configuration',
    check: () => {
      if (!fs.existsSync('lighthouserc.js')) {
        return { success: false, message: 'lighthouserc.js not found' };
      }
      return { success: true, message: 'Lighthouse CI configured' };
    }
  },
  {
    name: 'Package.json scripts',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const requiredScripts = ['build', 'test', 'type-check', 'lighthouse'];
      
      const missingScripts = requiredScripts.filter(script => 
        !packageJson.scripts[script]
      );
      
      if (missingScripts.length > 0) {
        return { 
          success: false, 
          message: `Missing scripts: ${missingScripts.join(', ')}` 
        };
      }
      
      return { success: true, message: 'All required scripts present' };
    }
  },
  {
    name: 'Next.js configuration',
    check: () => {
      if (!fs.existsSync('next.config.js')) {
        return { success: false, message: 'next.config.js not found' };
      }
      
      const config = fs.readFileSync('next.config.js', 'utf8');
      if (!config.includes('output: \'export\'')) {
        return { 
          success: false, 
          message: 'Static export not configured in next.config.js' 
        };
      }
      
      return { success: true, message: 'Next.js configured for static export' };
    }
  },
  {
    name: 'Dependencies',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const requiredDeps = ['@lhci/cli', 'lighthouse', 'serve'];
      
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.devDependencies[dep]
      );
      
      if (missingDeps.length > 0) {
        return { 
          success: false, 
          message: `Missing dependencies: ${missingDeps.join(', ')}` 
        };
      }
      
      return { success: true, message: 'All CI/CD dependencies present' };
    }
  }
];

let allPassed = true;

checks.forEach(({ name, check }) => {
  const result = check();
  const status = result.success ? '✅' : '❌';
  console.log(`${status} ${name}: ${result.message}`);
  
  if (!result.success) {
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 CI/CD setup validation passed!');
  console.log('\nNext steps:');
  console.log('1. Push changes to GitHub');
  console.log('2. Enable GitHub Pages in repository settings');
  console.log('3. Set Pages source to "GitHub Actions"');
  console.log('4. Create a pull request to test the pipeline');
} else {
  console.log('❌ CI/CD setup validation failed!');
  console.log('Please fix the issues above and run validation again.');
  process.exit(1);
}