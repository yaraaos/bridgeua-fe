import { API_BASE_URL } from './config';
import { getAccessToken } from '../auth/tokens';
import type { ApiResponse, ApiErrorResponse } from './types';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | FormData;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
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

  const json = await response.json();

  if (!response.ok) {
    const err = json as ApiErrorResponse;
    throw new Error(err.message ?? `Request failed with status ${response.status}`);
  }

  return json as ApiResponse<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: Record<string, unknown> | FormData, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  patch: <T>(path: string, body?: Record<string, unknown> | FormData, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
