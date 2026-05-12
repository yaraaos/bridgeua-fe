import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export async function getOnboardingSeen(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);
    return value === "true";
  } catch {
    return false;
  }
}

export async function setOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, "true");
  } catch {
    // Non-fatal
  }
}

export async function clearOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_SEEN);
  } catch {
    // Non-fatal
  }
}