import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { TeamMember } from "@/src/types/team";

type TeamState = {
  members: TeamMember[];
  addMember: (member: TeamMember) => void;
  removeMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
};

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      members: [
        {
          id: "mock-member-1",
          firstName: "Anna",
          lastName: "Kovalenko",
          photoUrl: "https://i.pravatar.cc/100?img=8",
        },
        {
          id: "mock-member-2",
          firstName: "Dmytro",
          lastName: "Marchuk",
          photoUrl: "https://i.pravatar.cc/100?img=15",
        },
      ],

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),

      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updates } : m,
          ),
        })),
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
