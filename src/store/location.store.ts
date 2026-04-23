import { create } from "zustand";

export type LocationMode = "manual" | "nearby";
export type PermissionStatus = "unknown" | "granted" | "denied";

type LocationState = {
  mode: LocationMode;
  label: string;
  value: string;
  latitude?: number;
  longitude?: number;
  permissionStatus: PermissionStatus;

  setManualLocation: (payload: { label: string; value: string }) => void;
  setNearbyLocation: (payload: {
    label: string;
    value: string;
    latitude: number;
    longitude: number;
  }) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  resetLocation: () => void;
};

const initialState = {
  mode: "manual" as LocationMode,
  label: "California, USA",
  value: "california-usa",
  latitude: undefined,
  longitude: undefined,
  permissionStatus: "unknown" as PermissionStatus,
};

export const useLocationStore = create<LocationState>((set) => ({
  ...initialState,

  setManualLocation: ({ label, value }) =>
    set({
      mode: "manual",
      label,
      value,
      latitude: undefined,
      longitude: undefined,
    }),

  setNearbyLocation: ({ label, value, latitude, longitude }) =>
    set({
      mode: "nearby",
      label,
      value,
      latitude,
      longitude,
    }),

  setPermissionStatus: (status) => set({ permissionStatus: status }),

  resetLocation: () => set(initialState),
}));