import { Linking } from "react-native";

export async function openExternalUrl(url: string): Promise<void> {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
}

export function openWhatsApp(phoneNumber: string): Promise<void> {
  const digits = phoneNumber.replace(/\D/g, "");
  return openExternalUrl(`whatsapp://send?phone=${digits}`);
}

export function openTelegram(username: string): Promise<void> {
  const clean = username.startsWith("@") ? username.slice(1) : username;
  return openExternalUrl(`https://t.me/${clean}`);
}

export function buildSocialUrl(
  platform: "instagram" | "facebook",
  username: string
): string {
  const clean = username.replace(/^@/, "").replace(/^https?:\/\/[^/]+\//, "");
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "facebook":
      return `https://facebook.com/${clean}`;
  }
}
