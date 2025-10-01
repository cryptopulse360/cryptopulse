# Open Graph Image Generation

This document describes the automatic Open Graph (OG) image generation system implemented for the CryptoPulse website.

## Overview

The OG image generation system automatically creates social media preview images for articles and pages. These images are displayed when content is shared on platforms like Twitter, Facebook, LinkedIn, and other social media sites.

## Features

- **Dynamic Image Generation**: Creates custom OG images with article titles, descriptions, author information, and tags
- **Branded Design**: Consistent branding with CryptoPulse logo and color scheme
- **Responsive Text**: Automatically adjusts font sizes for long titles
- **Tag Display**: Shows up to 3 relevant tags for each article
- **Fallback Support**: Provides default images when generation fails
- **Build-time Generation**: Pre-generates images during the build process for static export
- **Development Mode**: Dynamic generation via API route during development

## Architecture

### Components

1. **API Route** (`/api/og`): Edge function that generates images using @vercel/og
2. **Utility Functions** (`src/lib/og-image.ts`): Helper functions for URL generation and validation
3. **Build Script** (`src/scripts/build-og-images.ts`): Pre-generates images for static export
4. **SEO Integration** (`src/components/seo/SEOHead.tsx`): Integrates OG images into metadata

### Image Specifications

- **Dimensions**: 1200x630 pixels (optimal for social media)
- **Format**: SVG (scalable vector graphics for better quality and smaller size)
- **Design**: Dark theme with gradient background
- **Typography**: System fonts for better compatibility
- **Branding**: CryptoPulse logo with Bitcoin symbol and consistent color scheme

## Usage

### Automatic Generation

OG images are automatically generated for:

- All articles based on their metadata (title, description, author, tags)
- Main pages (home, articles listing, tags listing)
- Custom pages when specified

### Manual Generation

To manually generate OG images during development:

```bash
npm run build:og
```

### API Usage

The OG image API accepts the following parameters:

- `title` (required): The main title text
- `description` (optional): Subtitle or description text
- `author` (optional): Author name
- `tags` (optional): Comma-separated list of tags

Example URL:
```
/api/og?title=Bitcoin%20Analysis&description=Market%20trends&author=John%20Doe&tags=bitcoin,crypto
```

## Implementation Details

### Development Mode

In development, OG images are generated dynamically via the `/api/og` route using the @vercel/og library.

### Production Mode

For static export compatibility, OG images are pre-generated during the build process and saved as static SVG files in `public/images/og/`. SVG format is used for better compatibility and smaller file sizes while maintaining high quality.

### SEO Integration

The generated OG images are automatically included in:

- Open Graph meta tags
- Twitter Card meta tags
- JSON-LD structured data

### Error Handling

The system includes comprehensive error handling:

- Fallback to hero images when OG generation fails
- Default placeholder images for missing content
- Graceful degradation for invalid parameters
- Console logging for debugging

## File Structure

```
src/
├── app/api/og/
│   ├── route.tsx              # OG image generation API
│   └── __tests__/
│       └── route.test.ts      # API tests
├── lib/
│   ├── og-image.ts            # OG image utilities
│   ├── build-og-images.ts     # Build-time generation
│   └── __tests__/
│       ├── og-image.test.ts   # Unit tests
│       └── og-integration.test.ts # Integration tests
├── scripts/
│   └── build-og-images.ts     # Build script
└── components/seo/
    └── SEOHead.tsx            # SEO integration

public/images/og/              # Generated OG images (production)
```

## Configuration

### Environment Variables

- `NODE_ENV`: Determines whether to use dynamic or static OG images
- `NEXT_PUBLIC_SITE_URL`: Base URL for production OG image URLs

### Build Configuration

The build process includes OG image generation:

```json
{
  "scripts": {
    "build": "npm run build:og && next build",
    "build:og": "tsx src/scripts/build-og-images.ts"
  }
}
```

## Testing

The OG image system includes comprehensive tests:

- **Unit Tests**: Test individual functions and utilities
- **Integration Tests**: Test SEO metadata integration
- **API Tests**: Test the OG generation endpoint (mocked)

Run tests:
```bash
npm test -- src/lib/__tests__/og-image.test.ts
npm test -- src/lib/__tests__/og-integration.test.ts
```

## Customization

### Design Changes

To modify the OG image design, edit the JSX template in `src/app/api/og/route.tsx`:

- Colors and gradients
- Typography and font sizes
- Layout and spacing
- Logo and branding elements

### Size and Format

To change image dimensions or format, modify the `ImageResponse` options:

```typescript
return new ImageResponse(
  // JSX template
  {
    width: 1200,  // Change width
    height: 630,  // Change height
  }
);
```

### Validation Rules

Parameter validation rules can be modified in `src/lib/og-image.ts`:

```typescript
export function validateOGImageParams(params: URLSearchParams) {
  // Modify validation logic
}
```

## Performance Considerations

- **Build Time**: OG image generation adds ~2-5 seconds to build time
- **File Size**: Each generated SVG image is approximately 2-5KB (much smaller than PNG)
- **Caching**: Static images are cached by CDN in production
- **Edge Runtime**: API route uses edge runtime for fast generation
- **Scalability**: SVG format ensures crisp images at any resolution

## Troubleshooting

### Common Issues

1. **Missing Images**: Check that build script ran successfully
2. **Invalid URLs**: Verify parameter encoding and validation
3. **Build Failures**: Check console output for error messages
4. **Font Issues**: Ensure Inter font is available in edge runtime

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=og-images npm run build:og
```

### Manual Testing

Test OG image generation locally:
```bash
# Start development server
npm run dev

# Visit OG image URL
http://localhost:3000/api/og?title=Test%20Title
```

## Future Enhancements

Potential improvements for the OG image system:

- **Custom Templates**: Support for different image templates per category
- **Dynamic Backgrounds**: Article-specific background images or patterns
- **Multilingual Support**: Generate images in different languages
- **A/B Testing**: Multiple image variants for testing
- **Analytics Integration**: Track social media engagement metrics
- **Image Optimization**: WebP format support and compression
- **Custom Fonts**: Support for additional typography options