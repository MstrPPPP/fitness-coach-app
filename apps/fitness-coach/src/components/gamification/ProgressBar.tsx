"use client";

import { cn } from "@/lib/utils";
import { MESSAGES_PER_LEVEL } from "@/lib/constants";

interface ProgressBarProps {
  current: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  max = MESSAGES_PER_LEVEL,
  showLabel = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const remaining = max - current;

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-[hsl(var(--sage-700))]">
            {remaining > 0
              ? `${remaining} message${remaining !== 1 ? "s" : ""} to next level`
              : "Level up!"}
          </span>
        </div>
      )}

      <div className="h-3 bg-[hsl(var(--warm-200))] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[hsl(var(--sage-400))] to-[hsl(var(--sage-600))] rounded-full transition-all duration-500 ease-out progress-animate"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabel && (
        <div className="flex justify-center">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full mx-0.5 transition-colors duration-300",
                i < current
                  ? "bg-[hsl(var(--sage-500))]"
                  : "bg-[hsl(var(--warm-200))]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
