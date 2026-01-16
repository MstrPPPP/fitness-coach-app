"use client";

import { AppProvider, useApp } from "@/context/AppContext";
import { ChatInterface } from "@/components/chat";
import {
  GamificationSidebar,
  LevelUpCelebration,
} from "@/components/gamification";
import { Menu, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

function AppContent() {
  const { state, dispatch, isHydrated } = useApp();

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[hsl(var(--warm-50))]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--sage-100))] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Dumbbell className="w-8 h-8 text-[hsl(var(--sage-600))]" />
          </div>
          <p className="text-muted-foreground">Loading your fitness coach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[hsl(var(--warm-50))]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--sage-100))] flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-[hsl(var(--sage-600))]" />
          </div>
          <div>
            <h1 className="font-semibold text-[hsl(var(--sage-800))]">
              Fitness Coach
            </h1>
            <p className="text-xs text-muted-foreground">
              Your personal fitness guide
            </p>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          className={cn(
            "md:hidden p-2 rounded-lg",
            "hover:bg-[hsl(var(--sage-100))] transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sage-400))]"
          )}
          aria-label="Open progress sidebar"
        >
          <Menu className="w-6 h-6 text-[hsl(var(--sage-600))]" />
        </button>

        {/* Desktop stats summary */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Level{" "}
            <span className="font-semibold text-[hsl(var(--sage-700))]">
              {state.stats.level}
            </span>
          </span>
          <span className="text-muted-foreground">
            Streak{" "}
            <span className="font-semibold text-[hsl(var(--streak-flame))]">
              {state.stats.currentStreak}
            </span>
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Chat interface */}
        <ChatInterface className="flex-1" />

        {/* Gamification sidebar */}
        <GamificationSidebar
          stats={state.stats}
          isOpen={state.sidebarOpen}
          onClose={() => dispatch({ type: "CLOSE_SIDEBAR" })}
          className="hidden md:flex"
        />

        {/* Mobile sidebar (rendered in portal via GamificationSidebar) */}
        <GamificationSidebar
          stats={state.stats}
          isOpen={state.sidebarOpen}
          onClose={() => dispatch({ type: "CLOSE_SIDEBAR" })}
          className="md:hidden"
        />
      </main>

      {/* Level up celebration */}
      {state.showCelebration && state.newLevel && (
        <LevelUpCelebration
          newLevel={state.newLevel}
          isVisible={state.showCelebration}
          onDismiss={() => dispatch({ type: "DISMISS_CELEBRATION" })}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
