export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: "/api/auth/register",
  AUTH_REGISTER_PERSONAL: "/api/auth/register/personal",
  AUTH_REGISTER_BUSINESS: "/api/auth/register/business",
  AUTH_CONFIRM_CODE: "/api/auth/confirm-code",
  AUTH_RESEND_CODE: "/api/auth/resend-code",
  AUTH_LOGIN: "/api/auth/login",
  AUTH_ME: "/api/auth/me",
  AUTH_FORGOT_PASSWORD: "/api/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/api/auth/reset-password",
  AUTH_USERNAME_AVAILABILITY: (username: string) =>
    `/api/auth/username-availability?username=${encodeURIComponent(username)}`,

  // Users
  USERS_ME: "/api/users/me",
  USERS_ME_AVATAR: "/api/users/me/avatar",

  // Categories
  CATEGORIES: "/api/categories",

  // Businesses
  BUSINESSES: "/api/businesses",
  BUSINESS_BY_ID: (id: string) => `/api/businesses/${id}`,
  BUSINESS_PHOTOS: (id: string) => `/api/businesses/${id}/photos`,
  BUSINESS_PHOTO_BY_ID: (id: string, photoId: string) =>
    `/api/businesses/${id}/photos/${photoId}`,
} as const;
