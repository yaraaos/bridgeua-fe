export type SignInPayload = {
  email: string;
  password: string;
};

export type UsernameAvailabilityResponse = {
  available: boolean;
};

export type AuthUser = {
  id: string | number;
  email: string;
  name?: string;
  accountType?: "personal" | "business";
  isEmailConfirmed?: boolean;
};

export type SignInResponse = {
  user: AuthUser;
  token: string;
};

export type RegisterPersonalPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  userId: string;
  email: string;
  verificationRequired: boolean;
  confirmationCode?: string;
};

export type RegisterBusinessPayload = {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  category: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
};

export type RegisterBusinessResponse = RegisterResponse;

export type ConfirmCodePayload = {
  email: string;
  code: string;
};

export type ConfirmCodeResponse = {
  verified: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
};

export type ResendCodePayload = {
  email: string;
};

export type ResendCodeResponse = {
  success: boolean;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
};

export type ResetPasswordPayload = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordResponse = {
  success: boolean;
};
