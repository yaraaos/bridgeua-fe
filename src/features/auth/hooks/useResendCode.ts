import { useState } from "react";
import { resendCode } from "../services/auth.service";
import type {
  ResendCodePayload,
  ResendCodeResponse,
} from "../types/auth.types";

export function useResendCode() {
  const [isLoading, setIsLoading] = useState(false);

  const submitResendCode = async (
    payload: ResendCodePayload
  ): Promise<ResendCodeResponse | null> => {
    try {
      setIsLoading(true);

      return await resendCode(payload);
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitResendCode,
    isLoading,
  };
}