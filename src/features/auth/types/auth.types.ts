export type SignInPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type SignInResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

export type RegisterPersonalPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  userId: string;
  email: string;
  verificationRequired: boolean;
};

export type RegisterBusinessPayload = {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  category?: string;
};

export type RegisterBusinessResponse = RegisterResponse;

export type ConfirmCodePayload = {
  email: string;
  code: string;
};

export type ConfirmCodeResponse = {
  verified: boolean;
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
