# n8n to App Builder

A PNPM workspace monorepo for converting n8n workflows into production-ready Next.js web applications with automated GitHub → Vercel deployment.

## Features

- **Workflow App Generator**: Create new workflow apps from templates with one command
- **Shared Components**: Reusable UI components built with Shadcn/ui and Tailwind CSS
- **Type-Safe**: Full TypeScript support across all packages
- **Monorepo Structure**: Efficient development with PNPM workspaces
- **CI/CD Ready**: GitHub Actions for automated testing and Vercel for deployment
- **n8n Integration**: Standardized webhook client with error handling and timeouts

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- n8n instance (cloud or self-hosted)

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd n8n-to-app-builder
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Create your first workflow app
   ```bash
   ./scripts/create-workflow-app.sh my-workflow
   ```

4. Configure environment
   ```bash
   cd apps/my-workflow
   cp .env.example .env.local
   # Edit .env.local with your n8n webhook URL
   ```

5. Start development server
   ```bash
   cd ../..
   pnpm --filter my-workflow dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── apps/                           # Workflow applications
│   └── example-workflow/          # Example app
├── packages/                       # Shared libraries
│   ├── typescript-config/         # Shared TypeScript configs
│   ├── eslint-config/             # Shared ESLint configs
│   ├── ui/                        # Shared UI components (Shadcn/ui)
│   └── lib/                       # Utilities & n8n client
├── templates/                      # App templates
│   └── workflow-app/              # Next.js app template
├── scripts/                        # Automation scripts
│   └── create-workflow-app.sh     # App generator
├── docs/                          # Documentation
└── .github/workflows/             # CI/CD
```

## Documentation

- [Setup Guide](./docs/setup.md) - Detailed installation instructions
- [Creating Apps](./docs/creating-apps.md) - How to create workflow apps
- [Deployment](./docs/deployment.md) - Vercel deployment guide
- [Workflow Standards](./docs/workflow-standards.md) - n8n workflow best practices

## Common Commands

From project root:

```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Lint all packages
pnpm lint

# Type-check all packages
pnpm type-check

# Format code
pnpm format

# Run specific app
pnpm --filter my-workflow dev
```

## Tech Stack

- **Package Manager**: PNPM 8+ with workspaces
- **Front-end**: Next.js 14+ (App Router), React 18, TypeScript 5
- **Styling**: Tailwind CSS 3 + Shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Backend**: n8n workflows via webhook triggers
- **Deployment**: Vercel (separate project per app)
- **CI**: GitHub Actions

## Workflow Integration

### Standard Response Format

All n8n workflows should return responses in this format:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

### Environment Variables

Each app requires:

```env
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV=https://your-n8n.com/webhook
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD=https://your-n8n-prod.com/webhook
WORKFLOW_ID=your-workflow-id
```

## Deployment

Each workflow app deploys independently to Vercel:

1. Push to GitHub
2. Create Vercel project
3. Configure root directory: `apps/[app-name]`
4. Set environment variables
5. Deploy

See [Deployment Guide](./docs/deployment.md) for details.

## Creating New Workflow Apps

1. **Generate from template**
   ```bash
   ./scripts/create-workflow-app.sh my-workflow
   ```

2. **Configure environment**
   ```bash
   cd apps/my-workflow
   cp .env.example .env.local
   # Edit .env.local
   ```

3. **Customize the app**
   - Update input schema in `src/components/workflow-form.tsx`
   - Customize result display in `src/components/result-display.tsx`
   - Update metadata in `src/app/layout.tsx`

4. **Test locally**
   ```bash
   pnpm --filter my-workflow dev
   ```

5. **Deploy to Vercel**
   See [Deployment Guide](./docs/deployment.md)

## Shared Packages

### @repo/ui

Shared UI components built with Shadcn/ui and Tailwind CSS.

```typescript
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
```

### @repo/lib

Shared utilities and n8n integration client.

```typescript
import { callN8nWebhook, getWebhookUrl } from "@repo/lib/n8n";
import { N8nResponse } from "@repo/lib/types";
```

### @repo/typescript-config

Shared TypeScript configurations.

```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

### @repo/eslint-config

Shared ESLint configurations.

```javascript
module.exports = {
  extends: ["@repo/eslint-config/next.js"]
};
```

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests: `pnpm type-check && pnpm lint`
4. Commit and push
5. Create pull request

## License

MIT

## Support

For issues or questions:
- Check the [documentation](./docs/)
- Review [workflow standards](./docs/workflow-standards.md)
- Check [troubleshooting](./docs/README.md#troubleshooting)
