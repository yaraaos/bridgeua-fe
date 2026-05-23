import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "../storage/keys";
import { clearAuthTokens, getAccessToken } from "./tokens";

export type AuthSession =
  | {
      type: "authenticated";
      accessToken: string;
    }
  | {
      type: "guest";
    };

export async function startGuestSession() {
  await clearAuthTokens();
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_GUEST_SESSION, "true");
}

export async function clearGuestSession() {
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_GUEST_SESSION);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const accessToken = await getAccessToken();

  if (accessToken) {
    return {
      type: "authenticated",
      accessToken,
    };
  }

  const isGuest = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_GUEST_SESSION);

  if (isGuest === "true") {
    return {
      type: "guest",
    };
  }

  return null;
}
