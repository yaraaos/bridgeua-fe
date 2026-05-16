import { STORAGE_KEYS } from "../storage/keys";
import {
  deleteSecureItem,
  getSecureItem,
  setSecureItem,
} from "../storage/secureStore";

export async function saveAuthTokens(
  accessToken: string,
  refreshToken?: string,
) {
  await setSecureItem(STORAGE_KEYS.AUTH_ACCESS_TOKEN, accessToken);

  if (refreshToken) {
    await setSecureItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN, refreshToken);
  }
}

export async function getAccessToken() {
  return getSecureItem(STORAGE_KEYS.AUTH_ACCESS_TOKEN);
}

export async function getRefreshToken() {
  return getSecureItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
}

export async function clearAuthTokens() {
  await Promise.all([
    deleteSecureItem(STORAGE_KEYS.AUTH_ACCESS_TOKEN),
    deleteSecureItem(STORAGE_KEYS.AUTH_REFRESH_TOKEN),
  ]);
}