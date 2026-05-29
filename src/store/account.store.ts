import { create } from "zustand";

export type AccountKind = "personal" | "business";

export type AccountSummary = {
  id: string;
  kind: AccountKind;
  displayName: string;
  handle: string;
  avatarUrl?: string;
  notificationsCount: number;
  ownedBusinessId?: string;
};

const personalMockAccount: AccountSummary = {
  id: "personal-1",
  kind: "personal",
  displayName: "Kateryna Zelenska",
  handle: "kate1111",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  notificationsCount: 2,
};

const businessMockAccount: AccountSummary = {
  id: "business-1",
  kind: "business",
  displayName: "Zelenska Beauty",
  handle: "zlnska.beauty",
  avatarUrl: "https://picsum.photos/200/200?31",
  notificationsCount: 3,
  // Until BU-198 ships, FE points the mock business account at a real
  // backend business id so owned-business priority is testable locally.
  ownedBusinessId: "21",
};

type AccountState = {
  accounts: AccountSummary[];
  activeAccountId: string;
  setActiveAccountId: (id: string) => void;
  setActiveAccountKind: (kind: AccountKind) => void;
};

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [personalMockAccount, businessMockAccount],
  activeAccountId: personalMockAccount.id,

  setActiveAccountId: (id) => set({ activeAccountId: id }),

  setActiveAccountKind: (kind) =>
    set((state) => {
      const targetAccount = state.accounts.find(
        (account) => account.kind === kind,
      );

      if (!targetAccount) return state;

      return { activeAccountId: targetAccount.id };
    }),
}));

export function useActiveAccount(): AccountSummary {
  const accounts = useAccountStore((s) => s.accounts);
  const activeId = useAccountStore((s) => s.activeAccountId);

  return accounts.find((account) => account.id === activeId) ?? accounts[0];
}
