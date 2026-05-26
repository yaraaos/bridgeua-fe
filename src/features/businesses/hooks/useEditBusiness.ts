import { useState } from "react";

import { apiClient } from "@/src/services/api/client";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";
import type {
  EditBusinessTab,
  UpdateBusinessOverviewPayload,
} from "@/src/features/businesses/types/editBusiness.types";

export function useEditBusiness() {
  const [savingTab, setSavingTab] = useState<EditBusinessTab | null>(null);
  const [errorTab, setErrorTab] = useState<EditBusinessTab | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const markSaved = useEditBusinessStore((s) => s.markSaved);
  const overviewDraft = useEditBusinessStore((s) => s.overviewDraft);

  async function saveOverview(): Promise<{ ok: boolean }> {
    setSavingTab("overview");
    setErrorTab(null);
    setSaveError(null);

    const payload: UpdateBusinessOverviewPayload = {
      name: overviewDraft.name,
      category: overviewDraft.category,
      address: overviewDraft.address,
      city: overviewDraft.city,
      state: overviewDraft.state,
      phone: overviewDraft.phone,
      socialLinks: overviewDraft.socialLinks,
      hours: overviewDraft.hours,
    };

    try {
      await apiClient.patch(
        "/api/businesses/me/overview",
        payload as unknown as Record<string, unknown>
      );
      markSaved("overview");
      setSavingTab(null);
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes";
      setSaveError(message);
      setErrorTab("overview");
      setSavingTab(null);
      return { ok: false };
    }
  }

  return {
    saveOverview,
    isSaving: savingTab === "overview",
    hasError: errorTab === "overview",
    saveError,
  };
}
