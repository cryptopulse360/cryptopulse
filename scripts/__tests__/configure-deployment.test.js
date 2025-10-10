import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';
import fs from 'fs';
import {
  validateCNAME,
  validateNoJekyll,
  validateNextConfig,
  validatePackageJson,
  generateDeploymentSummary
} from '../configure-deployment.js';

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  console.log = vi.fn();
  console.error = vi.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('Deployment Configuration', () => {
  describe('validateCNAME', () => {
    it('should detect when CNAME file does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      
      const result = validateCNAME();
      
      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('⚠️ CNAME file not found');
    });

    it('should detect custom domain configuration', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue('example.com\n');
      
      const result = validateCNAME();
      
      expect(result).toEqual({ configured: true, domain: 'example.com' });
      expect(console.log).toHaveBeenCalledWith('✅ Custom domain configured: example.com');
    });

    it('should detect when only comments exist in CNAME', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue('# Comment only\n# Another comment\n');
      
      const result = validateCNAME();
      
      expect(result).toEqual({ configured: false });
      expect(console.log).toHaveBeenCalledWith('ℹ️ No custom domain configured (using GitHub Pages default)');
    });
  });

  describe('validateNoJekyll', () => {
    it('should detect when .nojekyll file exists', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      
      const result = validateNoJekyll();
      
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('✅ .nojekyll file exists');
    });

    it('should detect when .nojekyll file is missing', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      
      const result = validateNoJekyll();
      
      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('⚠️ .nojekyll file missing');
    });
  });

  describe('validateNextConfig', () => {
    it('should validate correct Next.js configuration', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(`
        const nextConfig = {
          output: 'export',
          trailingSlash: true,
        };
      `);
      
      const result = validateNextConfig();
      
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('✅ Next.js configured for static export');
    });

    it('should detect missing static export configuration', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(`
        const nextConfig = {
          // Missing output: 'export'
        };
      `);
      
      const result = validateNextConfig();
      
      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('⚠️ Next.js configuration may need updates for GitHub Pages');
    });
  });

  describe('validatePackageJson', () => {
    it('should validate correct package.json scripts', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
        scripts: {
          build: 'next build',
          export: 'npm run build'
        }
      }));
      
      const result = validatePackageJson();
      
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('✅ Build script configured');
    });

    it('should detect missing build script', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
        scripts: {
          // Missing build script
        }
      }));
      
      const result = validatePackageJson();
      
      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('⚠️ Build script missing or misconfigured');
    });
  });

  describe('generateDeploymentSummary', () => {
    it('should return true when all validations pass', () => {
      // Mock all validation functions to return true
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync')
        .mockReturnValueOnce('example.com') // CNAME
        .mockReturnValueOnce(`output: 'export', trailingSlash: true`) // next.config.js
        .mockReturnValueOnce(JSON.stringify({ scripts: { build: 'next build' } })); // package.json
      
      const result = generateDeploymentSummary();
      
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('✅ Ready for deployment!');
    });

    it('should return false when validations fail', () => {
      // Mock validations to fail
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      
      const result = generateDeploymentSummary();
      
      expect(result).toBe(false);
      expect(console.log).toHaveBeenCalledWith('⚠️ Some configuration issues detected.');
    });
  });
});

// Restore fs mocks
afterAll(() => {
  vi.restoreAllMocks();
});