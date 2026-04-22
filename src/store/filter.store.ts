import { create } from "zustand";

type FilterState = {
  sort: string;
  cuisines: string[];
  rating: string;
  distance: string;
  customDistance: string;
  setSort: (value: string) => void;
  toggleCuisine: (value: string) => void;
  setRating: (value: string) => void;
  setDistance: (value: string) => void;
  setCustomDistance: (value: string) => void;
  reset: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  sort: "Relevance (Default)",
  cuisines: [],
  rating: "",
  distance: "",
  customDistance: "",
  setSort: (value) => set({ sort: value }),
  toggleCuisine: (value) =>
    set((state) => ({
      cuisines: state.cuisines.includes(value)
        ? state.cuisines.filter((item) => item !== value)
        : [...state.cuisines, value],
    })),
  setRating: (value) => set({ rating: value }),
  setDistance: (value) => set({ distance: value }),
  setCustomDistance: (value) => set({ customDistance: value }),
  reset: () =>
    set({
      sort: "Relevance (Default)",
      cuisines: [],
      rating: "",
      distance: "",
      customDistance: "",
    }),
}));
