import { z } from "zod";

// Standard n8n webhook response schema
export const N8nResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type N8nResponse = z.infer<typeof N8nResponseSchema>;

// Workflow metadata
export interface WorkflowMetadata {
  id: string;
  name: string;
  webhookUrl: string;
  description?: string;
  inputSchema?: z.ZodSchema;
  outputSchema?: z.ZodSchema;
}
