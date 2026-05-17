import { useState } from "react";

import { resetPassword } from "../services/auth.service";

import type {
    ResetPasswordPayload,
    ResetPasswordResponse,
} from "../types/auth.types";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const submitResetPassword = async (
    payload: ResetPasswordPayload,
  ): Promise<ResetPasswordResponse | null> => {
    try {
      setIsLoading(true);
      setApiError(null);

      return await resetPassword(payload);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Something went wrong",
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitResetPassword,
    isLoading,
    apiError,
    setApiError,
  };
}
