export interface Message {
  id: string;
  role: "user" | "coach";
  content: string;
  timestamp: Date;
}

export interface GamificationStats {
  totalMessages: number;
  level: number;
  progressToNextLevel: number;
  currentStreak: number;
  lastEngagementDate: string | null;
}

export interface AppState {
  messages: Message[];
  sessionId: string;
  isStreaming: boolean;
  streamingContent: string;
  stats: GamificationStats;
  showCelebration: boolean;
  newLevel: number | null;
  sidebarOpen: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "ADD_USER_MESSAGE"; payload: { content: string; id: string } }
  | { type: "START_STREAMING" }
  | { type: "APPEND_STREAM"; payload: { chunk: string } }
  | { type: "FINISH_STREAMING"; payload: { id: string } }
  | { type: "STREAM_ERROR"; payload: { error: string } }
  | { type: "DISMISS_CELEBRATION" }
  | { type: "DISMISS_ERROR" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "HYDRATE"; payload: PersistedState }
  | { type: "CLEAR_MESSAGES" };

export interface PersistedState {
  messages: Array<{
    id: string;
    role: "user" | "coach";
    content: string;
    timestamp: string;
  }>;
  sessionId: string;
  stats: {
    totalMessages: number;
    level: number;
    currentStreak: number;
    lastEngagementDate: string | null;
  };
}

export interface ChatPayload {
  sessionId: string;
  action: "sendMessage";
  chatInput: string;
}
