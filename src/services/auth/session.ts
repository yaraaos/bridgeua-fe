import { getAccessToken } from "./tokens";

export type AuthSession = {
  accessToken: string;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  // TODO: Add JWT validation / refresh token flow when backend is ready.
  return {
    accessToken,
  };
}
