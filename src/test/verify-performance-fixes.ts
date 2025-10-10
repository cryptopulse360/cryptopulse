#!/usr/bin/env tsx

/**
 * Verification script for performance testing environment fixes
 * This script tests that all browser API mocks work correctly
 */

import { describe, it, expect, vi } from 'vitest';
import { setupPerformanceTestEnvironment } from './performance-setup';

// Test the setup function
describe('Performance Test Environment Setup', () => {
  it('should setup all required browser API mocks', () => {
    const testEnv = setupPerformanceTestEnvironment();
    
    // Verify window.matchMedia is mocked
    expect(window.matchMedia).toBeDefined();
    expect(typeof window.matchMedia).toBe('function');
    
    // Verify performance API is mocked
    expect(global.performance).toBeDefined();
    expect(global.performance.mark).toBeDefined();
    expect(global.performance.measure).toBeDefined();
    
    // Verify navigator.connection is mocked
    expect(global.navigator.connection).toBeDefined();
    expect(global.navigator.connection.effectiveType).toBe('4g');
    
    // Verify CSS.supports is mocked
    expect(global.CSS.supports).toBeDefined();
    expect(global.CSS.supports('font-display', 'swap')).toBe(true);
    
    // Verify HTMLLinkElement is mocked
    expect(global.HTMLLinkElement).toBeDefined();
    
    // Verify animation frame APIs are mocked
    expect(global.requestAnimationFrame).toBeDefined();
    expect(global.cancelAnimationFrame).toBeDefined();
    
    testEnv.cleanup();
  });
  
  it('should handle matchMedia queries correctly', () => {
    setupPerformanceTestEnvironment();
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    expect(mediaQuery).toBeDefined();
    expect(mediaQuery.matches).toBe(false);
    expect(mediaQuery.media).toBe('(prefers-reduced-motion: reduce)');
  });
  
  it('should mock performance timing correctly', () => {
    const testEnv = setupPerformanceTestEnvironment();
    
    const mockPerformance = global.performance as any;
    expect(mockPerformance.timing).toBeDefined();
    expect(mockPerformance.timing.fetchStart).toBe(100);
    expect(mockPerformance.timing.responseStart).toBe(200);
    
    testEnv.cleanup();
  });
});

console.log('✅ Performance test environment setup verification completed!');