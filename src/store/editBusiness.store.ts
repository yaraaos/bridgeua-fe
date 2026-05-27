import { create } from "zustand";

import type {
  BusinessHourEntry,
  ConfiguredService,
  DayOfWeek,
  EditBusinessAboutDraft,
  EditBusinessGalleryDraft,
  EditBusinessOverviewDraft,
  EditBusinessServicesDraft,
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
  avatarUrl: undefined,
  address: "",
  postalCode: "",
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
  galleryDraft: EditBusinessGalleryDraft;
  servicesDraft: EditBusinessServicesDraft;
  aboutDraft: EditBusinessAboutDraft;
  setActiveTab: (tab: EditBusinessTab) => void;
  markDirty: (tab: EditBusinessTab) => void;
  markSaved: (tab: EditBusinessTab) => void;
  setOverviewDraft: (patch: Partial<EditBusinessOverviewDraft>) => void;
  updateOverviewHour: (
    day: DayOfWeek,
    patch: Partial<BusinessHourEntry>,
  ) => void;
  setGalleryDraft: (patch: Partial<EditBusinessGalleryDraft>) => void;
  setServicesDraft: (draft: EditBusinessServicesDraft) => void;
  addConfiguredServices: (items: ConfiguredService[]) => void;
  updateConfiguredService: (
    id: string,
    patch: Partial<ConfiguredService>,
  ) => void;
  removeConfiguredService: (id: string) => void;
  setAboutDraft: (patch: Partial<EditBusinessAboutDraft>) => void;
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
  galleryDraft: { photos: [], defaultPhotoIds: [], deletedPhotoIds: [] },
  servicesDraft: { services: [] },
  aboutDraft: { description: "", languages: [], amenities: [] },
  setActiveTab: (tab) => set({ activeTab: tab }),
  markDirty: (tab) => set((s) => ({ dirty: { ...s.dirty, [tab]: true } })),
  markSaved: (tab) => set((s) => ({ dirty: { ...s.dirty, [tab]: false } })),
  setOverviewDraft: (patch) =>
    set((s) => ({ overviewDraft: { ...s.overviewDraft, ...patch } })),
  setGalleryDraft: (patch) =>
    set((s) => ({ galleryDraft: { ...s.galleryDraft, ...patch } })),
  updateOverviewHour: (day, patch) =>
    set((s) => ({
      overviewDraft: {
        ...s.overviewDraft,
        hours: s.overviewDraft.hours.map((h) =>
          h.day === day ? { ...h, ...patch } : h,
        ),
      },
    })),
  setServicesDraft: (draft) => set({ servicesDraft: draft }),
  addConfiguredServices: (items) =>
    set((s) => ({
      servicesDraft: {
        services: [...s.servicesDraft.services, ...items],
      },
    })),
  updateConfiguredService: (id, patch) =>
    set((s) => ({
      servicesDraft: {
        services: s.servicesDraft.services.map((svc) =>
          svc.id === id ? { ...svc, ...patch } : svc,
        ),
      },
    })),
  removeConfiguredService: (id) =>
    set((s) => ({
      servicesDraft: {
        services: s.servicesDraft.services.filter((svc) => svc.id !== id),
      },
    })),
  setAboutDraft: (patch) =>
    set((s) => ({ aboutDraft: { ...s.aboutDraft, ...patch } })),
  resetAll: () =>
    set({
      activeTab: "overview",
      dirty: { ...defaultDirty },
      overviewDraft: cloneDefaultOverview(),
      galleryDraft: { photos: [], defaultPhotoIds: [], deletedPhotoIds: [] },
      servicesDraft: { services: [] },
      aboutDraft: { description: "", languages: [], amenities: [] },
    }),
}));
