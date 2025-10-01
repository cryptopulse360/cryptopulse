# CryptoPulse Website

[![Build and Deploy](https://github.com/USERNAME/REPOSITORY/actions/workflows/deploy.yml/badge.svg)](https://github.com/USERNAME/REPOSITORY/actions/workflows/deploy.yml)
[![PR Checks](https://github.com/USERNAME/REPOSITORY/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/USERNAME/REPOSITORY/actions/workflows/pr-checks.yml)
[![Lighthouse CI](https://img.shields.io/badge/Lighthouse-CI-blue)](https://github.com/USERNAME/REPOSITORY/actions)

A high-performance static crypto-news website built with Next.js 14+ and TypeScript. CryptoPulse delivers fast, SEO-optimized cryptocurrency news and analysis with zero hosting costs through GitHub Pages deployment.

## 🚀 Features

- ⚡ **Next.js 14+** with App Router and static export
- 🎨 **Tailwind CSS** with custom design system and dark mode
- 📝 **TypeScript** with strict mode for type safety
- 📱 **Fully responsive** design for all devices
- 🔍 **Client-side search** powered by Lunr.js
- 📊 **Privacy-friendly analytics** with Plausible
- ♿ **WCAG 2.1 AA** accessibility compliance
- 🌙 **Dark mode** with system preference detection
- 📰 **MDX content** management with front-matter
- 🔗 **SEO optimized** with Open Graph and structured data
- 📧 **Newsletter integration** with Mailchimp
- 🚀 **GitHub Pages** deployment with custom domain support

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Local Development Setup](#local-development-setup)
- [Creating and Publishing Articles](#creating-and-publishing-articles)
- [Custom Domain Configuration](#custom-domain-configuration)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cryptopulse-website.git
   cd cryptopulse-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Local Development Setup

### Environment Configuration

1. **Create environment file** (optional for local development)
   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables** (if needed)
   ```env
   # Optional: Plausible Analytics
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
   
   # Optional: Mailchimp (for newsletter)
   NEXT_PUBLIC_MAILCHIMP_URL=your-mailchimp-url
   ```

### Development Workflow

1. **Start the development server**
   ```bash
   npm run dev
   ```
   - Hot reloading enabled
   - TypeScript type checking
   - Tailwind CSS compilation
   - MDX processing

2. **Run tests during development**
   ```bash
   npm run test:watch
   ```

3. **Check code quality**
   ```bash
   npm run lint
   npm run type-check
   ```

4. **Test production build locally**
   ```bash
   npm run build
   npm run start
   ```

### IDE Setup

**Recommended VS Code extensions:**
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- MDX
- ESLint
- Prettier

**VS Code settings** (`.vscode/settings.json`):
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 📝 Creating and Publishing Articles

### Article Structure

Articles are written in MDX format and stored in the `content/articles/` directory.

### Creating a New Article

1. **Create the article file**
   ```bash
   # Create new article file
   touch content/articles/your-article-slug.mdx
   ```

2. **Add front-matter and content**
   ```mdx
   ---
   title: "Your Article Title"
   description: "Brief description for SEO and social sharing"
   author: "Author Name"
   publishedAt: "2024-01-15"
   updatedAt: "2024-01-16"  # Optional
   tags: ["bitcoin", "analysis", "market-trends"]
   heroImage: "/images/your-hero-image.jpg"
   featured: false  # Set to true for featured articles
   category: "analysis"  # Optional category
   ---

   # Your Article Title

   Your article content goes here. You can use all standard Markdown syntax plus MDX components.

   ## Subheading

   - Bullet points
   - **Bold text**
   - *Italic text*
   - [Links](https://example.com)

   ```javascript
   // Code blocks with syntax highlighting
   const example = "Hello World";
   ```

   > Blockquotes for important information

   ![Alt text](/images/article-image.jpg)
   ```

### Front-Matter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Article title (used in SEO) |
| `description` | ✅ | Brief description (meta description) |
| `author` | ✅ | Author name |
| `publishedAt` | ✅ | Publication date (YYYY-MM-DD) |
| `updatedAt` | ❌ | Last update date (YYYY-MM-DD) |
| `tags` | ✅ | Array of tags for categorization |
| `heroImage` | ✅ | Path to hero image |
| `featured` | ❌ | Boolean for featured articles |
| `category` | ❌ | Article category |

### Adding Images

1. **Add images to the public directory**
   ```bash
   # Create images directory if it doesn't exist
   mkdir -p public/images/articles
   
   # Add your images
   cp your-image.jpg public/images/articles/
   ```

2. **Reference images in articles**
   ```mdx
   ![Alt text](/images/articles/your-image.jpg)
   ```

3. **Optimize images**
   - Use WebP format when possible
   - Compress images before adding
   - Recommended sizes: Hero images 1200x630px, inline images max 800px width

### Publishing Workflow

1. **Create and test locally**
   ```bash
   npm run dev
   # Navigate to your article at /articles/your-article-slug
   ```

2. **Validate article**
   ```bash
   npm run build
   # Check for any build errors
   ```

3. **Commit and push**
   ```bash
   git add content/articles/your-article-slug.mdx
   git add public/images/articles/  # If you added images
   git commit -m "Add new article: Your Article Title"
   git push origin main
   ```

4. **Automatic deployment**
   - GitHub Actions will automatically build and deploy
   - Check the Actions tab for deployment status
   - Article will be live within 2-5 minutes

### Article Best Practices

- **SEO-friendly titles**: Use descriptive, keyword-rich titles
- **Compelling descriptions**: Write engaging meta descriptions (150-160 characters)
- **Proper tagging**: Use 3-5 relevant tags per article
- **Image optimization**: Compress images and use descriptive alt text
- **Internal linking**: Link to related articles when relevant
- **Reading time**: Aim for 800-2000 words for optimal engagement

## 🌐 Custom Domain Configuration

### Setting Up a Custom Domain

1. **Purchase and configure your domain**
   - Buy a domain from your preferred registrar
   - Configure DNS settings (see below)

2. **Update repository settings**
   ```bash
   # Update CNAME file
   echo "yourdomain.com" > public/CNAME
   ```

3. **Configure DNS records**
   
   **For apex domain (yourdomain.com):**
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

   **For subdomain (www.yourdomain.com):**
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```

4. **Enable HTTPS in GitHub Pages**
   - Go to repository Settings → Pages
   - Check "Enforce HTTPS"
   - Wait for SSL certificate provisioning (up to 24 hours)

### Domain Configuration Examples

**Cloudflare DNS:**
```
Type    Name    Content                 TTL
A       @       185.199.108.153        Auto
A       @       185.199.109.153        Auto
A       @       185.199.110.153        Auto
A       @       185.199.111.153        Auto
CNAME   www     username.github.io     Auto
```

**Namecheap DNS:**
```
Type    Host    Value                   TTL
A       @       185.199.108.153        Automatic
A       @       185.199.109.153        Automatic
A       @       185.199.110.153        Automatic
A       @       185.199.111.153        Automatic
CNAME   www     username.github.io     Automatic
```

### Verifying Domain Setup

1. **Check DNS propagation**
   ```bash
   # Check A records
   dig yourdomain.com A
   
   # Check CNAME records
   dig www.yourdomain.com CNAME
   ```

2. **Test HTTPS**
   ```bash
   curl -I https://yourdomain.com
   # Should return 200 OK with proper headers
   ```

3. **Validate in browser**
   - Visit your domain
   - Check for HTTPS lock icon
   - Test redirects (www → non-www or vice versa)

## 📁 Project Structure

```
cryptopulse-website/
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       ├── deploy.yml         # Main deployment workflow
│       ├── pr-checks.yml      # PR validation
│       └── security.yml       # Security audits
├── content/                   # Article content
│   └── articles/             # MDX article files
├── docs/                     # Documentation
│   ├── deployment.md         # Deployment guide
│   ├── analytics-setup.md    # Analytics configuration
│   └── accessibility.md      # Accessibility guidelines
├── public/                   # Static assets
│   ├── images/              # Image assets
│   ├── CNAME               # Custom domain configuration
│   └── robots.txt          # SEO robots file
├── scripts/                 # Build and utility scripts
│   ├── configure-deployment.js
│   ├── test-deployment.js
│   └── validate-ci.js
├── src/                     # Source code
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── articles/       # Article pages
│   │   ├── tags/          # Tag pages
│   │   ├── privacy/       # Privacy policy
│   │   ├── contact/       # Contact page
│   │   └── api/           # API routes (sitemap, RSS)
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── article/       # Article-related components
│   │   ├── search/        # Search functionality
│   │   ├── seo/          # SEO components
│   │   └── ui/           # UI components
│   ├── lib/               # Utility functions
│   │   ├── mdx.ts        # MDX processing
│   │   ├── search.ts     # Search functionality
│   │   ├── seo.ts        # SEO utilities
│   │   └── utils.ts      # General utilities
│   └── types/             # TypeScript definitions
├── .eslintrc.json         # ESLint configuration
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier configuration
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Available Scripts

### Development Scripts
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run export           # Build and export static files
```

### Code Quality Scripts
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
```

### Testing Scripts
```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run end-to-end tests
```

### Build and Deployment Scripts
```bash
npm run validate-ci      # Validate CI/CD configuration
npm run lighthouse       # Run Lighthouse CI locally
npm run build:analyze    # Analyze bundle size
```

### Utility Scripts
```bash
npm run clean            # Clean build artifacts
npm run deps:update      # Update dependencies
npm run deps:audit       # Security audit
```

## 🔄 CI/CD Pipeline

### Automated Workflows

The project includes comprehensive GitHub Actions workflows:

1. **Deploy Workflow** (`.github/workflows/deploy.yml`)
   - Triggers on push to main branch
   - Builds and deploys to GitHub Pages
   - Runs performance and accessibility tests

2. **PR Checks** (`.github/workflows/pr-checks.yml`)
   - Runs on all pull requests
   - Type checking, linting, and testing
   - Lighthouse CI for performance regression

3. **Security Audits** (`.github/workflows/security.yml`)
   - Weekly dependency vulnerability scans
   - Automated security updates

### Pipeline Status

Monitor your pipeline status:
- **Build Status**: Check the Actions tab in your repository
- **Deployment Status**: View in repository Settings → Pages
- **Performance**: Lighthouse CI reports in PR comments

### Local Pipeline Testing

```bash
# Validate CI configuration
npm run validate-ci

# Test build process locally
npm run build

# Run Lighthouse locally
npm run lighthouse
```

## 🚀 Deployment

### Automatic Deployment

The site automatically deploys to GitHub Pages when you push to the main branch:

1. **Push changes**
   ```bash
   git push origin main
   ```

2. **Monitor deployment**
   - Check GitHub Actions tab
   - Deployment typically takes 2-5 minutes
   - Site updates automatically

### Manual Deployment

If needed, you can trigger manual deployment:

1. **Via GitHub Actions**
   - Go to Actions tab
   - Select "Deploy to GitHub Pages"
   - Click "Run workflow"

2. **Local build and deploy**
   ```bash
   npm run build
   # Upload `out` directory to your hosting provider
   ```

### Deployment Verification

After deployment, verify:
- Site loads correctly at your domain
- All pages are accessible
- Images and assets load properly
- Search functionality works
- Analytics tracking is active

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md).

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Build Failures

**Issue**: Build fails with TypeScript errors
```bash
Error: Type 'string' is not assignable to type 'Date'
```
**Solution**: 
```bash
# Check TypeScript configuration
npm run type-check

# Fix type issues in your code
# Ensure date fields in front-matter are properly formatted
```

**Issue**: MDX parsing errors
```bash
Error: Expected a closing tag for `<div>`
```
**Solution**:
- Check MDX syntax in your articles
- Ensure all HTML tags are properly closed
- Validate front-matter YAML syntax

#### Development Server Issues

**Issue**: Development server won't start
```bash
Error: Port 3000 is already in use
```
**Solution**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

**Issue**: Hot reloading not working
**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

#### Deployment Issues

**Issue**: GitHub Pages deployment fails
**Solution**:
1. Check GitHub Actions logs for specific errors
2. Verify repository settings (Settings → Pages)
3. Ensure `CNAME` file is correct for custom domains
4. Check branch protection rules

**Issue**: Custom domain not working
**Solution**:
1. Verify DNS configuration (see [Custom Domain Configuration](#custom-domain-configuration))
2. Check CNAME file in `public/CNAME`
3. Wait for DNS propagation (up to 48 hours)
4. Verify HTTPS certificate provisioning

#### Performance Issues

**Issue**: Slow page load times
**Solution**:
```bash
# Run Lighthouse audit
npm run lighthouse

# Analyze bundle size
npm run build:analyze

# Optimize images in public/images/
```

**Issue**: Large bundle size
**Solution**:
- Remove unused dependencies
- Optimize images (use WebP format)
- Enable tree shaking in build process
- Use dynamic imports for large components

#### Search Issues

**Issue**: Search not returning results
**Solution**:
1. Check search index generation in build logs
2. Verify article front-matter is complete
3. Clear browser cache and try again
4. Check browser console for JavaScript errors

#### Content Issues

**Issue**: Articles not appearing on site
**Solution**:
1. Verify front-matter format and required fields
2. Check file naming convention (`.mdx` extension)
3. Ensure articles are in `content/articles/` directory
4. Rebuild the site (`npm run build`)

**Issue**: Images not loading
**Solution**:
1. Verify image paths start with `/` (e.g., `/images/hero.jpg`)
2. Check images exist in `public/` directory
3. Ensure image file names match exactly (case-sensitive)
4. Optimize image sizes (< 1MB recommended)

### Getting Help

If you encounter issues not covered here:

1. **Check the logs**
   - GitHub Actions logs for deployment issues
   - Browser console for client-side errors
   - Terminal output for build errors

2. **Search existing issues**
   - Check repository issues tab
   - Search for similar problems online

3. **Create an issue**
   - Provide detailed error messages
   - Include steps to reproduce
   - Share relevant configuration files

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Development with debug info
DEBUG=* npm run dev

# Build with verbose output
npm run build -- --debug
```

### Performance Debugging

```bash
# Analyze bundle
npm run build:analyze

# Run performance tests
npm run lighthouse

# Check Core Web Vitals
# Use browser DevTools → Lighthouse tab
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
6. **Push and create a pull request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new functionality
- Maintain accessibility standards
- Update documentation for new features
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [MDX](https://mdxjs.com/) for enhanced Markdown support
- [Plausible Analytics](https://plausible.io/) for privacy-friendly analytics
- [GitHub Pages](https://pages.github.com/) for free hosting