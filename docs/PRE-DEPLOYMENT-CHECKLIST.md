# Pre-Deployment Checklist - RLHF Illustrated Guide

Complete this checklist before deploying to Vercel to ensure a smooth production
launch.

## 1. Code Quality ✓

### TypeScript & Linting

- [ ] Run `npm run type-check` - no errors

  ```bash
  npm run type-check
  ```

- [ ] Run `npm run lint` - no errors

  ```bash
  npm run lint
  ```

- [ ] Fix any issues
  ```bash
  npm run lint:fix
  ```

### Build Verification

- [ ] Clear build cache

  ```bash
  rm -rf .next
  ```

- [ ] Install clean dependencies

  ```bash
  npm ci
  ```

- [ ] Production build succeeds

  ```bash
  npm run build
  ```

- [ ] No build warnings (check terminal output)

- [ ] Build time is reasonable (<3 minutes)

### Runtime Testing

- [ ] Test production build locally

  ```bash
  npm run start
  ```

- [ ] Visit http://localhost:3000
  - [ ] Home page loads
  - [ ] Navigation works
  - [ ] All modules accessible
  - [ ] Visualizations render correctly
  - [ ] No console errors (F12 → Console)

- [ ] Test in incognito/private mode (clear cache)

---

## 2. Content & Assets ✓

### MDX Modules

- [ ] All 12 modules present

  ```bash
  ls -la content/modules/
  ```

- [ ] Check module files:
  - [ ] introduction.mdx
  - [ ] reward-modeling.mdx
  - [ ] policy-gradients.mdx
  - [ ] direct-preference-optimization.mdx
  - [ ] problem-setup.mdx
  - [ ] instruction-tuning.mdx
  - [ ] regularization.mdx
  - [ ] rejection-sampling.mdx
  - [ ] constitutional-ai.mdx
  - [ ] reasoning-training.mdx
  - [ ] tool-use.mdx
  - [ ] advanced-topics.mdx

- [ ] All modules have no syntax errors

  ```bash
  npm run build
  ```

- [ ] Verify module metadata in `src/lib/modules.ts`
  - [ ] All 12 modules listed
  - [ ] Status marked correctly (available/coming-soon)
  - [ ] Correct phase assignments

- [ ] Check content rendering locally
  - [ ] Visit `/modules/introduction`
  - [ ] Verify equations render (KaTeX)
  - [ ] Check code blocks format correctly
  - [ ] Confirm images/SVGs load

### Images & Assets

- [ ] All images optimized
  - [ ] Using Next.js Image component
  - [ ] Proper dimensions specified
  - [ ] WebP/AVIF format supported

- [ ] SVG files properly configured
  - [ ] Using @svgr/webpack
  - [ ] No external SVG dependencies

- [ ] Public assets present
  ```bash
  ls -la public/
  ```

---

## 3. Environment Configuration ✓

### Environment Variables

- [ ] `.env.example` updated with all needed variables
- [ ] Review `.env.example`:

  ```bash
  cat .env.example
  ```

- [ ] Local `.env.local` has test values

  ```bash
  cat .env.local | head -20
  ```

- [ ] No secrets committed to git

  ```bash
  git log -p | grep -i "secret\|token\|password"
  # Should return nothing
  ```

- [ ] Production environment variables documented
  - [ ] `NEXT_PUBLIC_SITE_URL`
  - [ ] `NEXT_PUBLIC_SITE_NAME`
  - [ ] Feature flags set correctly

### Configuration Files

- [ ] `next.config.js` optimized
  - [ ] MDX configuration present
  - [ ] Security headers configured
  - [ ] Image optimization enabled
  - [ ] Webpack optimization for D3/Framer

- [ ] `vercel.json` present and configured

  ```bash
  cat vercel.json
  ```

- [ ] `.vercelignore` created
  ```bash
  cat .vercelignore
  ```

---

## 4. Git & Version Control ✓

### Repository Status

- [ ] Working directory clean

  ```bash
  git status
  # Should show nothing to commit
  ```

- [ ] All changes committed

  ```bash
  git add .
  git commit -m "chore: prepare production deployment"
  ```

- [ ] Pushed to GitHub

  ```bash
  git push origin main
  ```

- [ ] Remote branch matches local
  ```bash
  git fetch origin
  git status  # Should show "up to date"
  ```

### Repository Configuration

- [ ] `.gitignore` updated

  ```bash
  cat .gitignore | grep -E "vercel|.next|node_modules"
  ```

- [ ] No lock file conflicts
  ```bash
  git diff package-lock.json  # Should be clean
  ```

---

## 5. Dependencies ✓

### Package Management

- [ ] All dependencies listed in package.json

  ```bash
  cat package.json | grep '"dependencies"' -A 20
  ```

- [ ] No security vulnerabilities

  ```bash
  npm audit
  # Review any warnings
  ```

- [ ] No unused dependencies
  ```bash
  npm prune --production
  npm ls --depth=0
  ```

### Critical Dependencies Verified

- [ ] React 18.3.1+

  ```bash
  npm ls react
  ```

- [ ] Next.js 14.2.15+

  ```bash
  npm ls next
  ```

- [ ] TypeScript 5.6.3+

  ```bash
  npm ls typescript
  ```

- [ ] D3.js 7.9.0+

  ```bash
  npm ls d3
  ```

- [ ] Framer Motion 11.11.17+

  ```bash
  npm ls framer-motion
  ```

- [ ] KaTeX 0.16.11+
  ```bash
  npm ls katex
  ```

---

## 6. Performance Checks ✓

### Bundle Size

- [ ] Build bundle size reasonable

  ```bash
  npm run build
  # Check terminal output for size warnings
  ```

- [ ] No extremely large assets
  ```bash
  find public -type f -size +500k
  # Should be empty or minimal
  ```

### Page Performance Locally

- [ ] Home page loads quickly (<3 seconds)
- [ ] Module pages load quickly (<3 seconds)
- [ ] Visualizations render smoothly (<500ms)
- [ ] Playground loads without lag
- [ ] Dark mode toggle instant
- [ ] Navigation smooth (no jank)

### Network Simulation

Test on slow connection (Chrome DevTools):

- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Set throttling to "Slow 3G"
- [ ] Reload and verify:
  - [ ] Site loads within 5 seconds
  - [ ] Content visible before interactive
  - [ ] No blank screens

---

## 7. Browser Compatibility ✓

### Desktop Browsers

- [ ] **Chrome 90+**
  - [ ] Site loads
  - [ ] Navigation works
  - [ ] Visualizations render

- [ ] **Firefox 88+**
  - [ ] Site loads
  - [ ] No console errors
  - [ ] Styling correct

- [ ] **Safari 14+**
  - [ ] Site loads
  - [ ] Mobile menu works
  - [ ] Dark mode supported

- [ ] **Edge 90+**
  - [ ] Site loads
  - [ ] All features functional

### Mobile Browsers

- [ ] **iOS Safari (14+)**
  - [ ] Responsive layout works
  - [ ] Touch interactions functional
  - [ ] No zoom bugs

- [ ] **Android Chrome**
  - [ ] Responsive layout works
  - [ ] Visualizations interactive
  - [ ] No layout shifts

---

## 8. Accessibility ✓

### Keyboard Navigation

- [ ] Tab through entire site works
- [ ] Focus visible on all interactive elements
- [ ] Escape key closes menus
- [ ] No keyboard traps

### Screen Reader

- [ ] Headings properly structured (h1 → h2 → h3)
- [ ] ARIA labels present on:
  - [ ] Sliders in visualizations
  - [ ] Theme toggle
  - [ ] Mobile menu button
  - [ ] Links in sidebar

- [ ] Alternative text for:
  - [ ] Visualizations
  - [ ] Icons
  - [ ] Images

### Color Contrast

- [ ] Text contrast ≥ 4.5:1 (WCAG AA)
  - [ ] Use DevTools accessibility checker
  - [ ] Test both light and dark modes

- [ ] No color-only information
  - [ ] Status indicators have text/icons
  - [ ] Links distinguishable beyond color

---

## 9. SEO & Meta ✓

### Metadata

- [ ] Check head tags in browser DevTools

  ```html
  <title>...</title> <meta name="description" content="..." />
  ```

- [ ] Open Graph tags present

  ```html
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
  ```

- [ ] Favicon present
  ```bash
  ls -la public/favicon.ico
  ```

### Structured Data

- [ ] JSON-LD schema present (check with
      [Schema.org validator](https://validator.schema.org))
- [ ] No validation errors

### Robots & Crawling

- [ ] Check robots.txt

  ```bash
  curl http://localhost:3000/robots.txt
  ```

- [ ] Check sitemap
  ```bash
  curl http://localhost:3000/sitemap.xml
  ```

---

## 10. Security ✓

### Headers

- [ ] All security headers present (check with
      [securityheaders.com](https://securityheaders.com))
  ```bash
  # After Vercel deployment, run:
  curl -I https://your-domain.vercel.app
  ```

Expected headers:

- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Strict-Transport-Security` present
- [ ] `Content-Security-Policy` present
- [ ] `Referrer-Policy` present
- [ ] `Permissions-Policy` present

### Dependencies

- [ ] No known vulnerabilities

  ```bash
  npm audit --production
  ```

- [ ] Dependencies up to date

  ```bash
  npm outdated
  ```

- [ ] No hardcoded secrets
  ```bash
  git log -p | grep -i "secret\|password\|token\|key"
  # Should return nothing
  ```

### HTTPS

- [ ] Production will use HTTPS (Vercel auto-enables)
- [ ] Verified no mixed content warnings

---

## 11. Vercel Preparation ✓

### Vercel Account

- [ ] Vercel account created
- [ ] GitHub account connected
- [ ] Repository accessible to Vercel

### Project Settings

- [ ] Prepare Vercel project configuration in mind:
  - [ ] Node.js version: 18.x (Vercel default)
  - [ ] Build command: `npm run build`
  - [ ] Install command: `npm install`
  - [ ] Output directory: `.next`
  - [ ] Development command: `npm run dev`

- [ ] Environment variables prepared:
  - [ ] List all NEXT*PUBLIC*\* variables
  - [ ] Get values for analytics IDs (if using)
  - [ ] Prepare feature flag values

### Domain Preparation

- [ ] Domain registered (if using custom domain)
- [ ] Registrar account accessible
- [ ] DNS settings verified

---

## 12. Documentation ✓

### Project Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT.md complete and accurate
- [ ] CLAUDE.md follows guidelines
- [ ] Inline code comments for complex logic

### Comments & Cleanup

- [ ] Remove all `console.log` statements

  ```bash
  grep -r "console.log" src/ --include="*.ts" --include="*.tsx"
  # Should be empty
  ```

- [ ] Remove all `// TODO` comments

  ```bash
  grep -r "TODO\|FIXME\|HACK" src/ --include="*.ts" --include="*.tsx"
  # Review any remaining
  ```

- [ ] Remove debug code
- [ ] Remove commented-out code

---

## 13. Final Verification ✓

### Full Build Test

```bash
# Clean installation simulation
rm -rf node_modules .next
npm ci
npm run lint
npm run type-check
npm run build
npm run start
```

All commands should succeed without errors.

### Manual Testing Checklist

Visit http://localhost:3000 and verify:

- [ ] **Home Page**
  - [ ] Hero section displays
  - [ ] Learning path visible
  - [ ] Analogy cards present
  - [ ] CTA buttons work

- [ ] **Modules Page**
  - [ ] All 12 modules listed
  - [ ] Module cards clickable
  - [ ] Sidebar visible

- [ ] **Module Content**
  - [ ] Load `/modules/introduction`
  - [ ] Equation section displays
  - [ ] Visualization loads
  - [ ] Quiz appears
  - [ ] Previous/Next navigation works

- [ ] **Playground**
  - [ ] Load `/playground`
  - [ ] Scenarios load
  - [ ] Sliders interactive
  - [ ] Export works

- [ ] **Navigation**
  - [ ] Breadcrumbs correct
  - [ ] Sidebar navigation works
  - [ ] Mobile menu toggles
  - [ ] Active states highlight

- [ ] **Dark Mode**
  - [ ] Toggle works
  - [ ] Persists on reload
  - [ ] Proper contrast in both modes

- [ ] **Mobile Responsiveness**
  - [ ] Use Chrome DevTools (F12)
  - [ ] Test at 375px width (mobile)
  - [ ] Test at 768px width (tablet)
  - [ ] Test at 1024px width (desktop)
  - [ ] All content readable
  - [ ] Touch targets adequate (≥48px)

---

## 14. Commit & Push ✓

```bash
# Verify everything is ready
git status
# Should be clean

# Final commit
git add .
git commit -m "feat: production-ready deployment preparation

- Add vercel.json configuration with optimized settings
- Update next.config.js with production optimizations
- Create comprehensive DEPLOYMENT.md guide
- Set up GitHub Actions CI/CD pipeline
- Update .env.example with all required variables
- Add .vercelignore for build optimization
- Pass all pre-deployment checks"

# Push to GitHub
git push origin main

# Verify remote is updated
git status
# Should show "Your branch is up to date with 'origin/main'"
```

---

## 15. Ready to Deploy ✓

Once all items above are checked, you are ready to deploy!

### Deployment Options

**Option A: Web UI (Recommended)**

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select your GitHub repository
4. Configure settings (auto-detected)
5. Click "Deploy"

**Option B: CLI**

```bash
vercel login
vercel
# Follow prompts
vercel --prod
```

### Post-Deployment

After deployment:

- [ ] Site loads at Vercel URL
- [ ] Run post-deployment checklist from DEPLOYMENT.md
- [ ] Set up custom domain (if applicable)
- [ ] Configure analytics
- [ ] Monitor performance

---

## Summary

| Checklist Section     | Status      |
| --------------------- | ----------- |
| Code Quality          | ✅ Complete |
| Content & Assets      | ✅ Complete |
| Environment           | ✅ Complete |
| Git & Version Control | ✅ Complete |
| Dependencies          | ✅ Complete |
| Performance           | ✅ Complete |
| Browser Compatibility | ✅ Complete |
| Accessibility         | ✅ Complete |
| SEO & Meta            | ✅ Complete |
| Security              | ✅ Complete |
| Vercel Preparation    | ✅ Complete |
| Documentation         | ✅ Complete |
| Final Verification    | ✅ Complete |
| Commit & Push         | ✅ Complete |

### ✅ Ready to Deploy!

All checks passed. Proceed with confidence!

---

**Last Updated**: 2024 **For Issues**: Check DEPLOYMENT.md Troubleshooting
section
