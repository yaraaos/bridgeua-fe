import { create } from "zustand";

import type {
  BusinessHourEntry,
  DayOfWeek,
  EditBusinessOverviewDraft,
  EditBusinessTab,
} from "@/src/features/businesses/types/editBusiness.types";

export type { EditBusinessTab };

const defaultHours: BusinessHourEntry[] = [
  { day: "monday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "tuesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "wednesday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "thursday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "friday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "saturday", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "sunday", isOpen: false, openTime: "09:00", closeTime: "18:00" },
];

const defaultOverviewDraft: EditBusinessOverviewDraft = {
  name: "",
  category: "",
  address: "",
  city: "",
  state: "",
  phone: "",
  socialLinks: {
    website: "",
    instagram: "",
    facebook: "",
    telegram: "",
    whatsapp: "",
  },
  hours: defaultHours,
};

type DirtyMap = Record<EditBusinessTab, boolean>;

type EditBusinessState = {
  activeTab: EditBusinessTab;
  dirty: DirtyMap;
  overviewDraft: EditBusinessOverviewDraft;
  setActiveTab: (tab: EditBusinessTab) => void;
  markDirty: (tab: EditBusinessTab) => void;
  markSaved: (tab: EditBusinessTab) => void;
  setOverviewDraft: (patch: Partial<EditBusinessOverviewDraft>) => void;
  updateOverviewHour: (day: DayOfWeek, patch: Partial<BusinessHourEntry>) => void;
  resetAll: () => void;
};

const defaultDirty: DirtyMap = {
  overview: false,
  gallery: false,
  services: false,
  about: false,
};

function cloneDefaultOverview(): EditBusinessOverviewDraft {
  return {
    ...defaultOverviewDraft,
    socialLinks: { ...defaultOverviewDraft.socialLinks },
    hours: defaultHours.map((h) => ({ ...h })),
  };
}

export const useEditBusinessStore = create<EditBusinessState>((set) => ({
  activeTab: "overview",
  dirty: { ...defaultDirty },
  overviewDraft: cloneDefaultOverview(),
  setActiveTab: (tab) => set({ activeTab: tab }),
  markDirty: (tab) => set((s) => ({ dirty: { ...s.dirty, [tab]: true } })),
  markSaved: (tab) => set((s) => ({ dirty: { ...s.dirty, [tab]: false } })),
  setOverviewDraft: (patch) =>
    set((s) => ({ overviewDraft: { ...s.overviewDraft, ...patch } })),
  updateOverviewHour: (day, patch) =>
    set((s) => ({
      overviewDraft: {
        ...s.overviewDraft,
        hours: s.overviewDraft.hours.map((h) =>
          h.day === day ? { ...h, ...patch } : h
        ),
      },
    })),
  resetAll: () =>
    set({
      activeTab: "overview",
      dirty: { ...defaultDirty },
      overviewDraft: cloneDefaultOverview(),
    }),
}));
