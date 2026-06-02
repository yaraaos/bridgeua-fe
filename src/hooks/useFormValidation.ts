import { useState } from "react";

export function useFormValidation() {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function triggerError(message: string) {
    setShowError(true);
    setErrorMessage(message);
  }

  function clearError() {
    setShowError(false);
  }

  return { showError, errorMessage, triggerError, clearError };
}
