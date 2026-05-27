import { useState } from "react";
import { registerBusiness } from "../services/auth.service";
import type {
  RegisterBusinessPayload,
  RegisterBusinessResponse,
} from "../types/auth.types";

export function useRegisterBusiness() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const submitRegisterBusiness = async (
    payload: RegisterBusinessPayload,
  ): Promise<RegisterBusinessResponse | null> => {
    try {
      setIsLoading(true);
      setApiError(null);

      return await registerBusiness(payload);
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
    submitRegisterBusiness,
    isLoading,
    apiError,
    setApiError,
  };
}
