# Next Steps

The n8n to App Builder project structure has been completely set up! Here's what to do next:

## 1. Install PNPM (Required)

First, install pnpm globally if you haven't already:

```bash
npm install -g pnpm
```

Verify installation:
```bash
pnpm --version
```

## 2. Install Dependencies

From the project root:

```bash
pnpm install
```

This will:
- Install all dependencies for all packages
- Link workspace packages together
- Set up the monorepo structure

## 3. Verify Setup

Run these commands to ensure everything is working:

```bash
# Type-check all packages
pnpm --filter "@repo/ui" type-check
pnpm --filter "@repo/lib" type-check

# Check example app
pnpm --filter example-workflow type-check
```

## 4. Configure Your First Workflow App

The example-workflow app has been created. To configure it:

```bash
cd apps/example-workflow
cp .env.example .env.local
```

Edit `.env.local` and add your n8n webhook configuration:

```env
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV=https://your-n8n-instance.com/webhook
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD=https://your-n8n-production.com/webhook
WORKFLOW_ID=your-workflow-id
```

## 5. Create Your n8n Workflow

In your n8n instance, create a workflow with:

1. **Webhook Trigger Node**
   - HTTP Method: POST
   - Path: `/example-workflow` (or your chosen path)
   - Response Mode: "Respond to Webhook"

2. **Processing Logic**
   - Add your workflow logic
   - Transform data as needed

3. **Response Node**
   Return this format:
   ```json
   {
     "success": true,
     "data": {
       "result": "your processed data"
     }
   }
   ```

4. **Activate the workflow**

5. Copy the webhook URL to your `.env.local`

## 6. Test the Example App

From the project root:

```bash
pnpm --filter example-workflow dev
```

Open [http://localhost:3000](http://localhost:3000)

Test the form:
- Enter some input
- Click Submit
- Verify it calls your n8n workflow
- Check the response is displayed

## 7. Customize the Example App

Now customize the app for your specific workflow:

### Update Input Schema
Edit `apps/example-workflow/src/components/workflow-form.tsx`:

```typescript
const formSchema = z.object({
  // Define your workflow inputs
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});
```

### Update Form Fields
In the same file, update the form JSX to match your schema.

### Update Result Display
Edit `apps/example-workflow/src/components/result-display.tsx` to format your workflow output.

### Update Metadata
Edit `apps/example-workflow/src/app/layout.tsx` to update title and description.

### Update README
Edit `apps/example-workflow/README.md` with your workflow documentation.

## 8. Create Additional Workflow Apps

When ready to create more apps:

```bash
./scripts/create-workflow-app.sh my-new-workflow
cd apps/my-new-workflow
cp .env.example .env.local
# Configure and develop
```

## 9. Deploy to Vercel

When your app is ready for production:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add example-workflow app"
   git push origin main
   ```

2. **Create Vercel Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure:
     - Root Directory: `apps/example-workflow`
     - Framework: Next.js
     - Build Command: (leave default)

3. **Set Environment Variables**
   In Vercel dashboard, add:
   - `NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD`
   - `NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV`
   - `WORKFLOW_ID`

4. **Deploy**

See [docs/deployment.md](./docs/deployment.md) for detailed deployment instructions.

## 10. Enable CI/CD

The GitHub Actions workflow is already configured but needs your app name.

Edit `.github/workflows/ci.yml`:

```yaml
matrix:
  app: [example-workflow]  # Add your app names here
```

This will run tests on every push.

## Project Structure Overview

```
/
├── apps/
│   └── example-workflow/        # ✅ Your first workflow app
├── packages/
│   ├── typescript-config/       # ✅ Shared TS configs
│   ├── eslint-config/          # ✅ Shared lint configs
│   ├── ui/                     # ✅ Shared components (Shadcn/ui)
│   └── lib/                    # ✅ n8n utilities
├── templates/
│   └── workflow-app/           # ✅ Template for new apps
├── scripts/
│   └── create-workflow-app.sh  # ✅ App generator
├── docs/                       # ✅ Complete documentation
└── .github/workflows/          # ✅ CI/CD setup
```

## Available Commands

```bash
# Development
pnpm dev                              # Run all apps
pnpm --filter example-workflow dev    # Run specific app

# Building
pnpm build                            # Build all apps
pnpm --filter example-workflow build  # Build specific app

# Code Quality
pnpm lint                             # Lint all packages
pnpm type-check                       # Type-check all packages
pnpm format                           # Format all code

# Creating Apps
./scripts/create-workflow-app.sh my-app  # Generate new app
```

## Documentation

All documentation is in the [docs/](./docs/) directory:

- [docs/setup.md](./docs/setup.md) - Detailed setup instructions
- [docs/creating-apps.md](./docs/creating-apps.md) - How to create apps
- [docs/deployment.md](./docs/deployment.md) - Vercel deployment
- [docs/workflow-standards.md](./docs/workflow-standards.md) - n8n best practices

## Common Issues

### pnpm not found
Install pnpm globally: `npm install -g pnpm`

### Module not found errors
Run `pnpm install` from project root

### TypeScript errors
Check imports from `@repo/ui` and `@repo/lib` are correct

### n8n webhook not responding
- Verify workflow is active in n8n
- Check webhook URL in `.env.local`
- Test webhook with curl first

## Getting Help

- Check [documentation](./docs/)
- Review [workflow standards](./docs/workflow-standards.md)
- Look at [example-workflow](./apps/example-workflow) as reference
- Check [troubleshooting](./docs/README.md#troubleshooting)

## What's Complete

✅ PNPM workspace monorepo structure
✅ Shared TypeScript, ESLint, and Prettier configs
✅ Shared UI package with Shadcn/ui and Tailwind CSS
✅ Shared n8n integration utilities
✅ Workflow app template with Next.js 14
✅ App generator script
✅ Example workflow app
✅ Comprehensive documentation
✅ GitHub Actions CI workflow
✅ Git repository initialized

## What's Next

🔲 Install pnpm and dependencies
🔲 Create your n8n workflow
🔲 Configure example-workflow app
🔲 Test locally
🔲 Customize for your use case
🔲 Deploy to Vercel
🔲 Create additional workflow apps

---

**You're all set to start building!** 🚀

Start with step 1 (install pnpm) and work your way through the list.
