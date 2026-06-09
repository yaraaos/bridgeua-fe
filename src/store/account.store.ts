import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/src/services/api/config";
import { STORAGE_KEYS } from "@/src/services/storage/keys";
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

function buildAccountSummary(
  userId: string,
  accessToken: string,
  refreshToken: string,
  d: any,
): AccountSummary {
  return {
    id: userId,
    kind: d.accountType as AccountKind,
    displayName: d.displayName ?? 'Account',
    handle: d.username ?? undefined,
    avatarUrl: d.avatarUrl
      ? d.avatarUrl.startsWith('http')
        ? d.avatarUrl
        : `${API_BASE_URL}${d.avatarUrl}`
      : undefined,
    notificationsCount: d.notificationCount ?? 0,
    ownedBusinessId:
      d.accountType === 'business' ? userId : undefined,
    accessToken,
    refreshToken,
  };
}

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

    const { saveAuthTokens } = await import('@/src/services/auth/tokens');

    const summaries = await Promise.all(
      stored.map(async (entry) => {
        try {
          // Try the access token first
          let accessToken = entry.accessToken;

          const testRes = await fetch(
            `${API_BASE_URL}/api/auth/accounts/me`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          // If expired, try refreshing with this account's refresh token
          if (testRes.status === 401) {
            const refreshRes = await fetch(
              `${API_BASE_URL}/api/auth/refresh`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: entry.refreshToken }),
              },
            );

            if (!refreshRes.ok) return null; // refresh failed, drop account

            const refreshJson = await refreshRes.json();
            accessToken = refreshJson.data.accessToken;
            const newRefreshToken = refreshJson.data.refreshToken;

            // Persist updated tokens for this account
            await saveAccountTokens({
              userId: entry.userId,
              accountType: entry.accountType,
              accessToken,
              refreshToken: newRefreshToken,
            });

            // Re-fetch with new token
            const retryRes = await fetch(
              `${API_BASE_URL}/api/auth/accounts/me`,
              { headers: { Authorization: `Bearer ${accessToken}` } },
            );

            if (!retryRes.ok) return null;

            const retryJson = await retryRes.json();
            const d = retryJson.data ?? retryJson;

            return buildAccountSummary(entry.userId, accessToken, newRefreshToken, d);
          }

          if (!testRes.ok) return null;

          const json = await testRes.json();
          const d = json.data ?? json;

          return buildAccountSummary(entry.userId, accessToken, entry.refreshToken, d);
        } catch {
          return null;
        }
      }),
    );

    const valid = summaries.filter(Boolean) as AccountSummary[];

    const persistedActiveId = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID);

    const activeId =
      (persistedActiveId ? valid.find((a) => a.id === persistedActiveId)?.id : null) ??
      valid[valid.length - 1]?.id ??
      null;

    if (activeId) {
      const active = valid.find((a) => a.id === activeId);
      if (active) {
        await saveAuthTokens(active.accessToken, active.refreshToken);
      }
    }

    set({ accounts: valid, activeAccountId: activeId, isHydrated: true });
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
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID, id);

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
