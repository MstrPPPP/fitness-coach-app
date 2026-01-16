import { v4 as uuidv4 } from "uuid";
import {
  MESSAGES_PER_LEVEL,
  LEVEL_TIERS,
  LEVEL_NAMES,
} from "./constants";

export function generateSessionId(): string {
  return uuidv4();
}

export function generateMessageId(): string {
  return uuidv4();
}

export function calculateLevel(totalMessages: number): number {
  if (totalMessages === 0) return 1;
  return Math.floor((totalMessages - 1) / MESSAGES_PER_LEVEL) + 1;
}

export function calculateProgressToNextLevel(totalMessages: number): number {
  if (totalMessages === 0) return 0;
  return ((totalMessages - 1) % MESSAGES_PER_LEVEL) + 1;
}

export type LevelTier = keyof typeof LEVEL_TIERS;

export function getLevelTier(level: number): LevelTier {
  if (level <= 5) return "bronze";
  if (level <= 10) return "silver";
  if (level <= 15) return "gold";
  if (level <= 20) return "platinum";
  return "diamond";
}

export function getLevelColour(level: number): string {
  const tier = getLevelTier(level);
  return LEVEL_TIERS[tier].colour;
}

export function getLevelName(level: number): string {
  const tier = getLevelTier(level);
  const tierNames = LEVEL_NAMES[tier] ?? [];
  const tierStart = LEVEL_TIERS[tier].min;
  const indexInTier = Math.min(level - tierStart, tierNames.length - 1);
  return tierNames[indexInTier] ?? "Fitness Enthusiast";
}

export function isStreakValid(lastEngagementDate: string | null): boolean {
  if (!lastEngagementDate) return false;

  const last = new Date(lastEngagementDate);
  const now = new Date();

  // Reset time to midnight for comparison
  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Streak is valid if last engagement was today or yesterday
  return diffInDays <= 1;
}

export function isEngagedToday(lastEngagementDate: string | null): boolean {
  if (!lastEngagementDate) return false;

  const last = new Date(lastEngagementDate);
  const now = new Date();

  return (
    last.getDate() === now.getDate() &&
    last.getMonth() === now.getMonth() &&
    last.getFullYear() === now.getFullYear()
  );
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
