export const MESSAGES_PER_LEVEL = 5;
export const MAX_STORED_MESSAGES = 50;
export const STORAGE_KEY = "fitness-coach-app";

export const LEVEL_TIERS = {
  bronze: { min: 1, max: 5, colour: "hsl(30, 60%, 50%)" },
  silver: { min: 6, max: 10, colour: "hsl(0, 0%, 65%)" },
  gold: { min: 11, max: 15, colour: "hsl(45, 80%, 50%)" },
  platinum: { min: 16, max: 20, colour: "hsl(200, 20%, 70%)" },
  diamond: { min: 21, max: Infinity, colour: "hsl(200, 100%, 70%)" },
} as const;

export const LEVEL_NAMES: Record<string, string[]> = {
  bronze: ["Fitness Rookie", "Beginner", "Starter", "Learner", "Novice"],
  silver: ["Gym Regular", "Consistent", "Dedicated", "Focused", "Committed"],
  gold: ["Iron Warrior", "Strong", "Powerful", "Mighty", "Champion"],
  platinum: ["Elite Athlete", "Pro", "Expert", "Master", "Legend"],
  diamond: ["Fitness Titan", "Ultimate", "Supreme", "Immortal", "Divine"],
};

export const MOTIVATIONAL_QUOTES = [
  "Every rep counts. Every message brings you closer to your goals.",
  "Consistency beats intensity. Keep showing up.",
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you need to convince.",
  "Progress, not perfection.",
  "Small steps lead to big changes.",
  "You're stronger than you think.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for it. Work for it.",
  "Success starts with self-discipline.",
];

export const WELCOME_MESSAGE = `Hello! I'm your personal fitness coach. I'm here to help you with:

• **Workout planning** - weightlifting, cardio, yoga, and more
• **Nutrition guidance** - balanced eating and protein intake
• **Recovery tips** - sleep, stretching, and injury prevention
• **Motivation** - staying consistent with your fitness journey

What would you like to work on today?`;
