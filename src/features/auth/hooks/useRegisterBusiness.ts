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
    payload: RegisterBusinessPayload
  ): Promise<RegisterBusinessResponse | null> => {
    try {
      setIsLoading(true);
      setApiError(null);

      // address, zipCode, city, state are not yet supported by BE — strip them
      // before the request. The caller stores them in editBusiness store separately.
      // Remove this destructuring once BE adds support for these fields.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { address, zipCode, city, state, ...apiPayload } = payload;
      return await registerBusiness(apiPayload as RegisterBusinessPayload);
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
    submitRegisterBusiness,
    isLoading,
    apiError,
    setApiError,
  };
}