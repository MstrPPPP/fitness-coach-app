# Setup Guide

## Prerequisites
- Node.js 18+
- pnpm 8+
- n8n instance (cloud or self-hosted)
- Vercel account (for deployment)
- GitHub account

## Initial Setup

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd n8n-to-app-builder
   ```

2. **Install pnpm** (if not already installed)
   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Verify installation**
   ```bash
   pnpm --filter "@repo/ui" type-check
   pnpm --filter "@repo/lib" type-check
   ```

## Project Structure

```
/
├── apps/                    # Workflow applications
├── packages/                # Shared code
│   ├── typescript-config/  # TypeScript configurations
│   ├── eslint-config/      # ESLint configurations
│   ├── ui/                 # Shared UI components
│   └── lib/                # Utilities and n8n client
├── templates/              # App templates
├── scripts/                # Helper scripts
├── docs/                   # Documentation
└── .github/                # CI/CD workflows
```

## Creating Your First App

See [Creating Apps Guide](./creating-apps.md) for detailed instructions.

Quick version:
```bash
./scripts/create-workflow-app.sh my-first-workflow
cd apps/my-first-workflow
cp .env.example .env.local
# Edit .env.local
pnpm dev
```

## Common Commands

From project root:
- `pnpm install` - Install all dependencies
- `pnpm dev` - Run all apps in dev mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Type-check all packages

For specific apps:
- `pnpm --filter my-workflow dev` - Run specific app
- `pnpm --filter my-workflow build` - Build specific app
