# Vercel Deployment Guide - RLHF Illustrated Guide

This comprehensive guide covers everything needed to deploy the **RLHF
Illustrated Guide** to Vercel.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (Recommended)](#quick-start-recommended)
- [Detailed Setup](#detailed-setup)
- [Environment Variables](#environment-variables)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Custom Domain](#custom-domain)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying to Vercel, ensure you have:

### Required

- **Node.js 18+** installed locally
- **Git** repository initialized and synced with GitHub
- **GitHub account** with repository access
- **Vercel account** (free tier is sufficient to start)

### Recommended

- GitHub organization or personal repository
- Custom domain registered (for production)
- Email address for Vercel notifications

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be 18.17.0 or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check Git
git --version   # Should be installed

# Verify repository is ready
git status      # Should show clean working tree
git remote -v   # Should show origin pointing to GitHub
```

---

## Quick Start (Recommended)

The fastest way to deploy is via Vercel's GitHub integration:

### Step 1: Push to GitHub

Ensure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect Vercel to GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account and authorize Vercel to access your repositories
5. Find and select the `illustrated-rlhf` repository
6. Click **"Import"**

### Step 3: Configure Project Settings

Vercel automatically detects Next.js and sets optimal defaults:

1. **Project Name**: Should default to `illustrated-rlhf` (auto-detected)
2. **Framework**: Should detect **Next.js**
3. **Build Command**: Should auto-detect as `npm run build`
4. **Output Directory**: Should auto-detect as `.next`
5. **Install Command**: Should auto-detect as `npm install`

✅ **All settings should be auto-configured correctly.**

### Step 4: Add Environment Variables

In the Vercel Dashboard, navigate to **Settings → Environment Variables**:

```
NEXT_PUBLIC_SITE_URL=https://<your-project>.vercel.app
NEXT_PUBLIC_SITE_NAME=RLHF Illustrated Guide
NEXT_PUBLIC_SITE_DESCRIPTION=An interactive visual guide to Reinforcement Learning from Human Feedback
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PLAYGROUND=true
NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_DEBUG_MODE=false
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (typically 2-3 minutes)
3. Click the live URL once deployment succeeds
4. Verify the site loads correctly

✅ **Deployment complete!**

---

## Detailed Setup

### Prerequisites for Production Deployment

#### 1. Project Structure Verification

Ensure required files exist:

```bash
# Check critical files
ls -la vercel.json                    # ✅ Vercel configuration
ls -la .env.example                   # ✅ Environment template
ls -la next.config.js                 # ✅ Next.js config
ls -la package.json                   # ✅ Dependencies
ls -la .github/workflows/ci.yml       # ✅ CI/CD pipeline
```

#### 2. Local Build Test

Before deploying, verify the production build works locally:

```bash
# Clean previous builds
rm -rf .next

# Install dependencies
npm ci  # Use ci instead of install for exact versions

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Test production build locally
npm run start

# Visit http://localhost:3000 and test thoroughly
```

#### 3. Commit and Push

```bash
# Ensure working directory is clean
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: prepare production build for Vercel deployment

- Add vercel.json configuration
- Update .env.example with all required variables
- Add GitHub Actions CI/CD workflow
- Verify production build passes all checks"

# Push to main branch
git push origin main
```

### Vercel Project Creation Steps

#### Option A: Via Web UI (Recommended for First Time)

1. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub (easiest option)
   - Grant Vercel access to your repositories

2. **Import Project**
   - Dashboard → "New Project"
   - "Import Git Repository"
   - Select `illustrated-rlhf` repository

3. **Project Configuration**

   ```
   Framework: Next.js (auto-detected ✅)
   Build & Development Settings:
     Build Command: npm run build
     Development Command: npm run dev
     Install Command: npm install
   Output Directory: .next (auto-detected ✅)
   ```

4. **Environment Variables** (See next section)

5. **Deploy**
   - Review settings
   - Click "Deploy"
   - Monitor build logs
   - Wait for completion

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel (opens browser)
vercel login

# Deploy project
cd /path/to/illustrated-rlhf
vercel

# Follow prompts:
# - Link to existing project? No (first time)
# - Project name? illustrated-rlhf
# - Source directory? ./
# - Build command? npm run build
# - Install command? npm install

# For production deployment
vercel --prod

# Get deployment URL
vercel --url
```

---

## Environment Variables

### Required Variables

Set these in Vercel Dashboard → **Settings → Environment Variables**

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=RLHF Illustrated Guide
NEXT_PUBLIC_SITE_DESCRIPTION=An interactive visual guide to Reinforcement Learning from Human Feedback

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PLAYGROUND=true
NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_DEBUG_MODE=false
```

### Optional Variables

These are optional but recommended for production:

```env
# Analytics (Privacy-Focused)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G_XXXXXXXXXX

# Error Tracking
SENTRY_AUTH_TOKEN=your_sentry_token
NEXT_PUBLIC_SENTRY_ENABLED=false
NEXT_PUBLIC_SENTRY_PROJECT=illustrated-rlhf

# Community Features (for future use)
NEXT_PUBLIC_CONTACT_EMAIL=contact@illustrated-rlhf.com
NEXT_PUBLIC_ENABLE_NEWSLETTER=false
```

### Environment-Specific Variables

Set different values for Preview and Production:

1. **Preview Deployments** (for pull requests)
   - `NEXT_PUBLIC_SITE_URL=https://preview-illustrated-rlhf.vercel.app`
   - `NEXT_PUBLIC_DEBUG_MODE=true`

2. **Production** (main branch)
   - `NEXT_PUBLIC_SITE_URL=https://illustrated-rlhf.vercel.app`
   - `NEXT_PUBLIC_DEBUG_MODE=false`

### Accessing Variables in Code

```typescript
// Client-side (only NEXT_PUBLIC_ variables available)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Server-side (all variables available)
const tokenSecret = process.env.SECRET_TOKEN; // Non-public variable

// Example usage
if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
  // Initialize analytics
}
```

---

## GitHub Actions CI/CD

The project includes a comprehensive CI/CD pipeline
(`.github/workflows/ci.yml`).

### Setting Up CI/CD Secrets

Before the workflow can deploy to Vercel, add these secrets to GitHub:

1. Go to **GitHub Repository → Settings → Secrets and variables → Actions**
2. Add these secrets:

| Secret Name         | Value                          | Where to Find                                               |
| ------------------- | ------------------------------ | ----------------------------------------------------------- |
| `VERCEL_TOKEN`      | Your Vercel API token          | [Vercel Settings/Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | Your Vercel organization ID    | Vercel Dashboard URL or settings                            |
| `VERCEL_PROJECT_ID` | Your Vercel project ID         | Vercel project settings                                     |
| `SNYK_TOKEN`        | (Optional) Snyk security token | [Snyk Account](https://app.snyk.io/account)                 |

### Obtaining Vercel Credentials

#### Get `VERCEL_TOKEN`

```bash
# Option 1: Via Vercel CLI
vercel login
vercel tokens ls  # List existing tokens
vercel tokens create --name github-actions

# Option 2: Via Web
# 1. Go to https://vercel.com/account/tokens
# 2. Create new token with name "github-actions"
# 3. Copy the token
```

#### Get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

```bash
# Run this in your project directory
vercel project info

# Output will show both IDs:
# Project ID: <VERCEL_PROJECT_ID>
# Organization ID: <VERCEL_ORG_ID>
```

### CI/CD Workflow Steps

The workflow automatically:

1. **On Pull Request**:
   - ✅ Runs ESLint
   - ✅ Checks TypeScript types
   - ✅ Builds project
   - ✅ Runs unit tests
   - ✅ Runs E2E tests
   - ✅ Performs Lighthouse audit
   - ✅ Security scanning
   - ✅ Comments on PR with results

2. **On Push to Main**:
   - ✅ Runs all checks above
   - ✅ **Automatically deploys to Vercel** if all checks pass

### Monitoring Workflow

1. Go to **GitHub Repository → Actions**
2. Click on workflow run to see logs
3. Check "Deploy to Vercel" step for deployment status
4. Click "Details" to see full build logs

---

## Custom Domain

### Option 1: Using Vercel Domain (Free)

Your project gets a free `.vercel.app` domain:

```
https://illustrated-rlhf.vercel.app
```

No configuration needed!

### Option 2: Custom Domain (Using Your Own)

#### Prerequisites

- Registered domain (e.g., `illustrated-rlhf.com`)
- Domain registrar account access

#### Steps

1. **Add Domain in Vercel**
   - Vercel Dashboard → Project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain name

2. **Configure DNS Records**
   - Vercel provides DNS configuration options:
     - **Option A**: Use Vercel nameservers (easiest)
       - Vercel shows: `ns1.vercel.com`, `ns2.vercel.com`
       - Update registrar to point to these nameservers
       - Wait 24-48 hours for propagation

     - **Option B**: Add CNAME record (if keeping registrar)
       - Point `illustrated-rlhf.com` CNAME to `cname.vercel.app`
       - Add A record for `www.illustrated-rlhf.com` if needed

3. **Verify Domain**
   - Vercel will automatically verify once DNS propagates
   - Status changes from "Pending" to "Valid"
   - SSL certificate auto-provisioned

4. **Force HTTPS**
   - Vercel → Settings → Domains
   - Enable "Automatic HTTPS to HTTP redirect"

### Example: Adding domain `rlhf-guide.com`

```
1. Register domain at registrar (e.g., Namecheap, GoDaddy)
2. Vercel Dashboard → Add custom domain: rlhf-guide.com
3. Update registrar nameservers to Vercel's:
   - ns1.vercel.com
   - ns2.vercel.com
4. Wait 24 hours for DNS propagation
5. Vercel automatically verifies and adds SSL
6. Update NEXT_PUBLIC_SITE_URL environment variable
```

---

## Monitoring & Analytics

### Vercel Built-in Monitoring

Vercel automatically provides:

- **Real User Metrics (RUM)**: Core Web Vitals
- **Performance Analytics**: Page load times
- **Deployment History**: Track all deployments
- **Function Metrics**: Edge function performance

Access via: **Vercel Dashboard → Analytics**

### Setting Up Sentry (Error Tracking)

For production error monitoring:

1. **Create Sentry Account**
   - Visit [sentry.io](https://sentry.io)
   - Create organization and project for RLHF

2. **Add Sentry to Project** (Optional setup)

   ```bash
   npm install @sentry/nextjs
   ```

3. **Add Secrets to Vercel**
   - `SENTRY_AUTH_TOKEN`: From Sentry account
   - `NEXT_PUBLIC_SENTRY_ENABLED=true`

### Privacy-Focused Analytics (Recommended)

Vercel Analytics respects privacy:

- ✅ No personal data collected
- ✅ GDPR compliant
- ✅ No cookies required
- ✅ No external tracking scripts

Enable via Vercel Dashboard → Analytics (already included)

---

## Troubleshooting

### Build Fails with "Memory exceeded"

**Problem**: Build process runs out of memory

**Solution**:

```bash
# Increase Node memory for build
# Add to vercel.json:
{
  "buildCommand": "NODE_OPTIONS=--max_old_space_size=4096 npm run build"
}
```

### Deployment timeout (>60 seconds)

**Problem**: Build takes too long

**Solution Options**:

1. Optimize bundle size

   ```bash
   npm install -g @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

2. Increase timeout in vercel.json
   ```json
   {
     "functions": {
       "api/**/*.js": { "maxDuration": 300 }
     }
   }
   ```

### "Cannot find module" errors

**Problem**: Build works locally but fails on Vercel

**Solution**:

```bash
# Clear cache and rebuild
rm -rf node_modules
npm ci  # Clean install

# Verify no environment-specific imports
# Check for platform-specific code

# Rebuild and test
npm run build
```

### Environment variables not loading

**Problem**: `process.env.NEXT_PUBLIC_*` returns undefined

**Solution**:

```bash
# 1. Verify variables added to Vercel Dashboard
# 2. Redeploy after adding variables (old deployments cached)
# 3. Check variable names (must be prefixed NEXT_PUBLIC_)
# 4. Restart build after variables added

# For debugging, log in build
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
```

### MDX Content Not Loading

**Problem**: "Cannot find MDX module" error

**Solution**:

```bash
# Ensure all MDX files in content/modules/ directory
ls -la src/content/modules/

# Verify dynamic imports in src/lib/module-content.ts
# Check module-content.ts has entries for all modules

# Rebuild
npm run build
```

### D3 Visualizations Not Rendering

**Problem**: Charts appear blank or error on Vercel

**Solution**:

```typescript
// Ensure client-side rendering
'use client';

// Avoid SSR-incompatible code
if (typeof window === 'undefined') return null;

// Use dynamic imports for D3 components
const Chart = dynamic(() => import('@/components/visualizations/chart'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### Analytics Not Showing Data

**Problem**: Vercel Analytics dashboard empty

**Solution**:

1. Wait 5-10 minutes after deployment for data to appear
2. Verify `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true`
3. Check browser has JavaScript enabled
4. Visit your site and interact to generate metrics
5. Metrics appear within 5 minutes

---

## Post-Deployment Checklist

After successful deployment, verify everything works:

### Immediate Checks (5 minutes)

- [ ] Site loads without errors
- [ ] Navigation works across all pages
- [ ] Sidebar modules display correctly
- [ ] Homepage learning path visible
- [ ] Analogy visuals render properly
- [ ] Dark mode toggle functions
- [ ] Responsive design on mobile

### Content Verification (15 minutes)

- [ ] All 12 modules load
- [ ] MDX content renders with correct formatting
- [ ] Math equations (KaTeX) display properly
- [ ] Code blocks have syntax highlighting
- [ ] Links between modules work
- [ ] Breadcrumb navigation correct
- [ ] Previous/next navigation functional

### Interactive Elements (15 minutes)

- [ ] Concept Playground loads
- [ ] Visualizations respond to slider input
- [ ] Export buttons download PNG/SVG
- [ ] Assessment quizzes function
- [ ] Quiz feedback displays
- [ ] Table of contents links work
- [ ] Mobile menu toggles

### Performance Checks (10 minutes)

- [ ] Pages load within 3 seconds
- [ ] Visualizations render smoothly (<500ms)
- [ ] No console errors
- [ ] Network requests complete
- [ ] Images load optimized
- [ ] Dark mode transitions smooth

### Analytics & Monitoring (5 minutes)

- [ ] Vercel Analytics dashboard shows traffic
- [ ] No deployment errors in logs
- [ ] Environment variables confirmed
- [ ] SSL certificate active (HTTPS)
- [ ] Redirects working

### Cross-Browser Testing (20 minutes)

Test on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Testing (20 minutes)

Test on:

- [ ] iOS (iPhone)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)
- [ ] Small screens (responsive)

### Accessibility Verification (10 minutes)

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels appropriate

### SEO Verification (5 minutes)

- [ ] Meta tags present
- [ ] Open Graph tags correct
- [ ] Sitemap accessible
- [ ] robots.txt configured
- [ ] Structured data valid

---

## Monitoring After Deployment

### Weekly Health Checks

1. **Performance**
   - Vercel Dashboard → Analytics
   - Check Core Web Vitals
   - Verify LCP < 2.5s, FID < 100ms, CLS < 0.1

2. **Errors**
   - Check deployment logs
   - Monitor Sentry (if enabled)
   - Review GitHub Actions workflow

3. **Uptime**
   - Vercel Dashboard shows 99.9%+ uptime
   - Set up status page monitoring

### Monthly Review

- Review analytics trends
- Update environment variables if needed
- Check for dependency updates
- Review deployment history
- Test all modules and features

### Continuous Improvements

After launch, consider:

1. **Performance Optimization**
   - Bundle size analysis
   - Image optimization
   - Cache optimization

2. **Content Updates**
   - Add new modules
   - Update visualizations with real data
   - Improve quiz questions

3. **Feature Enhancement**
   - User progress tracking
   - Community features
   - Advanced analytics

---

## Summary

You've successfully prepared the RLHF Illustrated Guide for Vercel deployment!

### Quick Reference

| Task             | Command                          |
| ---------------- | -------------------------------- |
| Local build test | `npm run build && npm run start` |
| Type check       | `npm run type-check`             |
| Lint check       | `npm run lint`                   |
| Deploy (CLI)     | `vercel --prod`                  |
| View logs        | `vercel logs`                    |
| Check status     | `vercel status`                  |

### Files Created/Updated

- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.example` - Environment template
- ✅ `.github/workflows/ci.yml` - CI/CD pipeline
- ✅ `next.config.js` - Already optimized
- ✅ `package.json` - All dependencies included

### Next Steps

1. Push code to GitHub
2. Go to Vercel Dashboard
3. Import repository
4. Add environment variables
5. Click Deploy
6. Run post-deployment checklist
7. Set up custom domain (optional)
8. Monitor performance and analytics

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Support**: https://vercel.com/support
- **Project Issues**: GitHub Issues in this repository

---

**Last Updated**: 2024 **Vercel Version**: V2 (Serverless Functions API)
**Next.js Version**: 14.2.15+
