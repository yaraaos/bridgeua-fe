import { useState } from "react";
import { registerPersonal } from "../services/auth.service";
import type {
  RegisterPersonalPayload,
  RegisterResponse,
} from "../types/auth.types";

export function useRegisterPersonal() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const submitRegisterPersonal = async (
    payload: RegisterPersonalPayload,
  ): Promise<RegisterResponse | null> => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await registerPersonal(payload);

      console.log("[register] confirmationCode:", response.confirmationCode);

      return response;
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
    submitRegisterPersonal,
    isLoading,
    apiError,
    setApiError,
  };
}
