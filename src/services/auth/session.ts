export type AuthSession = {
  accessToken: string;
};

export async function getAuthSession(): Promise<AuthSession | null> {
  // TODO: Replace with real SecureStore token/session validation.
  return null;
}
