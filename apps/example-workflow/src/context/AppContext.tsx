"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  AppAction,
  Message,
  PersistedState,
} from "@/types/chat";
import {
  generateSessionId,
  generateMessageId,
  calculateLevel,
  calculateProgressToNextLevel,
  isStreakValid,
  isEngagedToday,
} from "@/lib/utils";
import { STORAGE_KEY, MAX_STORED_MESSAGES } from "@/lib/constants";
import { useChatStream } from "@/hooks/useChatStream";

const initialState: AppState = {
  messages: [],
  sessionId: "",
  isStreaming: false,
  streamingContent: "",
  stats: {
    totalMessages: 0,
    level: 1,
    progressToNextLevel: 0,
    currentStreak: 0,
    lastEngagementDate: null,
  },
  showCelebration: false,
  newLevel: null,
  sidebarOpen: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_USER_MESSAGE": {
      const newMessage: Message = {
        id: action.payload.id,
        role: "user",
        content: action.payload.content,
        timestamp: new Date(),
      };

      const newTotalMessages = state.stats.totalMessages + 1;
      const newLevel = calculateLevel(newTotalMessages);
      const leveledUp = newLevel > state.stats.level;

      // Update streak
      const today = new Date().toISOString().split("T")[0] ?? null;
      let newStreak = state.stats.currentStreak;

      if (!isEngagedToday(state.stats.lastEngagementDate)) {
        if (isStreakValid(state.stats.lastEngagementDate)) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      return {
        ...state,
        messages: [...state.messages, newMessage],
        stats: {
          totalMessages: newTotalMessages,
          level: newLevel,
          progressToNextLevel: calculateProgressToNextLevel(newTotalMessages),
          currentStreak: newStreak,
          lastEngagementDate: today,
        },
        showCelebration: leveledUp,
        newLevel: leveledUp ? newLevel : null,
        error: null,
      };
    }

    case "START_STREAMING":
      return {
        ...state,
        isStreaming: true,
        streamingContent: "",
        error: null,
      };

    case "APPEND_STREAM":
      return {
        ...state,
        streamingContent: state.streamingContent + action.payload.chunk,
      };

    case "FINISH_STREAMING": {
      const coachMessage: Message = {
        id: action.payload.id,
        role: "coach",
        content: state.streamingContent,
        timestamp: new Date(),
      };

      return {
        ...state,
        isStreaming: false,
        streamingContent: "",
        messages: [...state.messages, coachMessage],
      };
    }

    case "STREAM_ERROR":
      return {
        ...state,
        isStreaming: false,
        streamingContent: "",
        error: action.payload.error,
      };

    case "DISMISS_CELEBRATION":
      return {
        ...state,
        showCelebration: false,
        newLevel: null,
      };

    case "DISMISS_ERROR":
      return {
        ...state,
        error: null,
      };

    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case "CLOSE_SIDEBAR":
      return {
        ...state,
        sidebarOpen: false,
      };

    case "HYDRATE": {
      const { messages, sessionId, stats } = action.payload;

      // Validate streak on hydration
      let currentStreak = stats.currentStreak;
      if (!isStreakValid(stats.lastEngagementDate)) {
        currentStreak = 0;
      }

      return {
        ...state,
        messages: messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
        sessionId,
        stats: {
          ...stats,
          currentStreak,
          level: calculateLevel(stats.totalMessages),
          progressToNextLevel: calculateProgressToNextLevel(stats.totalMessages),
        },
      };
    }

    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [],
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  sendMessage: (content: string) => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    let needsSessionId = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: PersistedState = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: parsed });
        if (parsed.sessionId) {
          needsSessionId = false;
        }
      }
    } catch (error) {
      console.warn("Failed to hydrate from localStorage:", error);
    }

    // Generate session ID if not present in stored data
    if (needsSessionId) {
      const newSessionId = generateSessionId();
      dispatch({
        type: "HYDRATE",
        payload: {
          messages: [],
          sessionId: newSessionId,
          stats: {
            totalMessages: 0,
            level: 1,
            currentStreak: 0,
            lastEngagementDate: null,
          },
        },
      });
    }

    setIsHydrated(true);
  }, []);

  // Persist to localStorage on state changes
  useEffect(() => {
    if (!isHydrated) return;

    const toPersist: PersistedState = {
      messages: state.messages.slice(-MAX_STORED_MESSAGES).map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
      sessionId: state.sessionId,
      stats: {
        totalMessages: state.stats.totalMessages,
        level: state.stats.level,
        currentStreak: state.stats.currentStreak,
        lastEngagementDate: state.stats.lastEngagementDate,
      },
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch (error) {
      console.warn("Failed to persist to localStorage:", error);
    }
  }, [state.messages, state.stats, state.sessionId, isHydrated]);

  const { sendMessage: sendStreamMessage } = useChatStream({
    onChunk: (chunk) => {
      dispatch({ type: "APPEND_STREAM", payload: { chunk } });
    },
    onComplete: () => {
      dispatch({ type: "FINISH_STREAMING", payload: { id: generateMessageId() } });
    },
    onError: (error) => {
      dispatch({ type: "STREAM_ERROR", payload: { error } });
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || state.isStreaming) return;

      const messageId = generateMessageId();
      dispatch({ type: "ADD_USER_MESSAGE", payload: { content, id: messageId } });
      dispatch({ type: "START_STREAMING" });

      sendStreamMessage({
        sessionId: state.sessionId,
        message: content,
      });
    },
    [state.isStreaming, state.sessionId, sendStreamMessage]
  );

  return (
    <AppContext.Provider value={{ state, dispatch, sendMessage, isHydrated }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

