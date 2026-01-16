# n8n to App Builder Documentation

## Overview
This documentation covers the n8n to App Builder monorepo structure, workflows, and deployment processes.

## Directory Structure
- [Setup Guide](./setup.md) - Initial project setup
- [Creating New Apps](./creating-apps.md) - How to create workflow apps
- [Deployment](./deployment.md) - Vercel deployment guide
- [Workflow Standards](./workflow-standards.md) - n8n workflow best practices
- [Workflows](./workflows/) - Individual workflow documentation

## Quick Links
- Project Structure - See root README.md
- Shared Components - See packages/ui
- Troubleshooting - See below

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a new workflow app:
   ```bash
   ./scripts/create-workflow-app.sh my-workflow
   ```

3. Configure and run:
   ```bash
   cd apps/my-workflow
   cp .env.example .env.local
   # Edit .env.local with your n8n webhook URL
   pnpm dev
   ```

## Troubleshooting

### Module not found errors
Run `pnpm install` at the project root.

### Tailwind styles not applying
Check that `tailwind.config.ts` includes the correct content paths.

### TypeScript errors
Run `pnpm type-check` to see all type errors across the monorepo.

### n8n webhook CORS errors
Configure CORS settings in your n8n webhook node.
