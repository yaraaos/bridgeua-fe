import { create } from "zustand";

export type EditBusinessTab = "overview" | "gallery" | "services" | "about";

type DirtyMap = Record<EditBusinessTab, boolean>;

type EditBusinessState = {
  activeTab: EditBusinessTab;
  dirty: DirtyMap;
  setActiveTab: (tab: EditBusinessTab) => void;
  markDirty: (tab: EditBusinessTab) => void;
  resetAll: () => void;
};

const defaultDirty: DirtyMap = {
  overview: false,
  gallery: false,
  services: false,
  about: false,
};

export const useEditBusinessStore = create<EditBusinessState>((set) => ({
  activeTab: "overview",
  dirty: { ...defaultDirty },
  setActiveTab: (tab) => set({ activeTab: tab }),
  markDirty: (tab) =>
    set((s) => ({ dirty: { ...s.dirty, [tab]: true } })),
  resetAll: () => set({ activeTab: "overview", dirty: { ...defaultDirty } }),
}));
