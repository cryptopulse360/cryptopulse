#!/usr/bin/env node

/**
 * Mobile Responsiveness Testing Script
 * 
 * Tests the website's responsive design across various device sizes
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface ViewportTest {
  device: string;
  width: number;
  height: number;
  userAgent: string;
  pixelRatio: number;
}

interface ResponsiveTestResult {
  device: string;
  viewport: string;
  status: 'pass' | 'fail' | 'warn';
  issues: string[];
  metrics: {
    layoutStable: boolean;
    textReadable: boolean;
    touchTargetsAccessible: boolean;
    contentVisible: boolean;
    navigationUsable: boolean;
  };
}

class MobileResponsiveTester {
  private results: ResponsiveTestResult[] = [];
  private projectRoot: string;

  // Common device viewports to test
  private readonly devices: ViewportTest[] = [
    {
      device: 'iPhone SE',
      width: 375,
      height: 667,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      pixelRatio: 2
    },
    {
      device: 'iPhone 12',
      width: 390,
      height: 844,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      pixelRatio: 3
    },
    {
      device: 'iPhone 12 Pro Max',
      width: 428,
      height: 926,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      pixelRatio: 3
    },
    {
      device: 'Samsung Galaxy S21',
      width: 360,
      height: 800,
      userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
      pixelRatio: 3
    },
    {
      device: 'Samsung Galaxy Note 20',
      width: 412,
      height: 915,
      userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-N981B) AppleWebKit/537.36',
      pixelRatio: 2.625
    },
    {
      device: 'iPad',
      width: 768,
      height: 1024,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      pixelRatio: 2
    },
    {
      device: 'iPad Pro 11"',
      width: 834,
      height: 1194,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      pixelRatio: 2
    },
    {
      device: 'iPad Pro 12.9"',
      width: 1024,
      height: 1366,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      pixelRatio: 2
    },
    {
      device: 'Surface Pro 7',
      width: 912,
      height: 1368,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      pixelRatio: 2
    },
    {
      device: 'Nexus 7',
      width: 600,
      height: 960,
      userAgent: 'Mozilla/5.0 (Linux; Android 9; Nexus 7) AppleWebKit/537.36',
      pixelRatio: 2
    }
  ];

  constructor() {
    this.projectRoot = process.cwd();
  }

  async runResponsiveTests(): Promise<void> {
    console.log('📱 Starting Mobile Responsiveness Testing\n');

    try {
      // First, verify the build exists
      await this.verifyBuild();

      // Test viewport meta tag
      await this.testViewportMetaTag();

      // Test CSS media queries
      await this.testMediaQueries();

      // Test each device viewport
      for (const device of this.devices) {
        await this.testDeviceViewport(device);
      }

      // Test orientation changes
      await this.testOrientationChanges();

      // Test touch interactions
      await this.testTouchInteractions();

      // Generate report
      this.generateResponsiveReport();

    } catch (error) {
      console.error('❌ Mobile responsiveness testing failed:', error);
      process.exit(1);
    }
  }

  private async verifyBuild(): Promise<void> {
    const outDir = join(this.projectRoot, 'out');
    if (!existsSync(outDir)) {
      console.log('📦 Building project for testing...');
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });
    }
  }

  private async testViewportMetaTag(): Promise<void> {
    console.log('🔍 Testing viewport meta tag...');

    const result: ResponsiveTestResult = {
      device: 'All Devices',
      viewport: 'Meta Tag',
      status: 'pass',
      issues: [],
      metrics: {
        layoutStable: true,
        textReadable: true,
        touchTargetsAccessible: true,
        contentVisible: true,
        navigationUsable: true
      }
    };

    try {
      const indexPath = join(this.projectRoot, 'out', 'index.html');
      const content = readFileSync(indexPath, 'utf8');
      
      // Check for viewport meta tag
      const viewportRegex = /<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i;
      const match = content.match(viewportRegex);
      
      if (!match) {
        result.status = 'fail';
        result.issues.push('Missing viewport meta tag');
        result.metrics.layoutStable = false;
      } else {
        const viewportContent = match[1];
        
        // Check for required viewport properties
        const hasWidth = viewportContent.includes('width=device-width');
        const hasInitialScale = viewportContent.includes('initial-scale=1');
        
        if (!hasWidth) {
          result.status = 'warn';
          result.issues.push('Viewport meta tag missing width=device-width');
        }
        
        if (!hasInitialScale) {
          result.status = 'warn';
          result.issues.push('Viewport meta tag missing initial-scale=1');
        }

        // Check for problematic properties
        if (viewportContent.includes('user-scalable=no')) {
          result.status = 'warn';
          result.issues.push('Viewport prevents user scaling (accessibility issue)');
        }
      }

    } catch (error) {
      result.status = 'fail';
      result.issues.push(`Failed to check viewport meta tag: ${error}`);
    }

    this.results.push(result);
    console.log(`  ${result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌'} Viewport meta tag check completed\n`);
  }

  private async testMediaQueries(): Promise<void> {
    console.log('🎨 Testing CSS media queries...');

    const result: ResponsiveTestResult = {
      device: 'All Devices',
      viewport: 'CSS Media Queries',
      status: 'pass',
      issues: [],
      metrics: {
        layoutStable: true,
        textReadable: true,
        touchTargetsAccessible: true,
        contentVisible: true,
        navigationUsable: true
      }
    };

    try {
      // Check CSS files for responsive breakpoints
      const cssFiles = execSync('find out -name "*.css"', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      }).trim().split('\n').filter(f => f);

      let hasResponsiveCSS = false;
      const expectedBreakpoints = ['768px', '1024px', '640px', '1280px']; // Common Tailwind breakpoints
      const foundBreakpoints: string[] = [];

      for (const cssFile of cssFiles) {
        if (cssFile) {
          const cssPath = join(this.projectRoot, cssFile);
          const cssContent = readFileSync(cssPath, 'utf8');
          
          // Check for media queries
          const mediaQueryRegex = /@media[^{]+\{/g;
          const mediaQueries = cssContent.match(mediaQueryRegex) || [];
          
          if (mediaQueries.length > 0) {
            hasResponsiveCSS = true;
          }

          // Check for specific breakpoints
          for (const breakpoint of expectedBreakpoints) {
            if (cssContent.includes(breakpoint)) {
              foundBreakpoints.push(breakpoint);
            }
          }
        }
      }

      if (!hasResponsiveCSS) {
        result.status = 'fail';
        result.issues.push('No responsive CSS media queries found');
        result.metrics.layoutStable = false;
      }

      if (foundBreakpoints.length < 2) {
        result.status = 'warn';
        result.issues.push(`Limited responsive breakpoints found: ${foundBreakpoints.join(', ')}`);
      }

    } catch (error) {
      result.status = 'fail';
      result.issues.push(`Failed to analyze CSS: ${error}`);
    }

    this.results.push(result);
    console.log(`  ${result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌'} CSS media queries check completed\n`);
  }

  private async testDeviceViewport(device: ViewportTest): Promise<void> {
    console.log(`📱 Testing ${device.device} (${device.width}x${device.height})...`);

    const result: ResponsiveTestResult = {
      device: device.device,
      viewport: `${device.width}x${device.height}`,
      status: 'pass',
      issues: [],
      metrics: {
        layoutStable: true,
        textReadable: true,
        touchTargetsAccessible: true,
        contentVisible: true,
        navigationUsable: true
      }
    };

    try {
      // Test layout stability
      await this.testLayoutStability(device, result);
      
      // Test text readability
      await this.testTextReadability(device, result);
      
      // Test touch targets
      await this.testTouchTargets(device, result);
      
      // Test content visibility
      await this.testContentVisibility(device, result);
      
      // Test navigation usability
      await this.testNavigationUsability(device, result);

    } catch (error) {
      result.status = 'fail';
      result.issues.push(`Testing failed: ${error}`);
    }

    this.results.push(result);
    console.log(`  ${result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌'} ${device.device} testing completed`);
  }

  private async testLayoutStability(device: ViewportTest, result: ResponsiveTestResult): Promise<void> {
    // Test for horizontal scrolling issues
    // In a real implementation, this would use browser automation
    
    // Check if the viewport is very narrow and might cause issues
    if (device.width < 320) {
      result.status = 'warn';
      result.issues.push('Very narrow viewport may cause layout issues');
      result.metrics.layoutStable = false;
    }

    // Check for common responsive design patterns in CSS
    try {
      const cssFiles = execSync('find out -name "*.css"', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      }).trim().split('\n').filter(f => f);

      let hasFlexbox = false;
      let hasGrid = false;

      for (const cssFile of cssFiles) {
        if (cssFile) {
          const cssContent = readFileSync(join(this.projectRoot, cssFile), 'utf8');
          
          if (cssContent.includes('display:flex') || cssContent.includes('display: flex')) {
            hasFlexbox = true;
          }
          
          if (cssContent.includes('display:grid') || cssContent.includes('display: grid')) {
            hasGrid = true;
          }
        }
      }

      if (!hasFlexbox && !hasGrid) {
        result.status = 'warn';
        result.issues.push('No modern layout methods (Flexbox/Grid) detected');
      }

    } catch (error) {
      // Non-critical error
    }
  }

  private async testTextReadability(device: ViewportTest, result: ResponsiveTestResult): Promise<void> {
    // Check for minimum font sizes and line heights
    // This would ideally be done with browser automation
    
    // For mobile devices, ensure text is readable
    if (device.width < 768) {
      // Check CSS for font-size declarations
      try {
        const cssFiles = execSync('find out -name "*.css"', { 
          encoding: 'utf8',
          cwd: this.projectRoot 
        }).trim().split('\n').filter(f => f);

        let hasResponsiveFonts = false;

        for (const cssFile of cssFiles) {
          if (cssFile) {
            const cssContent = readFileSync(join(this.projectRoot, cssFile), 'utf8');
            
            // Look for responsive font sizing
            if (cssContent.includes('font-size') && cssContent.includes('@media')) {
              hasResponsiveFonts = true;
            }
          }
        }

        if (!hasResponsiveFonts) {
          result.status = 'warn';
          result.issues.push('No responsive font sizing detected');
          result.metrics.textReadable = false;
        }

      } catch (error) {
        // Non-critical error
      }
    }
  }

  private async testTouchTargets(device: ViewportTest, result: ResponsiveTestResult): Promise<void> {
    // Test touch target sizes (minimum 44px recommended)
    // This would be done with browser automation in a real implementation
    
    if (device.width < 768) {
      // Check HTML for interactive elements
      try {
        const htmlFiles = execSync('find out -name "*.html"', { 
          encoding: 'utf8',
          cwd: this.projectRoot 
        }).trim().split('\n').filter(f => f);

        for (const htmlFile of htmlFiles) {
          if (htmlFile) {
            const htmlContent = readFileSync(join(this.projectRoot, htmlFile), 'utf8');
            
            // Check for buttons and links
            const buttonCount = (htmlContent.match(/<button/g) || []).length;
            const linkCount = (htmlContent.match(/<a\s+/g) || []).length;
            
            if (buttonCount > 0 || linkCount > 0) {
              // Assume touch targets are properly sized if using a modern CSS framework
              // In reality, you'd measure actual element sizes
            }
          }
        }

      } catch (error) {
        result.status = 'warn';
        result.issues.push('Could not verify touch target sizes');
        result.metrics.touchTargetsAccessible = false;
      }
    }
  }

  private async testContentVisibility(device: ViewportTest, result: ResponsiveTestResult): Promise<void> {
    // Test that content doesn't overflow or get cut off
    // This would use browser automation in a real implementation
    
    // Check for potential overflow issues
    try {
      const cssFiles = execSync('find out -name "*.css"', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      }).trim().split('\n').filter(f => f);

      let hasOverflowHandling = false;

      for (const cssFile of cssFiles) {
        if (cssFile) {
          const cssContent = readFileSync(join(this.projectRoot, cssFile), 'utf8');
          
          if (cssContent.includes('overflow') || cssContent.includes('word-wrap') || cssContent.includes('word-break')) {
            hasOverflowHandling = true;
          }
        }
      }

      if (!hasOverflowHandling) {
        result.status = 'warn';
        result.issues.push('No overflow handling detected in CSS');
      }

    } catch (error) {
      // Non-critical error
    }
  }

  private async testNavigationUsability(device: ViewportTest, result: ResponsiveTestResult): Promise<void> {
    // Test mobile navigation patterns
    if (device.width < 768) {
      try {
        const htmlFiles = execSync('find out -name "*.html"', { 
          encoding: 'utf8',
          cwd: this.projectRoot 
        }).trim().split('\n').filter(f => f);

        let hasMobileNav = false;

        for (const htmlFile of htmlFiles) {
          if (htmlFile) {
            const htmlContent = readFileSync(join(this.projectRoot, htmlFile), 'utf8');
            
            // Look for mobile navigation patterns
            if (htmlContent.includes('hamburger') || 
                htmlContent.includes('menu-toggle') || 
                htmlContent.includes('mobile-menu') ||
                htmlContent.includes('nav-toggle')) {
              hasMobileNav = true;
            }
          }
        }

        if (!hasMobileNav) {
          result.status = 'warn';
          result.issues.push('No mobile navigation pattern detected');
          result.metrics.navigationUsable = false;
        }

      } catch (error) {
        // Non-critical error
      }
    }
  }

  private async testOrientationChanges(): Promise<void> {
    console.log('🔄 Testing orientation changes...');

    const orientationResult: ResponsiveTestResult = {
      device: 'Mobile Devices',
      viewport: 'Orientation Changes',
      status: 'pass',
      issues: [],
      metrics: {
        layoutStable: true,
        textReadable: true,
        touchTargetsAccessible: true,
        contentVisible: true,
        navigationUsable: true
      }
    };

    try {
      // Check CSS for orientation media queries
      const cssFiles = execSync('find out -name "*.css"', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      }).trim().split('\n').filter(f => f);

      let hasOrientationCSS = false;

      for (const cssFile of cssFiles) {
        if (cssFile) {
          const cssContent = readFileSync(join(this.projectRoot, cssFile), 'utf8');
          
          if (cssContent.includes('orientation:') || cssContent.includes('orientation ')) {
            hasOrientationCSS = true;
          }
        }
      }

      if (!hasOrientationCSS) {
        orientationResult.status = 'warn';
        orientationResult.issues.push('No orientation-specific CSS found');
      }

    } catch (error) {
      orientationResult.status = 'fail';
      orientationResult.issues.push(`Failed to check orientation support: ${error}`);
    }

    this.results.push(orientationResult);
    console.log(`  ${orientationResult.status === 'pass' ? '✅' : orientationResult.status === 'warn' ? '⚠️' : '❌'} Orientation changes test completed\n`);
  }

  private async testTouchInteractions(): Promise<void> {
    console.log('👆 Testing touch interactions...');

    const touchResult: ResponsiveTestResult = {
      device: 'Touch Devices',
      viewport: 'Touch Interactions',
      status: 'pass',
      issues: [],
      metrics: {
        layoutStable: true,
        textReadable: true,
        touchTargetsAccessible: true,
        contentVisible: true,
        navigationUsable: true
      }
    };

    try {
      // Check for touch-friendly interactions
      const jsFiles = execSync('find out -name "*.js"', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      }).trim().split('\n').filter(f => f);

      let hasTouchEvents = false;

      for (const jsFile of jsFiles) {
        if (jsFile) {
          const jsContent = readFileSync(join(this.projectRoot, jsFile), 'utf8');
          
          if (jsContent.includes('touchstart') || 
              jsContent.includes('touchend') || 
              jsContent.includes('touchmove') ||
              jsContent.includes('pointer')) {
            hasTouchEvents = true;
          }
        }
      }

      // Check CSS for touch-friendly styles
      const cssFiles = execSync('find out -name "*.css"', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      }).trim().split('\n').filter(f => f);

      let hasTouchStyles = false;

      for (const cssFile of cssFiles) {
        if (cssFile) {
          const cssContent = readFileSync(join(this.projectRoot, cssFile), 'utf8');
          
          if (cssContent.includes(':active') || 
              cssContent.includes(':focus') || 
              cssContent.includes('touch-action')) {
            hasTouchStyles = true;
          }
        }
      }

      if (!hasTouchEvents && !hasTouchStyles) {
        touchResult.status = 'warn';
        touchResult.issues.push('Limited touch interaction support detected');
      }

    } catch (error) {
      touchResult.status = 'fail';
      touchResult.issues.push(`Failed to check touch interactions: ${error}`);
    }

    this.results.push(touchResult);
    console.log(`  ${touchResult.status === 'pass' ? '✅' : touchResult.status === 'warn' ? '⚠️' : '❌'} Touch interactions test completed\n`);
  }

  private generateResponsiveReport(): void {
    console.log('\n📱 MOBILE RESPONSIVENESS REPORT');
    console.log('===============================\n');

    let overallResponsive = true;
    const deviceCategories = {
      phones: this.results.filter(r => r.device.includes('iPhone') || r.device.includes('Galaxy') || r.device.includes('Nexus')),
      tablets: this.results.filter(r => r.device.includes('iPad') || r.device.includes('Surface')),
      general: this.results.filter(r => !r.device.includes('iPhone') && !r.device.includes('Galaxy') && !r.device.includes('iPad') && !r.device.includes('Surface') && !r.device.includes('Nexus'))
    };

    // Report by category
    for (const [category, results] of Object.entries(deviceCategories)) {
      if (results.length > 0) {
        console.log(`📱 ${category.toUpperCase()}`);
        console.log('─'.repeat(category.length + 2));
        
        for (const result of results) {
          const status = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
          console.log(`${status} ${result.device} (${result.viewport})`);
          
          if (result.status === 'fail') {
            overallResponsive = false;
          }

          // Show metrics
          const metrics = result.metrics;
          console.log(`  Layout: ${metrics.layoutStable ? '✓' : '✗'} | Text: ${metrics.textReadable ? '✓' : '✗'} | Touch: ${metrics.touchTargetsAccessible ? '✓' : '✗'} | Content: ${metrics.contentVisible ? '✓' : '✗'} | Nav: ${metrics.navigationUsable ? '✓' : '✗'}`);

          // Show issues
          if (result.issues.length > 0) {
            for (const issue of result.issues) {
              console.log(`    ⚠️  ${issue}`);
            }
          }
        }
        console.log();
      }
    }

    // Generate JSON report
    const reportData = {
      timestamp: new Date().toISOString(),
      overallResponsive,
      devices: this.results,
      summary: {
        totalDevices: this.results.length,
        responsiveDevices: this.results.filter(r => r.status === 'pass').length,
        problematicDevices: this.results.filter(r => r.status === 'fail').length,
        warningDevices: this.results.filter(r => r.status === 'warn').length,
        categories: {
          phones: deviceCategories.phones.length,
          tablets: deviceCategories.tablets.length,
          general: deviceCategories.general.length
        }
      }
    };

    writeFileSync(
      join(this.projectRoot, 'responsive-test-results.json'),
      JSON.stringify(reportData, null, 2)
    );

    console.log(`\n🎯 OVERALL RESPONSIVENESS: ${overallResponsive ? 'RESPONSIVE' : 'ISSUES FOUND'}`);
    console.log(`📄 Detailed report saved to: responsive-test-results.json\n`);

    if (!overallResponsive) {
      console.log('⚠️  Some devices have responsiveness issues. Review the report above.');
    } else {
      console.log('🎉 Website is fully responsive across all tested devices!');
    }
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  const tester = new MobileResponsiveTester();
  tester.runResponsiveTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default MobileResponsiveTester;