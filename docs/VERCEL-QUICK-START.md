# Vercel Deployment - Quick Start Guide

**⚡ Get your RLHF Illustrated Guide live in 5 minutes!**

## The 5-Minute Setup

### Step 1: Verify Your Code (1 min)

```bash
# Make sure everything is committed
git status
# Should show "nothing to commit, working tree clean"

# Push to GitHub
git push origin main
```

### Step 2: Create Vercel Account (1 min)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (fastest option)
3. Authorize Vercel to access your repositories

### Step 3: Import Project (1 min)

1. Click **"New Project"** on Vercel Dashboard
2. Click **"Import Git Repository"**
3. Select `illustrated-rlhf` repository
4. Click **"Import"**

### Step 4: Configure & Deploy (2 min)

Vercel auto-detects everything:

- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Install Command: `npm install`
- ✅ Output Directory: `.next`

**Just click "Deploy"!**

### That's it! 🎉

Your site is now live at `https://<your-project>.vercel.app`

---

## Add Environment Variables

After initial deployment, add these in **Vercel Dashboard → Settings →
Environment Variables**:

```env
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NEXT_PUBLIC_SITE_NAME=RLHF Illustrated Guide
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PLAYGROUND=true
```

Then redeploy from the Deployments tab.

---

## Setup Custom Domain (Optional)

1. Register domain (e.g., `illustrated-rlhf.com`)
2. Vercel Dashboard → Project Settings → Domains
3. Add your domain
4. Follow DNS instructions (usually 1 click with Vercel nameservers)
5. Done! SSL auto-provisioned in 24 hours

---

## Setup GitHub Actions (Optional)

GitHub Actions will auto-deploy on every push to main:

1. Get Vercel tokens from `vercel tokens create`
2. Add to GitHub → Settings → Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Workflow auto-runs on push (already configured in `.github/workflows/ci.yml`)

---

## For Complete Details

See **DEPLOYMENT.md** for:

- Environment configuration
- Custom domain setup
- GitHub Actions CI/CD
- Monitoring & analytics
- Troubleshooting

---

## Pre-Flight Checklist

Before deployment, run:

```bash
npm run type-check      # Check TypeScript
npm run lint            # Check linting
npm run build           # Test production build
npm run start           # Test locally
```

Visit http://localhost:3000 and verify:

- ✅ Home page loads
- ✅ Modules accessible
- ✅ Visualizations working
- ✅ Dark mode functional
- ✅ Mobile responsive

---

## Deployment Status

1. **Building** (2-3 min): Vercel compiles your code
2. **Deployed** ✅: Click the live URL
3. **Production** 🎉: Your site is live!

---

## Common Issues

| Issue                    | Solution                                        |
| ------------------------ | ----------------------------------------------- |
| **Build fails**          | Check build logs, run `npm run build` locally   |
| **Env vars not working** | Added to Vercel? Redeploy? NEXT*PUBLIC* prefix? |
| **Module not loading**   | Verify in `src/lib/modules.ts`                  |
| **Visualizations blank** | Check D3 libraries loaded, use dynamic import   |

See **DEPLOYMENT.md Troubleshooting** for more.

---

## Next Steps

✅ **Deployed!** Now:

1. **Verify** - Run post-deployment checklist from DEPLOYMENT.md
2. **Setup Analytics** - Enable Vercel Analytics (free)
3. **Setup Monitoring** - Optional: Add Sentry error tracking
4. **Custom Domain** - Optional: Point your own domain

---

## Helpful Links

- 📖 [Full Deployment Guide](./DEPLOYMENT.md)
- ✅ [Pre-Deployment Checklist](./PRE-DEPLOYMENT-CHECKLIST.md)
- 🔧 [Vercel Docs](https://vercel.com/docs)
- 📱 [Next.js Docs](https://nextjs.org/docs/deployment)

---

**Questions?** Check DEPLOYMENT.md or Vercel dashboard logs

**Ready?** Go to [vercel.com/dashboard](https://vercel.com/dashboard) and click
"New Project" 🚀
