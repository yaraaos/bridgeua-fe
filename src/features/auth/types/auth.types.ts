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
