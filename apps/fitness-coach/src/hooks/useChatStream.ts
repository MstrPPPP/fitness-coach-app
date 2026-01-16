"use client";

import { useCallback, useRef } from "react";

interface UseChatStreamOptions {
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

interface SendMessageParams {
  sessionId: string;
  message: string;
}

export function useChatStream({
  onChunk,
  onComplete,
  onError,
}: UseChatStreamOptions) {
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async ({ sessionId, message }: SendMessageParams) => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId, message }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Request failed with status ${response.status}`
          );
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Process any remaining buffer
            if (buffer.trim()) {
              processSSEData(buffer, onChunk);
            }
            onComplete();
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            processSSEData(line, onChunk);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            return; // Request was cancelled, not an error
          }
          onError(error.message);
        } else {
          onError("An unexpected error occurred");
        }
      }
    },
    [onChunk, onComplete, onError]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { sendMessage, cancel };
}

function processSSEData(line: string, onChunk: (chunk: string) => void) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith(":")) {
    return; // Skip empty lines and comments
  }

  if (trimmed.startsWith("data: ")) {
    const data = trimmed.slice(6);

    if (data === "[DONE]") {
      return; // End of stream marker
    }

    try {
      const parsed = JSON.parse(data);

      // Handle different response formats from n8n
      if (parsed.chunk) {
        onChunk(parsed.chunk);
      } else if (parsed.text) {
        onChunk(parsed.text);
      } else if (parsed.output) {
        onChunk(parsed.output);
      } else if (typeof parsed === "string") {
        onChunk(parsed);
      }
    } catch {
      // If not JSON, treat as plain text chunk
      onChunk(data);
    }
  } else if (!trimmed.includes(":")) {
    // Plain text without SSE formatting
    onChunk(trimmed);
  }
}
