# n8n to App Builder

Convert n8n workflows into production-ready Next.js web applications with automated deployment.

## Project Purpose

Transform n8n workflows into standalone web apps with proper data intake/output, optimized front-ends, and automated CI/CD via GitHub → Vercel.

## Workflow

### 1. Workflow Validation & Optimization
- Analyze n8n workflow structure using n8n MCP tools
- Verify proper data intake (webhook/trigger configuration)
- Validate data output format for front-end consumption
- Optimize nodes for web app integration
- Document expected input/output schemas

### 2. Front-End Development
- Build Next.js + React interface
- Style with Tailwind CSS + Shadcn/ui components
- Connect to n8n workflow endpoints
- Handle loading states, errors, and responses
- Test locally with development environment

### 3. Deployment Pipeline
- Push to GitHub repository
- Deploy to Vercel with auto-sync
- Configure environment variables (n8n webhook URLs, API keys)
- Verify production deployment

## Tech Stack

- **Front-end**: Next.js 14+, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: n8n workflows (webhook triggers)
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Version Control**: Git/GitHub

## Available Tools

- **n8n MCP**: Access n8n instance, view/modify workflows, validate configurations
- **n8n Skills**: Workflow pattern guidance, node configuration, expression syntax
- **Front-end Designer Skill**: UI/UX implementation patterns
- **GitHub MCP**: Repository management and push automation

## Project Structure

```
/
├── apps/                    # Individual workflow apps
│   └── [workflow-name]/    # One folder per workflow
│       ├── app/            # Next.js app directory
│       ├── components/     # React components
│       ├── lib/            # Utilities and API calls
│       ├── public/         # Static assets
│       └── package.json
├── shared/                 # Shared components/utilities
│   ├── components/         # Reusable UI components
│   └── lib/               # Shared utilities
└── docs/                  # Documentation
    └── workflows/         # Workflow-specific docs
```

## Development Guidelines

### Single-Page Apps
- Each workflow = one focused interface
- Clear input → processing → output flow
- Minimal navigation, maximum usability

### Code Organization
- Keep components small and focused
- Extract reusable logic to `/shared`
- Document n8n webhook URLs and data schemas
- Use TypeScript for type safety

### n8n Integration
- Use webhook triggers for all workflows
- Standardize response format: `{ success: boolean, data: any, error?: string }`
- Handle n8n timeout scenarios (30s+ processes)
- Validate inputs match workflow expectations

### Deployment Checklist
- [ ] Environment variables configured in Vercel
- [ ] n8n webhook URLs point to production instance
- [ ] CORS configured if needed
- [ ] Error handling tested
- [ ] Loading states implemented
- [ ] Mobile responsive

## Workflow Optimization Checklist

Before building the front-end, ensure:
- [ ] Workflow has webhook/form trigger node
- [ ] Input validation configured in n8n
- [ ] Response format standardized
- [ ] Error handling nodes present
- [ ] Timeout considerations addressed
- [ ] Test data documented

## Quick Start

1. **Validate workflow**: Use n8n MCP to inspect and optimize workflow
2. **Create app structure**: Set up Next.js project in `/apps/[workflow-name]`
3. **Build interface**: Implement form/UI matching workflow inputs
4. **Test locally**: Verify against n8n development instance
5. **Deploy**: Push to GitHub, deploy via Vercel
6. **Verify**: Test production deployment end-to-end

## Notes

- Keep apps lean and focused
- Prioritize user experience over feature bloat
- Document workflow changes that affect front-end
- Test thoroughly before deploying to production
