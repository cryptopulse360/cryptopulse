# Deployment Guide

This document explains how to deploy the CryptoPulse website to GitHub Pages using the automated CI/CD pipeline.

## GitHub Actions Workflows

### 1. Build and Deploy (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**
- **Build**: Installs dependencies, runs tests, builds the application
- **Lighthouse**: Runs performance tests on pull requests
- **Deploy**: Deploys to GitHub Pages (main branch only)

### 2. Pull Request Checks (`pr-checks.yml`)

**Triggers:**
- Pull requests to `main` branch

**Jobs:**
- **Test**: Linting, type checking, unit tests, build validation
- **Lighthouse**: Performance testing with results posted to PR

### 3. Security Checks (`security.yml`)

**Triggers:**
- Weekly schedule (Mondays)
- Manual dispatch
- Push to main branch

**Jobs:**
- **Security Audit**: Checks for vulnerabilities and outdated packages

## Setup Instructions

### 1. Repository Configuration

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Configure custom domain (optional)

### 2. Required Secrets

Add these secrets in repository settings:

- `LHCI_GITHUB_APP_TOKEN` (optional): For enhanced Lighthouse CI features

### 3. Branch Protection

Recommended branch protection rules for `main`:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

## Deployment Process

### Automatic Deployment

1. Push changes to `main` branch
2. GitHub Actions automatically:
   - Runs tests and builds the application
   - Deploys to GitHub Pages
   - Updates status badges

### Manual Deployment

1. Go to Actions tab in GitHub repository
2. Select "Build and Deploy to GitHub Pages"
3. Click "Run workflow"
4. Select branch and run

## Performance Monitoring

### Lighthouse CI

- Runs automatically on pull requests
- Tests performance, accessibility, SEO, and best practices
- Minimum scores:
  - Performance: 80%
  - Accessibility: 90%
  - Best Practices: 90%
  - SEO: 90%

### Status Badges

The README includes status badges for:
- Build and deployment status
- Pull request checks
- Lighthouse CI results

## GitHub Pages Configuration

### Initial Setup

1. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Set Source to "GitHub Actions"
   - Enable "Enforce HTTPS"

2. **Repository Permissions**
   - Ensure the repository has proper permissions for GitHub Actions
   - Go to Settings > Actions > General
   - Set "Workflow permissions" to "Read and write permissions"

### Custom Domain Setup

1. **Configure Domain in CNAME**
   ```bash
   # Edit public/CNAME file
   echo "your-domain.com" > public/CNAME
   ```

2. **DNS Configuration**
   
   **Option A: Apex Domain (example.com)**
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   ```
   
   **Option B: Subdomain (www.example.com)**
   ```
   Type: CNAME
   Name: www
   Value: username.github.io
   ```

3. **Verify Configuration**
   ```bash
   # Run deployment configuration check
   npm run configure-deployment
   ```

4. **Enable HTTPS**
   - After DNS propagation (24-48 hours)
   - Go to Settings > Pages
   - Check "Enforce HTTPS"

## Troubleshooting

### Build Failures

1. **Check GitHub Actions logs**
   - Go to Actions tab in repository
   - Click on failed workflow run
   - Review build logs for errors

2. **Local testing**
   ```bash
   npm run build
   npm run configure-deployment
   ```

3. **Common issues**
   - Missing dependencies: `npm ci`
   - TypeScript errors: `npm run type-check`
   - Test failures: `npm test`

### Deployment Issues

1. **GitHub Pages not enabled**
   - Settings > Pages > Source: "GitHub Actions"
   - Ensure repository is public or has GitHub Pro

2. **Permission errors**
   - Settings > Actions > General
   - Set "Workflow permissions" to "Read and write permissions"

3. **Build output issues**
   ```bash
   # Verify build generates static files
   npm run build
   ls -la out/
   ```

4. **Custom domain issues**
   - DNS propagation can take 24-48 hours
   - Verify CNAME file contains correct domain
   - Check DNS records with: `dig your-domain.com`

### Performance Issues

1. **Lighthouse CI failures**
   - Review reports in GitHub Actions
   - Check Core Web Vitals metrics
   - Optimize images and code splitting

2. **Slow loading**
   - Enable image optimization
   - Check bundle size: `npm run analyze`
   - Review caching headers

### 404 Errors

1. **Missing pages**
   - Ensure all routes are properly generated
   - Check `generateStaticParams` functions
   - Verify file naming conventions

2. **Custom domain 404s**
   - Wait for DNS propagation
   - Check CNAME file deployment
   - Verify domain configuration in GitHub settings

## Monitoring

- GitHub Actions provide build notifications
- Lighthouse CI tracks performance over time
- Security audits run weekly for vulnerability detection

## Best Practices

1. Always create pull requests for changes
2. Wait for CI checks to pass before merging
3. Monitor Lighthouse scores regularly
4. Keep dependencies updated
5. Review security audit results promptly