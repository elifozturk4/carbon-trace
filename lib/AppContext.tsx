"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { ActivityRecord, ActivityType, UserStats, WalletStatus } from "@/types";

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  BIKE_TO_WORK: 50,
  RECYCLE: 30,
  PLANT_TREE: 100,
  PUBLIC_TRANSPORT: 25,
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  BIKE_TO_WORK: "İşe Bisikletle Git",
  RECYCLE: "Geri Dönüşüm",
  PLANT_TREE: "Ağaç Dik",
  PUBLIC_TRANSPORT: "Toplu Taşıma",
};

interface AppState {
  walletStatus: WalletStatus;
  walletAddress: string | null;
  activities: ActivityRecord[];
  isLoading: boolean;
}

type AppAction =
  | { type: "SET_WALLET_STATUS"; payload: WalletStatus }
  | { type: "SET_WALLET_ADDRESS"; payload: string | null }
  | { type: "ADD_ACTIVITY"; payload: ActivityRecord }
  | { type: "LOAD_ACTIVITIES"; payload: ActivityRecord[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "DISCONNECT_WALLET" };

const initialState: AppState = {
  walletStatus: "DISCONNECTED",
  walletAddress: null,
  activities: [],
  isLoading: false,
};

const STORAGE_KEY = "carbon-trace-activities";

// localStorage'dan aktiviteleri oku
function loadActivitiesFromStorage(): ActivityRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActivityRecord[]) : [];
  } catch {
    return [];
  }
}

// localStorage'a aktiviteleri yaz
function saveActivitiesToStorage(activities: ActivityRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // storage dolu olabilir, sessizce geç
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_WALLET_STATUS":  return { ...state, walletStatus: action.payload };
    case "SET_WALLET_ADDRESS": return { ...state, walletAddress: action.payload };
    case "ADD_ACTIVITY": {
      const updated = [action.payload, ...state.activities];
      saveActivitiesToStorage(updated);
      return { ...state, activities: updated };
    }
    case "LOAD_ACTIVITIES": return { ...state, activities: action.payload };
    case "SET_LOADING":        return { ...state, isLoading: action.payload };
    case "DISCONNECT_WALLET": {
      // Cüzdan bağlantısı kesilince aktiviteleri de temizle
      saveActivitiesToStorage([]);
      return { ...initialState };
    }
    default: return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  userStats: UserStats;
  logActivity: (type: ActivityType) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sayfa açılınca localStorage'daki aktiviteleri yükle
  useEffect(() => {
    const saved = loadActivitiesFromStorage();
    if (saved.length > 0) {
      dispatch({ type: "LOAD_ACTIVITIES", payload: saved });
    }
  }, []);

  const userStats: UserStats = {
    walletAddress: state.walletAddress,
    totalGreenPoints: state.activities.reduce((sum, a) => sum + a.greenPoints, 0),
    activitiesCount: state.activities.length,
    breakdown: {
      BIKE_TO_WORK:     state.activities.filter((a) => a.type === "BIKE_TO_WORK").length,
      RECYCLE:          state.activities.filter((a) => a.type === "RECYCLE").length,
      PLANT_TREE:       state.activities.filter((a) => a.type === "PLANT_TREE").length,
      PUBLIC_TRANSPORT: state.activities.filter((a) => a.type === "PUBLIC_TRANSPORT").length,
    },
  };

  const logActivity = (type: ActivityType) => {
    if (state.walletStatus !== "CONNECTED") return;
    dispatch({
      type: "ADD_ACTIVITY",
      payload: {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        timestamp: Date.now(),
        greenPoints: ACTIVITY_POINTS[type],
      },
    });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, userStats, logActivity }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp AppProvider içinde kullanılmalıdır");
  return context;
}
