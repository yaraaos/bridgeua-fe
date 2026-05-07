import { useState } from "react";
import { confirmCode } from "../services/auth.service";
import type {
  ConfirmCodePayload,
  ConfirmCodeResponse,
} from "../types/auth.types";

export function useConfirmCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const submitConfirmCode = async (
    payload: ConfirmCodePayload
  ): Promise<ConfirmCodeResponse | null> => {
    try {
      setIsLoading(true);
      setApiError(null);

      return await confirmCode(payload);
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
    submitConfirmCode,
    isLoading,
    apiError,
    setApiError,
  };
}