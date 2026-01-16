"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface StatsCardProps {
  totalMessages: number;
  className?: string;
}

export function StatsCard({ totalMessages, className }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(totalMessages);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(totalMessages);

  useEffect(() => {
    if (totalMessages !== prevValue.current) {
      setIsAnimating(true);
      setDisplayValue(totalMessages);
      prevValue.current = totalMessages;

      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalMessages]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl bg-white",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[hsl(var(--sage-100))] flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-[hsl(var(--sage-600))]" />
      </div>

      <div className="flex-1">
        <span
          className={cn(
            "text-2xl font-bold text-[hsl(var(--sage-700))] block",
            isAnimating && "number-pop"
          )}
        >
          {displayValue}
        </span>
        <span className="text-xs text-muted-foreground">
          total message{totalMessages !== 1 ? "s" : ""} sent
        </span>
      </div>
    </div>
  );
}
