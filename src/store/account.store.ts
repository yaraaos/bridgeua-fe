import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import {
  getAllStoredAccounts,
  removeAccountTokens,
  saveAccountTokens,
  type StoredAccountTokens,
} from "@/src/services/auth/multiAccountStorage";
import { saveAuthTokens } from "@/src/services/auth/tokens";
import { create } from "zustand";

export type AccountKind = "personal" | "business";

export type AccountSummary = {
  id: string;
  kind: AccountKind;
  displayName: string;
  handle?: string;
  avatarUrl?: string;
  notificationsCount: number;
  ownedBusinessId?: string;
  accessToken: string;
  refreshToken: string;
};

type AccountState = {
  accounts: AccountSummary[];
  activeAccountId: string | null;
  isHydrated: boolean;

  hydrateAccounts: () => Promise<void>;
  addAccount: (tokens: StoredAccountTokens) => Promise<void>;
  removeAccount: (userId: string) => Promise<void>;
  setActiveAccountId: (id: string) => Promise<void>;
  setActiveAccountKind: (kind: AccountKind) => Promise<void>;
};

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  activeAccountId: null,
  isHydrated: false,

  hydrateAccounts: async () => {
    const stored = await getAllStoredAccounts();

    if (stored.length === 0) {
      set({ accounts: [], activeAccountId: null, isHydrated: true });
      return;
    }

    const summaries = await Promise.all(
      stored.map(async (entry) => {
        try {
          const res = await apiClient.get<any>("/api/auth/accounts/me", {
            headers: {
              Authorization: `Bearer ${entry.accessToken}`,
            },
          });

          const d = res.data;

          return {
            id: entry.userId,
            kind: d.accountType as AccountKind,
            displayName: d.displayName ?? "Account",
            handle: d.username ?? undefined,
            avatarUrl: d.avatarUrl
              ? d.avatarUrl.startsWith("http")
                ? d.avatarUrl
                : `${API_BASE_URL}${d.avatarUrl}`
              : undefined,
            notificationsCount: d.notificationCount ?? 0,
            ownedBusinessId:
              d.accountType === "business" ? entry.userId : undefined,
            accessToken: entry.accessToken,
            refreshToken: entry.refreshToken,
          } satisfies AccountSummary;
        } catch {
          return null;
        }
      }),
    );

    const valid = summaries.filter(Boolean) as AccountSummary[];

    const { user } = await import("@/src/store/auth.store").then((m) => ({
      user: m.useAuthStore.getState().user,
    }));

    const activeId =
      (user?.id ? valid.find((a) => a.id === String(user.id))?.id : null) ??
      valid[valid.length - 1]?.id ??
      null;

    if (activeId) {
      const active = valid.find((a) => a.id === activeId);

      if (active) {
        await saveAuthTokens(active.accessToken, active.refreshToken);
      }
    }

    set({
      accounts: valid,
      activeAccountId: activeId,
      isHydrated: true,
    });
  },

  addAccount: async (tokens) => {
    await saveAccountTokens(tokens);
    await get().hydrateAccounts();

    const account = get().accounts.find((a) => a.id === tokens.userId);

    if (account) {
      await get().setActiveAccountId(account.id);
    }
  },

  removeAccount: async (userId) => {
    await removeAccountTokens(userId);

    const remaining = get().accounts.filter((a) => a.id !== userId);
    const nextActive = remaining[remaining.length - 1]?.id ?? null;

    if (nextActive) {
      const next = remaining.find((a) => a.id === nextActive);

      if (next) {
        await saveAuthTokens(next.accessToken, next.refreshToken);
      }
    }

    set({
      accounts: remaining,
      activeAccountId: nextActive,
    });
  },

  setActiveAccountId: async (id) => {
    const account = get().accounts.find((a) => a.id === id);

    if (!account) {
      return;
    }

    await saveAuthTokens(account.accessToken, account.refreshToken);

    set({
      activeAccountId: id,
    });
  },

  setActiveAccountKind: async (kind) => {
    const target = get().accounts.find((a) => a.kind === kind);

    if (target) {
      await get().setActiveAccountId(target.id);
    }
  },
}));

export function useActiveAccount(): AccountSummary | null {
  const accounts = useAccountStore((s) => s.accounts);
  const activeId = useAccountStore((s) => s.activeAccountId);

  return accounts.find((a) => a.id === activeId) ?? null;
}
