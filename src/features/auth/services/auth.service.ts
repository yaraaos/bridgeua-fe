import type { SignInPayload, SignInResponse } from "../types/auth.types";

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  // TODO: Replace with real BE request when endpoint is ready.
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (payload.email !== "test@test.com" || payload.password !== "password") {
    throw new Error("Invalid credentials");
  }

  return {
    user: {
      id: "user-1",
      email: payload.email,
      name: "Test User",
    },
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };
}