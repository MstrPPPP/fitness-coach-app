# Deployment Guide

## Vercel Deployment

### First-Time Setup

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add my-workflow app"
   git push origin main
   ```

2. **Create Vercel Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Configure Project"

3. **Configure for Monorepo**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/my-workflow` (your app name)
   - **Build Command**: Leave default or use `pnpm build`
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: `pnpm install`

4. **Set Ignored Build Step** (Important!)
   In Vercel Project Settings → Git:
   - Set "Ignored Build Step" to:
     ```bash
     git diff HEAD^ HEAD --quiet .
     ```

   This ensures the app only deploys when its files change, not when other apps in the monorepo change.

5. **Configure Environment Variables**
   In Vercel Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD` - Production n8n webhook URL
   - `NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV` - Development n8n webhook URL
   - `WORKFLOW_ID` - Your n8n workflow ID
   - Any other workflow-specific variables

6. **Deploy**
   Click "Deploy" and wait for the build to complete.

### Multiple Apps in Monorepo

Each workflow app needs its own Vercel project. Repeat the above steps for each app:
- Create separate Vercel project
- Set root directory to `apps/[app-name]`
- Configure environment variables per project
- Set ignored build step

Benefits:
- Independent deployments
- Separate URLs per workflow
- Isolated environment variables
- Independent rollbacks

### Deployment Workflow

1. **Make changes** to your workflow app
2. **Test locally**
   ```bash
   pnpm --filter my-workflow dev
   ```
3. **Commit and push**
   ```bash
   git add apps/my-workflow
   git commit -m "Update my-workflow"
   git push origin main
   ```
4. **Vercel auto-deploys** only the changed app (thanks to ignored build step)
5. **Verify deployment** at your Vercel URL

### Custom Domains

To add a custom domain:

1. Go to Vercel Project Settings → Domains
2. Add your domain (e.g., `my-workflow.example.com`)
3. Configure DNS records as instructed by Vercel
   - Add CNAME or A record
   - Wait for DNS propagation (up to 48 hours)
4. Vercel automatically provisions SSL certificate

### Environment Variables Best Practices

**Development vs Production:**
```env
# Development (local .env.local)
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV=http://localhost:5678/webhook
WORKFLOW_ID=dev-workflow-id

# Production (Vercel dashboard)
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD=https://n8n.production.com/webhook
WORKFLOW_ID=prod-workflow-id
```

**Security:**
- Never commit `.env.local` files
- Use `NEXT_PUBLIC_` prefix only for client-side variables
- Keep API keys server-side only (no `NEXT_PUBLIC_` prefix)
- Use different n8n instances for dev/prod

### Monitoring Deployments

**Vercel Dashboard:**
- View deployment logs
- Monitor build times
- Check runtime logs
- View analytics

**Deployment Status:**
- Green checkmark = successful
- Red X = failed (check logs)
- Yellow = building

### Rollback

If a deployment has issues:

1. Go to Vercel Project → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"
4. Instant rollback complete

### Troubleshooting

**Build Fails:**
- Check Vercel build logs
- Verify `pnpm install` succeeds
- Check TypeScript errors: `pnpm type-check`
- Verify imports from `@repo/ui` and `@repo/lib`

**Runtime Errors:**
- Check Vercel runtime logs
- Verify environment variables are set
- Test API routes with Vercel URL
- Check n8n webhook is accessible from Vercel

**Ignored Build Step Not Working:**
- Verify command: `git diff HEAD^ HEAD --quiet .`
- Check it's set in Project Settings → Git
- Ensure you're committing changes to the app directory

**CORS Errors:**
- Configure CORS in n8n webhook node
- Allow Vercel deployment URL
- Allow custom domain if configured

### Production Checklist

Before going live:
- [ ] Environment variables configured
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] n8n production webhook tested
- [ ] Error handling tested
- [ ] Loading states work correctly
- [ ] Mobile responsive verified
- [ ] Analytics configured (optional)
- [ ] Monitoring set up (optional)

### CI/CD with GitHub Actions

See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) for automated testing before deployment.

The CI workflow:
- Runs on every push/PR
- Lints all code
- Type-checks all packages
- Builds all apps
- Prevents broken code from deploying
