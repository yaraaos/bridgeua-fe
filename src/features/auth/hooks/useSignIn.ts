import { useState } from "react";
import { signIn } from "../services/auth.service";
import type { SignInPayload, SignInResponse } from "../types/auth.types";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const submitSignIn = async (
    payload: SignInPayload
  ): Promise<SignInResponse | null> => {
    try {
      setIsLoading(true);
      setApiError(null);

      return await signIn(payload);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Something went wrong"
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitSignIn,
    isLoading,
    apiError,
    setApiError,
  };
}