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
  AUTH_REFRESH: "/api/auth/refresh",
  AUTH_LOGOUT: "/api/auth/logout",

  // Users
  USERS_ME: "/api/users/me",
  USERS_ME_AVATAR: "/api/users/me/avatar",
  USERS_ME_REVIEWS: "/api/users/me/reviews",
  USERS_ME_FOLLOWING: "/api/users/me/following",

  // Categories
  CATEGORIES: "/api/categories",

  // Businesses
  BUSINESSES: "/api/businesses",
  BUSINESS_BY_ID: (id: string) => `/api/businesses/${id}`,
  BUSINESS_PHOTOS: (id: string) => `/api/businesses/${id}/photos`,
  BUSINESS_PHOTO_BY_ID: (id: string, photoId: string) =>
    `/api/businesses/${id}/photos/${photoId}`,
  BUSINESS_REVIEWS: (id: string) => `/api/businesses/${id}/reviews`,
  REVIEW_BY_ID: (businessId: string, reviewId: string) =>
    `/api/businesses/${businessId}/reviews/${reviewId}`,
  BUSINESS_FOLLOW: (id: string) => `/api/businesses/${id}/follow`,

  // Bookings
  BOOKINGS: "/api/bookings",
} as const;
