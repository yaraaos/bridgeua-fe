export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};

export type ApiFieldErrors = Record<string, string>;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: ApiFieldErrors;
  readonly isNetworkError: boolean;

  constructor(
    message: string,
    status: number,
    fieldErrors?: ApiFieldErrors,
    isNetworkError = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.isNetworkError = isNetworkError;
  }
}

export function parseApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e;
  if (e instanceof Error) return new ApiError(e.message, 0);
  return new ApiError("An unexpected error occurred", 0);
}