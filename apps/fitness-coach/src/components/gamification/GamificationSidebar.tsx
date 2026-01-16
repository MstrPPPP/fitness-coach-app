"use client";

import { X } from "lucide-react";
import type { GamificationStats } from "@/types/chat";
import { LevelDisplay } from "./LevelDisplay";
import { ProgressBar } from "./ProgressBar";
import { StatsCard } from "./StatsCard";
import { StreakTracker } from "./StreakTracker";
import { MOTIVATIONAL_QUOTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GamificationSidebarProps {
  stats: GamificationStats;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function GamificationSidebar({
  stats,
  isOpen,
  onClose,
  className,
}: GamificationSidebarProps) {
  const [quote, setQuote] = useState("");

  // Pick a random quote on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIndex] ?? "");
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative right-0 top-0 h-full z-50 md:z-auto",
          "w-72 bg-[hsl(var(--warm-50))] border-l border-[hsl(var(--border))]",
          "flex flex-col",
          "transform transition-transform duration-300 ease-out",
          "md:transform-none",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))] md:hidden">
          <h2 className="font-semibold text-[hsl(var(--sage-800))]">
            Your Progress
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--sage-100))] rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-[hsl(var(--sage-600))]" />
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block p-4 border-b border-[hsl(var(--border))]">
          <h2 className="font-semibold text-[hsl(var(--sage-800))]">
            Your Progress
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Level display */}
          <LevelDisplay level={stats.level} />

          {/* Progress to next level */}
          <div className="p-4 rounded-xl bg-white">
            <ProgressBar current={stats.progressToNextLevel} />
          </div>

          {/* Stats */}
          <StatsCard totalMessages={stats.totalMessages} />

          {/* Streak */}
          <StreakTracker
            currentStreak={stats.currentStreak}
            lastEngagementDate={stats.lastEngagementDate}
          />
        </div>

        {/* Motivational quote */}
        {quote && (
          <div className="p-4 border-t border-[hsl(var(--border))]">
            <p className="text-xs text-muted-foreground italic text-center leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
