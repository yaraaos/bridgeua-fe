import { useState } from "react";

import { apiClient } from "@/src/services/api/client";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";
import type {
  EditBusinessTab,
  UpdateBusinessOverviewPayload,
  UpdateBusinessServicesPayload,
} from "@/src/features/businesses/types/editBusiness.types";

export function useEditBusiness() {
  const [savingTab, setSavingTab] = useState<EditBusinessTab | null>(null);
  const [errorTab, setErrorTab] = useState<EditBusinessTab | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const markSaved = useEditBusinessStore((s) => s.markSaved);
  const overviewDraft = useEditBusinessStore((s) => s.overviewDraft);
  const servicesDraft = useEditBusinessStore((s) => s.servicesDraft);

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

  async function saveServices(): Promise<{ ok: boolean }> {
    setSavingTab("services");
    setErrorTab(null);
    setSaveError(null);

    const payload: UpdateBusinessServicesPayload = {
      services: servicesDraft.services.map((svc) => ({
        id: svc.id,
        name: svc.name,
        durationMinutes: parseInt(svc.duration, 10),
        price: parseFloat(svc.price),
      })),
    };

    try {
      await apiClient.patch(
        "/api/businesses/me/services",
        payload as unknown as Record<string, unknown>
      );
      markSaved("services");
      setSavingTab(null);
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes";
      setSaveError(message);
      setErrorTab("services");
      setSavingTab(null);
      return { ok: false };
    }
  }

  return {
    saveOverview,
    saveServices,
    isSaving: savingTab === "overview",
    isSavingServices: savingTab === "services",
    hasError: errorTab === "overview",
    hasServicesError: errorTab === "services",
    saveError,
  };
}
