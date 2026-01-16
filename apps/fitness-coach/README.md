# [Workflow Name]

## Overview
Brief description of what this workflow does.

## n8n Workflow
- **Workflow ID**: `your-workflow-id`
- **Webhook URL**: `https://your-n8n.com/webhook/your-workflow-id`

## Input Schema
Describe expected inputs:
- `field1`: Description
- `field2`: Description

## Output Schema
Describe expected outputs:
- `result`: Description

## Local Development

1. Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```

2. Update environment variables in `.env.local`

3. Run development server
   ```bash
   pnpm dev
   ```

4. Visit [http://localhost:3000](http://localhost:3000)

## Deployment

This app is deployed to Vercel. Environment variables are configured in the Vercel dashboard.

### Vercel Configuration
- **Root Directory**: `apps/[workflow-name]`
- **Framework**: Next.js
- **Build Command**: (use default)
- **Environment Variables**: Configure in Vercel dashboard

## Testing

Test the workflow with sample data:
```json
{
  "input": "sample value"
}
```

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- React Hook Form + Zod validation
