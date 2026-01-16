"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { WELCOME_MESSAGE } from "@/lib/constants";
import { ChevronDown, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
}

export function MessageList({
  messages,
  streamingContent,
  isStreaming,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, streamingContent]);

  // Track scroll position to show/hide scroll button
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Show welcome state if no messages
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--sage-100))] flex items-center justify-center mb-4">
          <Dumbbell className="w-8 h-8 text-[hsl(var(--sage-600))]" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Welcome to Your Fitness Coach
        </h2>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed whitespace-pre-line">
          {WELCOME_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto chat-scrollbar p-4 space-y-4"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Streaming message preview */}
        {isStreaming && streamingContent && (
          <ChatMessage
            message={{
              id: "streaming",
              role: "coach",
              content: streamingContent,
              timestamp: new Date(),
            }}
            isStreaming={true}
          />
        )}

        {/* Typing indicator (when streaming but no content yet) */}
        {isStreaming && !streamingContent && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={cn(
            "absolute bottom-4 right-4 w-10 h-10 rounded-full",
            "bg-white shadow-lg border border-[hsl(var(--border))]",
            "flex items-center justify-center",
            "hover:bg-[hsl(var(--sage-50))] transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))]",
            "fade-in"
          )}
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5 text-[hsl(var(--sage-600))]" />
        </button>
      )}
    </div>
  );
}
