import { useState } from "react";

import type {
    EditBusinessTab,
    UpdateBusinessAboutPayload,
    UpdateBusinessGalleryPayload,
    UpdateBusinessOverviewPayload,
    UpdateBusinessServicesPayload,
} from "@/src/features/businesses/types/editBusiness.types";
import { apiClient } from "@/src/services/api/client";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";

export function useEditBusiness() {
  const [savingTab, setSavingTab] = useState<EditBusinessTab | null>(null);
  const [errorTab, setErrorTab] = useState<EditBusinessTab | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const markSaved = useEditBusinessStore((s) => s.markSaved);
  const overviewDraft = useEditBusinessStore((s) => s.overviewDraft);
  const galleryDraft = useEditBusinessStore((s) => s.galleryDraft);
  const servicesDraft = useEditBusinessStore((s) => s.servicesDraft);
  const aboutDraft = useEditBusinessStore((s) => s.aboutDraft);

  async function saveOverview(): Promise<{ ok: boolean }> {
    setSavingTab("overview");
    setErrorTab(null);
    setSaveError(null);

    let finalAvatarUrl = overviewDraft.avatarUrl;

    if (overviewDraft.avatarUrl?.startsWith("file")) {
      const formData = new FormData();

      formData.append("avatar", {
        uri: overviewDraft.avatarUrl,
        name: "business-avatar.jpg",
        type: "image/jpeg",
      } as unknown as Blob);

      const avatarRes = await apiClient.post<{ avatarUrl: string }>(
        "/api/businesses/me/avatar",
        formData,
      );

      finalAvatarUrl = avatarRes.data.avatarUrl;
    }

    const payload: UpdateBusinessOverviewPayload = {
      name: overviewDraft.name,
      category: overviewDraft.category,
      avatarUrl: finalAvatarUrl,
      address: overviewDraft.address,
      postalCode: overviewDraft.postalCode,
      city: overviewDraft.city,
      state: overviewDraft.state,
      phone: overviewDraft.phone,
      socialLinks: overviewDraft.socialLinks,
      hours: overviewDraft.hours,
    };

    try {
      await apiClient.patch(
        "/api/businesses/me/overview",
        payload as unknown as Record<string, unknown>,
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

  async function saveGallery(): Promise<{ ok: boolean }> {
    setSavingTab("gallery");
    setErrorTab(null);
    setSaveError(null);

    const payload: UpdateBusinessGalleryPayload = {
      newPhotoUris: galleryDraft.photos
        .filter((p) => p.isLocal)
        .map((p) => p.url),
      existingPhotoIds: galleryDraft.photos
        .filter((p) => !p.isLocal)
        .map((p) => p.id),
      defaultPhotoIds: galleryDraft.defaultPhotoIds,
    };

    try {
      await apiClient.post(
        "/api/businesses/me/gallery",
        payload as unknown as Record<string, unknown>,
      );
      markSaved("gallery");
      setSavingTab(null);
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes";
      setSaveError(message);
      setErrorTab("gallery");
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
        payload as unknown as Record<string, unknown>,
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

  async function saveAbout(): Promise<{ ok: boolean }> {
    setSavingTab("about");
    setErrorTab(null);
    setSaveError(null);

    const payload: UpdateBusinessAboutPayload = {
      description: aboutDraft.description,
      languages: aboutDraft.languages,
      amenities: aboutDraft.amenities,
    };

    try {
      await apiClient.patch(
        "/api/businesses/me/about",
        payload as unknown as Record<string, unknown>,
      );
      markSaved("about");
      setSavingTab(null);
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes";
      setSaveError(message);
      setErrorTab("about");
      setSavingTab(null);
      return { ok: false };
    }
  }

  return {
    saveOverview,
    saveGallery,
    saveServices,
    saveAbout,
    isSaving: savingTab === "overview",
    isSavingGallery: savingTab === "gallery",
    isSavingServices: savingTab === "services",
    isSavingAbout: savingTab === "about",
    hasError: errorTab === "overview",
    hasGalleryError: errorTab === "gallery",
    hasServicesError: errorTab === "services",
    hasAboutError: errorTab === "about",
    saveError,
  };
}
