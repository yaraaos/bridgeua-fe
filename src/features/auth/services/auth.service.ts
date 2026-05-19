import type {
  ConfirmCodePayload,
  ConfirmCodeResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  RegisterBusinessPayload,
  RegisterBusinessResponse,
  RegisterPersonalPayload,
  RegisterResponse,
  ResendCodePayload,
  ResendCodeResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  SignInPayload,
  SignInResponse,
} from "../types/auth.types";

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

export async function registerPersonal(
  payload: RegisterPersonalPayload,
): Promise<RegisterResponse> {
  // TODO: Replace with real BE request when endpoint is ready.
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (payload.email === "taken@test.com") {
    throw new Error("Email is already registered");
  }
  if (payload.username === "taken") {
    throw new Error("Username is already taken");
  }

  return {
    userId: "user-1",
    email: payload.email,
    verificationRequired: true,
  };
}

export async function registerBusiness(
  payload: RegisterBusinessPayload,
): Promise<RegisterBusinessResponse> {
  // TODO: Replace with real BE request when endpoint is ready.
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (payload.email === "taken@test.com") {
    throw new Error("Email is already registered");
  }

  return {
    userId: "business-user-1",
    email: payload.email,
    verificationRequired: true,
  };
}

export async function confirmCode(
  payload: ConfirmCodePayload,
): Promise<ConfirmCodeResponse> {
  // TODO: Replace with real BE request when endpoint is ready.
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (payload.code !== "1234") {
    throw new Error("Incorrect confirmation code");
  }

  return {
    verified: true,
  };
}

export async function resendCode(
  payload: ResendCodePayload,
): Promise<ResendCodeResponse> {
  // TODO: Replace with real BE request when endpoint is ready.
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
  };
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  // TODO: Replace with real BE request when endpoint is ready.
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
  };
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> {
  // TODO: Replace with real BE request when endpoint is ready.
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
  };
}
