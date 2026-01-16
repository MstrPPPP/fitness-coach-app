"use client";

import { useApp } from "@/context/AppContext";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const { state, dispatch, sendMessage } = useApp();

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Error banner */}
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-200 text-red-800 text-sm fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{state.error}</span>
          <button
            onClick={() => dispatch({ type: "DISMISS_ERROR" })}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Message list */}
      <MessageList
        messages={state.messages}
        streamingContent={state.streamingContent}
        isStreaming={state.isStreaming}
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={state.isStreaming}
        placeholder="Ask your fitness coach anything..."
      />
    </div>
  );
}
