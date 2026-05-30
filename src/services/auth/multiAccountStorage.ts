import AsyncStorage from "@react-native-async-storage/async-storage";

const MULTI_ACCOUNT_KEY = "multi_account_tokens";

export type AccountType = "personal" | "business";

export type StoredAccountTokens = {
  userId: string;
  accountType: AccountType;
  accessToken: string;
  refreshToken: string;
};

const getAccountKey = (
  account: Pick<StoredAccountTokens, "userId" | "accountType">,
) => `${account.userId}:${account.accountType}`;

export const getAllStoredAccounts = async (): Promise<
  StoredAccountTokens[]
> => {
  const raw = await AsyncStorage.getItem(MULTI_ACCOUNT_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAccountTokens>[];

    const normalized = parsed
      .filter(
        (account) =>
          Boolean(account.userId) &&
          Boolean(account.accessToken) &&
          Boolean(account.refreshToken),
      )
      .map((account) => ({
        userId: String(account.userId),
        accountType: account.accountType ?? "personal",
        accessToken: String(account.accessToken),
        refreshToken: String(account.refreshToken),
      }));

    const deduped = normalized.filter(
      (account, index, array) =>
        array.findIndex(
          (item) => getAccountKey(item) === getAccountKey(account),
        ) === index,
    );

    if (deduped.length !== parsed.length) {
      await AsyncStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(deduped));
    }

    return deduped;
  } catch {
    return [];
  }
};

export const saveAccountTokens = async (
  tokens: StoredAccountTokens,
): Promise<void> => {
  const existing = await getAllStoredAccounts();

  const nextKey = getAccountKey(tokens);

  const filtered = existing.filter(
    (account) => getAccountKey(account) !== nextKey,
  );

  await AsyncStorage.setItem(
    MULTI_ACCOUNT_KEY,
    JSON.stringify([...filtered, tokens]),
  );
};

export const removeAccountTokens = async (
  userId: string,
  accountType?: AccountType,
): Promise<void> => {
  const existing = await getAllStoredAccounts();

  const filtered = accountType
    ? existing.filter(
        (account) =>
          !(account.userId === userId && account.accountType === accountType),
      )
    : existing.filter((account) => account.userId !== userId);

  await AsyncStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(filtered));
};

export const clearAllAccountTokens = async (): Promise<void> => {
  await AsyncStorage.removeItem(MULTI_ACCOUNT_KEY);
};
