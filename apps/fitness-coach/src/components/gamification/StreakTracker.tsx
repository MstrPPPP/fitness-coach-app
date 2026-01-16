"use client";

import { Flame } from "lucide-react";
import { cn, isEngagedToday } from "@/lib/utils";

interface StreakTrackerProps {
  currentStreak: number;
  lastEngagementDate: string | null;
  className?: string;
}

export function StreakTracker({
  currentStreak,
  lastEngagementDate,
  className,
}: StreakTrackerProps) {
  const engagedToday = isEngagedToday(lastEngagementDate);
  const atRisk = !engagedToday && currentStreak > 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl bg-white",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          currentStreak > 0
            ? "bg-[hsl(var(--streak-flame))]"
            : "bg-[hsl(var(--warm-200))]",
          currentStreak > 0 && engagedToday && "streak-pulse"
        )}
      >
        <Flame
          className={cn(
            "w-6 h-6",
            currentStreak > 0 ? "text-white" : "text-[hsl(var(--warm-400))]"
          )}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-2xl font-bold",
              currentStreak > 0
                ? "text-[hsl(var(--streak-flame))]"
                : "text-[hsl(var(--warm-400))]"
            )}
          >
            {currentStreak}
          </span>
          <span className="text-sm text-muted-foreground">
            day{currentStreak !== 1 ? "s" : ""}
          </span>
        </div>

        <span
          className={cn(
            "text-xs",
            atRisk ? "text-amber-600 font-medium" : "text-muted-foreground"
          )}
        >
          {currentStreak === 0
            ? "Start your streak!"
            : atRisk
              ? "Chat today to keep your streak!"
              : "Keep it up!"}
        </span>
      </div>
    </div>
  );
}
