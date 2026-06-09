import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "../auth/tokens";
import { API_BASE_URL } from "./config";
import { ApiError } from "./types";
import type { ApiErrorResponse, ApiResponse } from "./types";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown> | FormData;
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let isForcingLogout = false;

async function handleSessionExpired(): Promise<void> {
  if (isForcingLogout) return;
  isForcingLogout = true;

  try {
    const { useAuthStore } = await import("@/src/store/auth.store");
    await useAuthStore.getState().forceSignOut();

    const { router } = await import("expo-router");
    router.replace("/auth/sign-in");
  } finally {
    isForcingLogout = false;
  }
}

async function tryRefreshToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        await clearAuthTokens();
        return null;
      }

      const json = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = json.data;

      await saveAuthTokens(accessToken, newRefreshToken);

      const { useAuthStore } = await import("@/src/store/auth.store");
      const { saveAccountTokens } = await import("../auth/multiAccountStorage");

      const activeUser = useAuthStore.getState().user;

      if (activeUser?.id) {
        await saveAccountTokens({
          userId: String(activeUser.id),
          accountType: activeUser.accountType ?? "personal",
          accessToken,
          refreshToken: newRefreshToken,
        });
      }

      return accessToken;
    } catch {
      await clearAuthTokens();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<ApiResponse<T>> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
      body:
        options.body instanceof FormData
          ? options.body
          : options.body != null
            ? JSON.stringify(options.body)
            : undefined,
    });
  } catch {
    throw new ApiError(
      "Network request failed. Please check your connection.",
      0,
      undefined,
      true,
    );
  }

  // Auto-refresh on 401, but not for auth endpoints and not on retry
  if (response.status === 401 && !isRetry && !path.includes("/api/auth/")) {
    const newAccessToken = await tryRefreshToken();
    if (newAccessToken) {
      return request<T>(path, options, true);
    }
    await handleSessionExpired();
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  const json = await response.json();

  if (!response.ok) {
    const err = json as ApiErrorResponse;
    if (response.status === 422) {
      throw new ApiError(
        err.message ?? "Validation failed",
        422,
        err.errors,
      );
    }
    if (response.status >= 500) {
      throw new ApiError(
        "Something went wrong. Please try again.",
        response.status,
      );
    }
    throw new ApiError(
      err.message ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return json as ApiResponse<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: Record<string, unknown> | FormData,
    options?: RequestOptions,
  ) => request<T>(path, { ...options, method: "POST", body }),

  patch: <T>(
    path: string,
    body?: Record<string, unknown> | FormData,
    options?: RequestOptions,
  ) => request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
