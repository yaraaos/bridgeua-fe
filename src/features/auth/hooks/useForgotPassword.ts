import { useState } from "react";

import { forgotPassword } from "../services/auth.service";

import type {
    ForgotPasswordPayload,
    ForgotPasswordResponse,
} from "../types/auth.types";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const submitForgotPassword = async (
    payload: ForgotPasswordPayload,
  ): Promise<ForgotPasswordResponse | null> => {
    try {
      setIsLoading(true);
      setApiError(null);

      return await forgotPassword(payload);
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
    submitForgotPassword,
    isLoading,
    apiError,
    setApiError,
  };
}
