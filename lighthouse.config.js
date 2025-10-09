module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000', 'http://localhost:3000/articles', 'http://localhost:3000/tags'],
      startServerCommand: 'npm run build && npm run start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': 'off',
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        
        // Resource optimization
        'unused-css-rules': 'off', // Tailwind CSS purging handles this
        'unused-javascript': ['warn', { maxLength: 1 }],
        'render-blocking-resources': ['warn', { maxLength: 0 }],
        'uses-optimized-images': ['error', { maxLength: 0 }],
        'uses-webp-images': ['warn', { maxLength: 2 }],
        'uses-responsive-images': ['error', { maxLength: 0 }],
        
        // Caching and compression
        'uses-long-cache-ttl': ['warn', { maxLength: 2 }],
        'uses-text-compression': ['error', { maxLength: 0 }],
        
        // Modern web features
        'uses-http2': 'off', // GitHub Pages limitation
        'uses-rel-preload': ['warn', { maxLength: 2 }],
        'uses-rel-preconnect': ['warn', { maxLength: 2 }],
        
        // Accessibility
        'color-contrast': ['error', { maxLength: 0 }],
        'image-alt': ['error', { maxLength: 0 }],
        'label': ['error', { maxLength: 0 }],
        'link-name': ['error', { maxLength: 0 }],
        
        // SEO
        'meta-description': ['error', { maxLength: 0 }],
        'document-title': ['error', { maxLength: 0 }],
        'hreflang': 'off',
        'canonical': ['error', { maxLength: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
  
  // Custom Lighthouse configuration
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      // Performance
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'total-blocking-time',
      'speed-index',
      'interactive',
      
      // Resource optimization
      'unused-css-rules',
      'unused-javascript',
      'render-blocking-resources',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-responsive-images',
      'efficient-animated-content',
      
      // Caching and compression
      'uses-long-cache-ttl',
      'uses-text-compression',
      
      // Modern web features
      'uses-rel-preload',
      'uses-rel-preconnect',
      'preload-lcp-image',
      
      // Accessibility
      'color-contrast',
      'image-alt',
      'label',
      'link-name',
      'heading-order',
      'landmark-one-main',
      
      // SEO
      'meta-description',
      'document-title',
      'canonical',
      'robots-txt',
      'structured-data',
    ],
  },
};