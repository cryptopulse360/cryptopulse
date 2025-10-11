/** @type {import('next').NextConfig} */

const fs = require('fs');
const path = require('path');

// Deployment mode configuration
const deploymentMode = process.env.DEPLOYMENT_MODE || 'full';
const isFastMode = deploymentMode === 'fast';
const isMinimalMode = deploymentMode === 'minimal';
const isEmergencyMode = deploymentMode === 'emergency';
const isBasicMode = deploymentMode === 'basic';
const skipOGGeneration = process.env.SKIP_OG_GENERATION === 'true' || isFastMode || isMinimalMode || isEmergencyMode || isBasicMode;

// Fallback mode detection
const isFallbackMode = isMinimalMode || isEmergencyMode || isBasicMode;
const isUltraFastMode = isEmergencyMode || isBasicMode;

console.log(`🚀 Building in ${deploymentMode} mode`);
if (skipOGGeneration) {
  console.log('⚡ Skipping OG image generation for faster build');
}

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',

  // Performance optimizations (conditional based on deployment mode)
  compress: !isFallbackMode,
  poweredByHeader: false,
  
  // Disable features in fallback modes for reliability
  reactStrictMode: !isUltraFastMode,

  // Image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features for performance (conditional)
  experimental: {
    mdxRs: !isFallbackMode,
    optimizeCss: !isFastMode && !isFallbackMode, // Skip CSS optimization in fast/fallback modes
    optimizePackageImports: isUltraFastMode ? [] : (isFallbackMode ? [] : ['lucide-react', '@headlessui/react']),
    // Disable experimental features in emergency/basic modes
    ...(isUltraFastMode ? {} : {
      turbo: false, // Disable turbo in fallback modes for stability
    })
  },

  // Environment-based build optimizations
  swcMinify: !isFallbackMode, // Skip minification in fallback modes for speed
  compiler: {
    removeConsole: deploymentMode === 'full' ? { exclude: ['error'] } : false,
    // Disable advanced compiler features in ultra-fast modes
    ...(isUltraFastMode ? {} : {
      emotion: false,
      styledComponents: false,
    })
  },

  // Webpack optimizations (conditional based on deployment mode)
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/*': './src/*',
    };

    // Production optimizations (skip in fallback modes for speed)
    if (!dev && !isFallbackMode) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Fast mode optimizations
    if (isFastMode) {
      // Disable source maps for faster builds
      config.devtool = false;
      
      // Reduce bundle analysis overhead
      config.optimization = {
        ...config.optimization,
        minimize: false, // Skip minification for speed
      };
    }

    // Fallback mode optimizations
    if (isFallbackMode) {
      // Disable source maps and advanced optimizations
      config.devtool = false;
      config.optimization = {
        ...config.optimization,
        minimize: false,
        splitChunks: false,
        // Disable advanced optimizations for reliability
        usedExports: false,
        sideEffects: false,
      };
      
      // Reduce memory usage in ultra-fast modes
      if (isUltraFastMode) {
        config.cache = false;
        config.optimization.moduleIds = 'named';
        config.optimization.chunkIds = 'named';
      }
    }

    // Emergency/Basic mode - absolute minimal configuration
    if (isUltraFastMode) {
      // Disable all non-essential webpack features
      config.resolve.symlinks = false;
      config.resolve.cacheWithContext = false;
      
      // Minimal module resolution
      config.module.rules = config.module.rules.filter(rule => {
        // Keep only essential rules (JS/TS, CSS, images)
        return rule.test && (
          rule.test.toString().includes('js') ||
          rule.test.toString().includes('ts') ||
          rule.test.toString().includes('css') ||
          rule.test.toString().includes('png|jpg|jpeg|gif|svg')
        );
      });
    }

    return config;
  },

  // Build output verification
  onDemandEntries: {
    // Disable in production for better performance
    maxInactiveAge: deploymentMode === 'full' ? 25 * 1000 : 60 * 1000,
    pagesBufferLength: isFastMode ? 2 : 5,
  },

  // Note: headers() and redirects() don't work with static export
  // These would be handled by the web server (GitHub Pages) instead
};

/**
 * Verify build output after compilation
 */
function verifyBuildOutput() {
  const outputDir = path.join(process.cwd(), 'out');
  
  if (!fs.existsSync(outputDir)) {
    console.error('❌ Build output directory not found');
    return false;
  }

  // Check for essential files
  const essentialFiles = [
    'index.html',
    '_next/static',
    'articles/index.html',
    'tags/index.html'
  ];

  const missingFiles = essentialFiles.filter(file => {
    const filePath = path.join(outputDir, file);
    return !fs.existsSync(filePath);
  });

  if (missingFiles.length > 0) {
    console.error('❌ Missing essential build files:', missingFiles);
    return false;
  }

  // Verify HTML files are not empty
  const htmlFiles = ['index.html', 'articles/index.html'];
  for (const htmlFile of htmlFiles) {
    const filePath = path.join(outputDir, htmlFile);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.length < 100) { // Arbitrary minimum size
        console.error(`❌ HTML file appears to be empty or too small: ${htmlFile}`);
        return false;
      }
    }
  }

  console.log('✅ Build output verification passed');
  return true;
}

// Export verification function for use in build scripts
nextConfig.verifyBuildOutput = verifyBuildOutput;

module.exports = nextConfig;
