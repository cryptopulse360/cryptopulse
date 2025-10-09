# Performance Optimization Guide

This document outlines the performance optimizations implemented in the CryptoPulse website and how to maintain optimal performance.

## Overview

The CryptoPulse website is optimized for maximum performance with a focus on:
- Fast loading times (LCP < 1.5s)
- Minimal layout shifts (CLS < 0.1)
- Quick interactivity (FID < 100ms)
- Efficient resource usage
- Excellent Core Web Vitals scores

## Implemented Optimizations

### 1. Image Optimization

#### OptimizedImage Component
- **Location**: `src/components/ui/OptimizedImage.tsx`
- **Features**:
  - Automatic WebP/AVIF format selection
  - Lazy loading with intersection observer
  - Progressive loading with blur placeholders
  - Responsive sizing with `sizes` attribute
  - Error handling with fallback UI
  - Priority loading for above-the-fold images

#### Usage Example
```tsx
<OptimizedImage
  src="/hero-image.jpg"
  alt="Article hero image"
  width={800}
  height={400}
  priority={true} // For above-the-fold images
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

### 2. Lazy Loading

#### LazyLoad Component
- **Location**: `src/components/ui/LazyLoad.tsx`
- **Features**:
  - Intersection Observer API for efficient detection
  - Configurable root margin and threshold
  - Fallback content while loading
  - HOC wrapper for easy component lazy loading

#### Lazy Components
- **Location**: `src/components/ui/LazyComponents.tsx`
- **Components**:
  - `LazySearchModal` - Search functionality (non-critical)
  - `LazyNewsletterForm` - Newsletter signup (below fold)
  - `LazyRelatedArticles` - Related content (below fold)
  - `LazyTagCloud` - Tag navigation (non-critical)
  - `LazyTableOfContents` - Article TOC (below fold)

### 3. Font Optimization

#### Font Loading Strategy
- **Inter font** with `display: swap` for fast text rendering
- Font preloading for critical fonts
- CSS font-face declarations with unicode ranges
- Variable font usage to reduce file sizes

#### Implementation
```tsx
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});
```

### 4. Critical CSS

#### Inline Critical CSS
- Above-the-fold styles inlined in HTML
- Non-critical CSS loaded asynchronously
- Tailwind CSS purging removes unused styles
- Font-face declarations optimized for performance

#### CSS Loading Strategy
```html
<!-- Critical CSS inlined -->
<style data-critical>/* Critical styles */</style>

<!-- Non-critical CSS loaded async -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

### 5. JavaScript Optimization

#### Code Splitting
- Route-based code splitting with Next.js
- Dynamic imports for non-critical components
- Vendor chunk separation
- Tree shaking to remove unused code

#### Performance Utilities
- **Location**: `src/lib/performance.ts`
- **Features**:
  - Debounce and throttle functions
  - Performance monitoring utilities
  - Connection speed detection
  - Reduced motion preference detection

### 6. Resource Hints

#### Preloading and Prefetching
```html
<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//plausible.io">

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

## Performance Monitoring

### Core Web Vitals Tracking

#### PerformanceMonitor Component
- **Location**: `src/components/performance/PerformanceMonitor.tsx`
- **Metrics Tracked**:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)
  - First Contentful Paint (FCP)
  - Time to First Byte (TTFB)

#### Usage
```tsx
import { PerformanceMonitorComponent } from '@/components/performance/PerformanceMonitor';

// Add to layout or specific pages
<PerformanceMonitorComponent enableReporting={true} />
```

### Lighthouse Testing

#### Automated Testing
```bash
# Run Lighthouse tests
npm run lighthouse

# Desktop-specific test
npm run lighthouse:desktop

# Mobile-specific test
npm run lighthouse:mobile

# Full analysis
npm run analyze
```

#### Performance Targets
- **Performance Score**: ≥90 (desktop), ≥80 (mobile)
- **LCP**: <1.5 seconds
- **FID**: <100 milliseconds
- **CLS**: <0.1
- **Speed Index**: <3 seconds

## Best Practices

### Image Guidelines

1. **Use OptimizedImage component** for all images
2. **Set priority={true}** for above-the-fold images
3. **Provide proper alt text** for accessibility
4. **Use appropriate sizes** attribute for responsive images
5. **Optimize source images** before adding to project

### Component Guidelines

1. **Use lazy loading** for below-the-fold components
2. **Implement error boundaries** for graceful failures
3. **Minimize bundle size** with dynamic imports
4. **Use React.memo** for expensive components
5. **Avoid inline functions** in render methods

### CSS Guidelines

1. **Keep critical CSS minimal** (< 14KB)
2. **Use Tailwind purging** to remove unused styles
3. **Avoid layout-shifting styles** (prefer transforms)
4. **Use CSS containment** for isolated components
5. **Minimize reflows and repaints**

### JavaScript Guidelines

1. **Use debounce/throttle** for frequent events
2. **Implement virtual scrolling** for long lists
3. **Lazy load non-critical features**
4. **Use Web Workers** for heavy computations
5. **Minimize main thread blocking**

## Troubleshooting

### Common Performance Issues

#### Slow LCP
- Check if hero images are optimized and prioritized
- Ensure critical CSS is inlined
- Verify font loading strategy
- Check for render-blocking resources

#### High CLS
- Set explicit dimensions for images and videos
- Avoid inserting content above existing content
- Use CSS transforms instead of layout properties
- Reserve space for dynamic content

#### Poor FID
- Reduce JavaScript bundle size
- Use code splitting and lazy loading
- Minimize main thread work
- Implement proper event handling

### Performance Testing

#### Local Testing
```bash
# Test performance optimizations
npm run test:performance

# Run Lighthouse locally
npm run lighthouse:desktop
npm run lighthouse:mobile
```

#### Production Testing
1. Deploy to staging environment
2. Run Lighthouse CI in GitHub Actions
3. Monitor Core Web Vitals in production
4. Use Real User Monitoring (RUM) tools

## Monitoring and Maintenance

### Regular Checks

1. **Weekly**: Run Lighthouse tests on key pages
2. **Monthly**: Review bundle size and dependencies
3. **Quarterly**: Audit and update performance optimizations
4. **Annually**: Review and update performance targets

### Performance Budget

- **JavaScript Bundle**: <250KB (gzipped)
- **CSS Bundle**: <50KB (gzipped)
- **Images**: WebP/AVIF format, <500KB per image
- **Fonts**: <100KB total font files
- **Third-party Scripts**: <50KB total

### Continuous Improvement

1. Monitor performance metrics in production
2. A/B test performance optimizations
3. Stay updated with web performance best practices
4. Regularly audit and update dependencies
5. Implement new browser features as they become available

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
- [Font Loading Best Practices](https://web.dev/font-display/)