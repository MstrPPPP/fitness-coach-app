"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);

      // Auto-resize textarea
      const textarea = e.target;
      textarea.style.height = "auto";
      const maxHeight = 120; // ~4 lines
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    },
    []
  );

  return (
    <div className="flex items-end gap-2 p-4 border-t border-[hsl(var(--border))] bg-white">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-xl border border-[hsl(var(--input))]",
            "bg-white px-4 py-3 text-sm",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))] focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-shadow duration-200"
          )}
          style={{ minHeight: "48px", maxHeight: "120px" }}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className={cn(
          "flex-shrink-0 w-12 h-12 rounded-xl",
          "bg-[hsl(var(--sage-600))] text-white",
          "flex items-center justify-center",
          "hover:bg-[hsl(var(--sage-700))] transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[hsl(var(--sage-600))]",
          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))] focus:ring-offset-2"
        )}
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
