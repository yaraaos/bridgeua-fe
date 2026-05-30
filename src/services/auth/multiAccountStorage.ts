import AsyncStorage from '@react-native-async-storage/async-storage';

const MULTI_ACCOUNT_KEY = 'multi_account_tokens';

export type StoredAccountTokens = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export const getAllStoredAccounts = async (): Promise<StoredAccountTokens[]> => {
  const raw = await AsyncStorage.getItem(MULTI_ACCOUNT_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveAccountTokens = async (tokens: StoredAccountTokens): Promise<void> => {
  const existing = await getAllStoredAccounts();
  const filtered = existing.filter((a) => a.userId !== tokens.userId);
  await AsyncStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify([...filtered, tokens]));
};

export const removeAccountTokens = async (userId: string): Promise<void> => {
  const existing = await getAllStoredAccounts();
  const filtered = existing.filter((a) => a.userId !== userId);
  await AsyncStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(filtered));
};

export const clearAllAccountTokens = async (): Promise<void> => {
  await AsyncStorage.removeItem(MULTI_ACCOUNT_KEY);
};
