#!/usr/bin/env node

/**
 * Color contrast testing script for WCAG compliance
 * Tests the color combinations used in the CryptoPulse website
 */

import { getContrastRatio, meetsContrastRequirement } from '../lib/accessibility';

// Define color palette used in the website
const colors = {
  // Primary colors
  white: '#ffffff',
  black: '#000000',
  
  // Gray scale
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Blue (primary brand color)
  blue50: '#eff6ff',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue900: '#1e3a8a',
  
  // Purple (secondary brand color)
  purple600: '#9333ea',
};

// Define color combinations used in the website
const colorCombinations = [
  // Light theme combinations
  { name: 'Body text on white background', foreground: colors.gray900, background: colors.white },
  { name: 'Secondary text on white background', foreground: colors.gray600, background: colors.white },
  { name: 'Muted text on white background', foreground: colors.gray500, background: colors.white },
  { name: 'Link text on white background', foreground: colors.blue600, background: colors.white },
  { name: 'Button text on blue background', foreground: colors.white, background: colors.blue600 },
  
  // Dark theme combinations
  { name: 'Body text on dark background', foreground: colors.gray100, background: colors.gray900 },
  { name: 'Secondary text on dark background', foreground: colors.gray400, background: colors.gray900 },
  { name: 'Link text on dark background', foreground: colors.blue400, background: colors.gray900 },
  { name: 'Card background on dark theme', foreground: colors.gray100, background: colors.gray800 },
  
  // Interactive states
  { name: 'Focus ring on white', foreground: colors.blue500, background: colors.white },
  { name: 'Focus ring on dark', foreground: colors.blue500, background: colors.gray900 },
  
  // Border colors
  { name: 'Border on white background', foreground: colors.gray200, background: colors.white },
  { name: 'Border on dark background', foreground: colors.gray700, background: colors.gray900 },
  
  // Brand gradient colors
  { name: 'Brand gradient start', foreground: colors.white, background: colors.blue500 },
  { name: 'Brand gradient end', foreground: colors.white, background: colors.purple600 },
];

interface ContrastResult {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

function testColorContrast(): ContrastResult[] {
  console.log('🎨 Testing Color Contrast for WCAG Compliance\n');
  console.log('=' .repeat(80));
  
  const results: ContrastResult[] = [];
  
  colorCombinations.forEach(({ name, foreground, background }) => {
    const ratio = getContrastRatio(foreground, background);
    const passesAA = meetsContrastRequirement(foreground, background, 'AA', 'normal');
    const passesAAA = meetsContrastRequirement(foreground, background, 'AAA', 'normal');
    const passesAALarge = meetsContrastRequirement(foreground, background, 'AA', 'large');
    const passesAAALarge = meetsContrastRequirement(foreground, background, 'AAA', 'large');
    
    const result: ContrastResult = {
      name,
      foreground,
      background,
      ratio,
      passesAA,
      passesAAA,
      passesAALarge,
      passesAAALarge,
    };
    
    results.push(result);
    
    // Format output
    const status = passesAA ? '✅' : '❌';
    const ratioFormatted = ratio.toFixed(2);
    
    console.log(`${status} ${name}`);
    console.log(`   Ratio: ${ratioFormatted}:1`);
    console.log(`   AA Normal: ${passesAA ? '✅' : '❌'} | AA Large: ${passesAALarge ? '✅' : '❌'}`);
    console.log(`   AAA Normal: ${passesAAA ? '✅' : '❌'} | AAA Large: ${passesAAALarge ? '✅' : '❌'}`);
    console.log(`   Colors: ${foreground} on ${background}`);
    console.log('');
  });
  
  return results;
}

function generateReport(results: ContrastResult[]): void {
  console.log('📊 Summary Report');
  console.log('=' .repeat(80));
  
  const totalTests = results.length;
  const passedAA = results.filter(r => r.passesAA).length;
  const passedAAA = results.filter(r => r.passesAAA).length;
  
  console.log(`Total color combinations tested: ${totalTests}`);
  console.log(`WCAG AA compliance: ${passedAA}/${totalTests} (${((passedAA/totalTests) * 100).toFixed(1)}%)`);
  console.log(`WCAG AAA compliance: ${passedAAA}/${totalTests} (${((passedAAA/totalTests) * 100).toFixed(1)}%)`);
  console.log('');
  
  // List failing combinations
  const failedAA = results.filter(r => !r.passesAA);
  if (failedAA.length > 0) {
    console.log('❌ Failed WCAG AA Requirements:');
    failedAA.forEach(result => {
      console.log(`   • ${result.name} (${result.ratio.toFixed(2)}:1)`);
    });
    console.log('');
  }
  
  // List excellent combinations
  const excellentContrast = results.filter(r => r.ratio >= 7);
  if (excellentContrast.length > 0) {
    console.log('🌟 Excellent Contrast (7:1 or higher):');
    excellentContrast.forEach(result => {
      console.log(`   • ${result.name} (${result.ratio.toFixed(2)}:1)`);
    });
    console.log('');
  }
  
  // Recommendations
  console.log('💡 Recommendations:');
  if (failedAA.length > 0) {
    console.log('   • Consider darkening foreground colors or lightening background colors for failed combinations');
    console.log('   • Use tools like WebAIM Contrast Checker to find compliant alternatives');
  } else {
    console.log('   • All color combinations meet WCAG AA standards! 🎉');
  }
  
  if (passedAAA < totalTests) {
    console.log('   • Consider improving contrast ratios to meet WCAG AAA standards for enhanced accessibility');
  }
  
  console.log('   • Test with actual users who have visual impairments');
  console.log('   • Consider providing high contrast mode option');
}

// Run the tests
if (require.main === module) {
  try {
    const results = testColorContrast();
    generateReport(results);
    
    // Exit with error code if any AA tests fail
    const failedAA = results.filter(r => !r.passesAA).length;
    if (failedAA > 0) {
      console.log(`\n❌ ${failedAA} color combinations failed WCAG AA requirements`);
      process.exit(1);
    } else {
      console.log('\n✅ All color combinations pass WCAG AA requirements');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error testing color contrast:', error);
    process.exit(1);
  }
}

export { testColorContrast, generateReport };