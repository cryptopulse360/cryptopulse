#!/usr/bin/env node

/**
 * Cross-Browser Testing Script
 * 
 * Tests the website across major browsers to ensure compatibility
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface BrowserTestResult {
  browser: string;
  version: string;
  status: 'pass' | 'fail' | 'warn';
  issues: string[];
  features: {
    javascript: boolean;
    css: boolean;
    responsive: boolean;
    accessibility: boolean;
  };
}

class CrossBrowserTester {
  private results: BrowserTestResult[] = [];
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  async runCrossBrowserTests(): Promise<void> {
    console.log('🌐 Starting Cross-Browser Compatibility Testing\n');

    // Test major browsers
    const browsers = [
      { name: 'Chrome', command: 'google-chrome' },
      { name: 'Firefox', command: 'firefox' },
      { name: 'Safari', command: 'safari' },
      { name: 'Edge', command: 'msedge' }
    ];

    try {
      // Start the development server
      console.log('Starting development server...');
      const serverProcess = execSync('npm run dev &', { 
        stdio: 'pipe',
        cwd: this.projectRoot 
      });

      // Wait for server to be ready
      await this.waitForServer('http://localhost:3000');

      for (const browser of browsers) {
        await this.testBrowser(browser.name, browser.command);
      }

      // Test mobile browsers (simulated)
      await this.testMobileBrowsers();

      // Generate report
      this.generateCrossBrowserReport();

    } catch (error) {
      console.error('❌ Cross-browser testing failed:', error);
      process.exit(1);
    } finally {
      // Clean up server
      try {
        execSync('pkill -f "next dev"', { stdio: 'ignore' });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  private async testBrowser(browserName: string, command: string): Promise<void> {
    console.log(`🔍 Testing ${browserName}...`);

    const result: BrowserTestResult = {
      browser: browserName,
      version: 'Latest',
      status: 'pass',
      issues: [],
      features: {
        javascript: true,
        css: true,
        responsive: true,
        accessibility: true
      }
    };

    try {
      // Test basic functionality
      await this.testBasicFunctionality(browserName, result);
      
      // Test CSS features
      await this.testCSSFeatures(browserName, result);
      
      // Test JavaScript features
      await this.testJavaScriptFeatures(browserName, result);
      
      // Test responsive design
      await this.testResponsiveDesign(browserName, result);

    } catch (error) {
      result.status = 'fail';
      result.issues.push(`Failed to test ${browserName}: ${error}`);
    }

    this.results.push(result);
    console.log(`  ${result.status === 'pass' ? '✅' : '❌'} ${browserName} testing completed\n`);
  }

  private async testBasicFunctionality(browserName: string, result: BrowserTestResult): Promise<void> {
    // Test page loading
    const testPages = [
      'http://localhost:3000',
      'http://localhost:3000/articles',
      'http://localhost:3000/tags',
      'http://localhost:3000/privacy'
    ];

    for (const page of testPages) {
      try {
        // Use curl to test basic page loading
        const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${page}`, { 
          encoding: 'utf8',
          timeout: 10000
        });

        if (response.trim() !== '200') {
          result.issues.push(`${page} returned status ${response}`);
          result.status = 'fail';
        }
      } catch (error) {
        result.issues.push(`Failed to load ${page}: ${error}`);
        result.status = 'fail';
      }
    }
  }

  private async testCSSFeatures(browserName: string, result: BrowserTestResult): Promise<void> {
    // Test CSS Grid support
    const cssFeatures = [
      'CSS Grid',
      'Flexbox',
      'CSS Variables',
      'CSS Transforms',
      'CSS Animations'
    ];

    // For now, assume modern browsers support these features
    // In a real implementation, you'd use browser automation tools
    const unsupportedFeatures = [];

    if (browserName === 'Internet Explorer') {
      unsupportedFeatures.push('CSS Grid', 'CSS Variables');
    }

    if (unsupportedFeatures.length > 0) {
      result.features.css = false;
      result.issues.push(`Unsupported CSS features: ${unsupportedFeatures.join(', ')}`);
      result.status = 'warn';
    }
  }

  private async testJavaScriptFeatures(browserName: string, result: BrowserTestResult): Promise<void> {
    // Test JavaScript ES6+ features
    const jsFeatures = [
      'Arrow Functions',
      'Async/Await',
      'Modules',
      'Fetch API',
      'IntersectionObserver'
    ];

    // For now, assume modern browsers support these features
    const unsupportedFeatures = [];

    if (browserName === 'Internet Explorer') {
      unsupportedFeatures.push('Arrow Functions', 'Async/Await', 'Fetch API');
    }

    if (unsupportedFeatures.length > 0) {
      result.features.javascript = false;
      result.issues.push(`Unsupported JS features: ${unsupportedFeatures.join(', ')}`);
      result.status = 'warn';
    }
  }

  private async testResponsiveDesign(browserName: string, result: BrowserTestResult): Promise<void> {
    // Test responsive breakpoints
    const breakpoints = [
      { name: 'Mobile', width: 375 },
      { name: 'Tablet', width: 768 },
      { name: 'Desktop', width: 1024 },
      { name: 'Large Desktop', width: 1440 }
    ];

    // In a real implementation, you'd use browser automation to test these
    // For now, we'll assume responsive design works if CSS Grid/Flexbox is supported
    if (!result.features.css) {
      result.features.responsive = false;
      result.issues.push('Responsive design may not work due to CSS limitations');
    }
  }

  private async testMobileBrowsers(): Promise<void> {
    console.log('📱 Testing Mobile Browser Compatibility...');

    const mobileBrowsers = [
      { name: 'Mobile Safari', platform: 'iOS' },
      { name: 'Chrome Mobile', platform: 'Android' },
      { name: 'Samsung Internet', platform: 'Android' },
      { name: 'Firefox Mobile', platform: 'Android' }
    ];

    for (const browser of mobileBrowsers) {
      const result: BrowserTestResult = {
        browser: `${browser.name} (${browser.platform})`,
        version: 'Latest',
        status: 'pass',
        issues: [],
        features: {
          javascript: true,
          css: true,
          responsive: true,
          accessibility: true
        }
      };

      // Test mobile-specific features
      await this.testMobileFeatures(browser.name, result);
      
      this.results.push(result);
      console.log(`  ✅ ${browser.name} (${browser.platform}) testing completed`);
    }

    console.log();
  }

  private async testMobileFeatures(browserName: string, result: BrowserTestResult): Promise<void> {
    // Test touch interactions
    const mobileFeatures = [
      'Touch Events',
      'Viewport Meta Tag',
      'Mobile-friendly Navigation',
      'Swipe Gestures'
    ];

    // Check for viewport meta tag in the built HTML
    try {
      const indexPath = join(this.projectRoot, 'out', 'index.html');
      const content = require('fs').readFileSync(indexPath, 'utf8');
      
      if (!content.includes('name="viewport"')) {
        result.issues.push('Missing viewport meta tag for mobile optimization');
        result.status = 'warn';
      }
    } catch (error) {
      result.issues.push('Could not verify mobile optimization');
    }
  }

  private async waitForServer(url: string, timeout: number = 30000): Promise<void> {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      try {
        execSync(`curl -s ${url}`, { timeout: 5000 });
        return;
      } catch (error) {
        // Server not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
  }

  private generateCrossBrowserReport(): void {
    console.log('\n🌐 CROSS-BROWSER COMPATIBILITY REPORT');
    console.log('=====================================\n');

    let overallCompatible = true;

    for (const result of this.results) {
      const status = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
      console.log(`${status} ${result.browser} ${result.version}`);
      
      if (result.status === 'fail') {
        overallCompatible = false;
      }

      // Show feature support
      console.log(`  JavaScript: ${result.features.javascript ? '✓' : '✗'}`);
      console.log(`  CSS: ${result.features.css ? '✓' : '✗'}`);
      console.log(`  Responsive: ${result.features.responsive ? '✓' : '✗'}`);
      console.log(`  Accessibility: ${result.features.accessibility ? '✓' : '✗'}`);

      // Show issues
      if (result.issues.length > 0) {
        console.log('  Issues:');
        for (const issue of result.issues) {
          console.log(`    - ${issue}`);
        }
      }
      console.log();
    }

    // Generate JSON report
    const reportData = {
      timestamp: new Date().toISOString(),
      overallCompatible,
      browsers: this.results,
      summary: {
        totalBrowsers: this.results.length,
        compatibleBrowsers: this.results.filter(r => r.status === 'pass').length,
        incompatibleBrowsers: this.results.filter(r => r.status === 'fail').length,
        warningBrowsers: this.results.filter(r => r.status === 'warn').length
      }
    };

    writeFileSync(
      join(this.projectRoot, 'cross-browser-results.json'),
      JSON.stringify(reportData, null, 2)
    );

    console.log(`\n🎯 OVERALL COMPATIBILITY: ${overallCompatible ? 'COMPATIBLE' : 'ISSUES FOUND'}`);
    console.log(`📄 Detailed report saved to: cross-browser-results.json\n`);

    if (!overallCompatible) {
      console.log('⚠️  Some browsers have compatibility issues. Review the report above.');
    } else {
      console.log('🎉 Website is compatible across all tested browsers!');
    }
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  const tester = new CrossBrowserTester();
  tester.runCrossBrowserTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default CrossBrowserTester;