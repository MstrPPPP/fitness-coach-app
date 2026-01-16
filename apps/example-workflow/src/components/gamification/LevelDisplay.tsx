"use client";

import { getLevelTier, getLevelName, getLevelColour, cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface LevelDisplayProps {
  level: number;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "p-3",
    badge: "w-10 h-10",
    icon: "w-5 h-5",
    level: "text-lg",
    name: "text-xs",
  },
  md: {
    container: "p-4",
    badge: "w-14 h-14",
    icon: "w-6 h-6",
    level: "text-2xl",
    name: "text-sm",
  },
  lg: {
    container: "p-6",
    badge: "w-20 h-20",
    icon: "w-8 h-8",
    level: "text-4xl",
    name: "text-base",
  },
};

export function LevelDisplay({
  level,
  showName = true,
  size = "md",
  className,
}: LevelDisplayProps) {
  const tier = getLevelTier(level);
  const name = getLevelName(level);
  const colour = getLevelColour(level);
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl bg-white",
        sizes.container,
        className
      )}
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center mb-2",
          sizes.badge
        )}
        style={{
          backgroundColor: `${colour}20`,
          boxShadow: `0 0 20px ${colour}30`,
        }}
      >
        <Trophy className={cn(sizes.icon)} style={{ color: colour }} />
      </div>

      <div className="text-center">
        <span
          className={cn("font-bold block", sizes.level)}
          style={{ color: colour }}
        >
          {level}
        </span>
        {showName && (
          <span
            className={cn(
              "text-muted-foreground capitalize",
              sizes.name
            )}
          >
            {name}
          </span>
        )}
        <span
          className={cn(
            "block text-xs uppercase tracking-wider font-medium mt-1",
            "opacity-70"
          )}
          style={{ color: colour }}
        >
          {tier}
        </span>
      </div>
    </div>
  );
}
