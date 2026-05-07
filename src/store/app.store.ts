import { create } from "zustand";

export type ThemeMode = "system" | "light" | "dark";

interface AppStore {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  themeMode: "system",
  setThemeMode: (mode) => set({ themeMode: mode }),
}));