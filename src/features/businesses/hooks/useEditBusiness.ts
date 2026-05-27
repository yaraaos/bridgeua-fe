import { useState } from "react";

import type {
  EditBusinessTab,
  UpdateBusinessAboutPayload,
  UpdateBusinessOverviewPayload,
  UpdateBusinessServicesPayload
} from "@/src/features/businesses/types/editBusiness.types";
import { apiClient } from "@/src/services/api/client";
import { useEditBusinessStore } from "@/src/store/editBusiness.store";
import {
  deleteBusinessGalleryPhoto,
  updateBusinessDefaultPhotos,
  updateBusinessOverview,
  uploadBusinessGalleryPhoto,
} from "../services/business.service";

export function useEditBusiness(businessId?: string) {
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
      if (!businessId) {
        throw new Error("Business profile is not loaded yet");
      }

      await updateBusinessOverview(businessId, payload);
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

    try {
      if (!businessId) {
        throw new Error("Business profile is not loaded yet");
      }

      const currentPhotos = galleryDraft.photos;

      const uploadedPhotos = await Promise.all(
        currentPhotos
          .filter((photo) => photo.isLocal)
          .map((photo) => uploadBusinessGalleryPhoto(businessId, photo.url)),
      );

      const existingPhotos = currentPhotos.filter((photo) => !photo.isLocal);

      const deletedPhotoIds = galleryDraft.deletedPhotoIds ?? [];

      await Promise.all(
        deletedPhotoIds.map((photoId) =>
          deleteBusinessGalleryPhoto(businessId, photoId),
        ),
      );

      const idMap = new Map<string, string>();

      currentPhotos
        .filter((photo) => photo.isLocal)
        .forEach((localPhoto, index) => {
          const uploaded = uploadedPhotos[index];
          if (uploaded) {
            idMap.set(localPhoto.id, uploaded.id);
          }
        });

      const finalDefaultPhotoIds = galleryDraft.defaultPhotoIds
        .map((id) => idMap.get(id) ?? id)
        .filter((id) =>
          [...existingPhotos, ...uploadedPhotos].some(
            (photo) => photo.id === id,
          ),
        );

      const serverPhotos = await updateBusinessDefaultPhotos(
        businessId,
        finalDefaultPhotoIds,
      );

      useEditBusinessStore.getState().setGalleryDraft({
        photos: serverPhotos,
        defaultPhotoIds: finalDefaultPhotoIds,
        deletedPhotoIds: [],
      });

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
