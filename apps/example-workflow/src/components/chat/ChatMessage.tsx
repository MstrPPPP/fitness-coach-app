"use client";

import { memo } from "react";
import type { Message } from "@/types/chat";
import { formatRelativeTime, cn } from "@/lib/utils";
import { User, Dumbbell } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isStreaming = false,
}: ChatMessageProps) {
  const isCoach = message.role === "coach";

  return (
    <div
      className={cn(
        "message-animate flex gap-3",
        isCoach ? "justify-start" : "justify-end"
      )}
    >
      {isCoach && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--sage-200))] flex items-center justify-center">
          <Dumbbell className="w-4 h-4 text-[hsl(var(--sage-700))]" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] md:max-w-[70%]",
          isCoach ? "order-2" : "order-1"
        )}
      >
        {isCoach && (
          <span className="text-xs font-medium text-[hsl(var(--sage-600))] mb-1 block">
            Coach
          </span>
        )}

        <div
          className={cn(
            "px-4 py-3 rounded-2xl",
            isCoach
              ? "bg-[hsl(var(--coach-bg))] text-foreground rounded-tl-md"
              : "bg-[hsl(var(--user-bg))] text-[hsl(var(--user-text))] rounded-tr-md"
          )}
        >
          <div
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap break-words",
              isStreaming && isCoach && "streaming-cursor"
            )}
          >
            {formatMessageContent(message.content)}
          </div>
        </div>

        <span
          className={cn(
            "text-xs text-muted-foreground mt-1 block",
            isCoach ? "text-left" : "text-right"
          )}
        >
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>

      {!isCoach && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--sage-600))] flex items-center justify-center order-2">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
});

function formatMessageContent(content: string): React.ReactNode {
  // Simple markdown-like formatting for bold text
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
