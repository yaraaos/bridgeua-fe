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
  isAdmin?: boolean;
  ownedBusinessIds?: string[];
  activeBusinessId?: string | null;
  businessName?: string | null;
  ownedBusiness?: {
    id: string;
    categoryId: string;
    categorySlug?: string | null;
    categoryName?: string | null;
    city?: string | null;
    state?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
};

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
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
  cuisine?: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
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
