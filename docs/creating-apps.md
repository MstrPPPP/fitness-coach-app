# Creating New Workflow Apps

## Quick Start

1. **Run the generator script**
   ```bash
   ./scripts/create-workflow-app.sh my-workflow
   ```

2. **Navigate to the new app**
   ```bash
   cd apps/my-workflow
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your n8n webhook configuration:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV=https://your-n8n.com/webhook
   NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD=https://your-n8n-prod.com/webhook
   WORKFLOW_ID=your-workflow-id
   ```

4. **Install dependencies** (from project root)
   ```bash
   cd ../..
   pnpm install
   ```

5. **Start development server**
   ```bash
   pnpm --filter my-workflow dev
   ```

6. Visit [http://localhost:3000](http://localhost:3000)

## Customizing Your App

### 1. Update Input Schema

Edit `src/components/workflow-form.tsx`:
```typescript
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message too short"),
});
```

### 2. Customize Form UI

Modify the form JSX in `workflow-form.tsx` to add your fields.

### 3. Update Result Display

Edit `src/components/result-display.tsx` to format your workflow's output.

### 4. Add Validation

In `src/app/api/workflow/route.ts`, add input validation:
```typescript
import { yourInputSchema } from "@/lib/schemas";

const validated = yourInputSchema.parse(body);
```

### 5. Update Metadata

Edit `src/app/layout.tsx` to update title and description.

Update `README.md` with workflow-specific documentation.

## App Structure

Each workflow app follows this structure:
```
apps/my-workflow/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   ├── globals.css      # Global styles
│   │   └── api/
│   │       └── workflow/
│   │           └── route.ts # API proxy to n8n
│   ├── components/
│   │   ├── workflow-form.tsx    # Input form
│   │   └── result-display.tsx   # Result display
│   └── lib/
│       └── workflow.ts          # Utilities
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.example
└── README.md
```

## Best Practices

1. **Keep forms simple** - Focus on essential inputs only
2. **Use Zod schemas** - Validate all inputs
3. **Handle errors gracefully** - Show user-friendly error messages
4. **Test locally first** - Verify with development n8n instance
5. **Document inputs/outputs** - Update README.md
6. **Use shared components** - Import from `@repo/ui`
7. **Follow TypeScript** - Enable strict mode
8. **Mobile responsive** - Test on different screen sizes

## Testing Your App

1. **Test form validation**
   - Try invalid inputs
   - Check error messages

2. **Test n8n integration**
   - Submit valid data
   - Verify workflow executes
   - Check response handling

3. **Test error scenarios**
   - Invalid webhook URL
   - Timeout (30s+)
   - Network errors

4. **Test UI/UX**
   - Loading states
   - Success states
   - Error states
   - Mobile view

## Next Steps

After local testing:
1. Push to GitHub
2. Deploy to Vercel (see [Deployment Guide](./deployment.md))
3. Configure production environment variables
4. Test production deployment
