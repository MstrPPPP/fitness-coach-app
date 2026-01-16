"use client";

import { Dumbbell } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="message-animate flex gap-3 justify-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--sage-200))] flex items-center justify-center">
        <Dumbbell className="w-4 h-4 text-[hsl(var(--sage-700))]" />
      </div>

      <div>
        <span className="text-xs font-medium text-[hsl(var(--sage-600))] mb-1 block">
          Coach
        </span>

        <div className="bg-[hsl(var(--coach-bg))] px-4 py-3 rounded-2xl rounded-tl-md inline-flex items-center gap-1">
          <span className="typing-dot w-2 h-2 rounded-full bg-[hsl(var(--sage-400))]" />
          <span className="typing-dot w-2 h-2 rounded-full bg-[hsl(var(--sage-400))]" />
          <span className="typing-dot w-2 h-2 rounded-full bg-[hsl(var(--sage-400))]" />
        </div>

        <span className="text-xs text-muted-foreground mt-1 block">
          Coach is typing...
        </span>
      </div>
    </div>
  );
}
