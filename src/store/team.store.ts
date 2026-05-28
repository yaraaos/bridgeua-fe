import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { TeamMember } from "@/src/types/team";

type TeamState = {
  members: TeamMember[];
  addMember: (member: TeamMember) => void;
  removeMember: (id: string | number) => void;
  updateMember: (id: string | number, updates: Partial<TeamMember>) => void;
  setMembers: (members: TeamMember[]) => void;
};

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      members: [],

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => String(m.id) !== String(id)),
        })),

      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            String(m.id) === String(id) ? { ...m, ...updates } : m,
          ),
        })),

      setMembers: (members) => set({ members }),
    }),
    {
      name: "team-storage",
      storage: createJSONStorage(() => ({
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        removeItem: SecureStore.deleteItemAsync,
      })),
    },
  ),
);
