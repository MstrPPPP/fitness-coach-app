import { N8nResponse, N8nResponseSchema } from "./types";

export async function callN8nWebhook<T = unknown>(
  webhookUrl: string,
  data: Record<string, unknown>,
  options?: {
    method?: "GET" | "POST";
    headers?: Record<string, string>;
    timeout?: number;
  }
): Promise<N8nResponse & { data?: T }> {
  const { method = "POST", headers = {}, timeout = 30000 } = options || {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(webhookUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method === "POST" ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const json = await response.json();
    const parsed = N8nResponseSchema.safeParse(json);

    if (parsed.success) {
      return parsed.data;
    }

    // If response doesn't match schema, wrap it
    return {
      success: true,
      data: json as T,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout - n8n workflow took too long to respond",
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Unknown error occurred",
    };
  }
}

export function getWebhookUrl(workflowId: string, environment?: string): string {
  const baseUrl =
    environment === "production"
      ? process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD
      : process.env.NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV;

  if (!baseUrl) {
    throw new Error(
      `N8N webhook base URL not configured for environment: ${environment || "development"}`
    );
  }

  return `${baseUrl}/${workflowId}`;
}
