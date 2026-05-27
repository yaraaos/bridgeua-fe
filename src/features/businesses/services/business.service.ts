// src/features/businesses/services/business.service.ts

import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import {
  GalleryPhoto,
  UpdateBusinessOverviewPayload,
} from "../types/editBusiness.types";

export type GetBusinessesParams = {
  categoryId?: string;
  categoryName?: string;
  sort?: string;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
};

export const getBusinesses = async (
  params?: GetBusinessesParams,
): Promise<Business[]> => {
  let url = ENDPOINTS.BUSINESSES;

  if (params) {
    const query = new URLSearchParams();
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.categoryName) query.set("categoryName", params.categoryName);
    if (params.sort && params.sort !== "relevance")
      query.set("sort", params.sort);
    if (params.minRating) query.set("minRating", String(params.minRating));
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    if (qs) url = `${url}?${qs}`;
  }

  const res = await apiClient.get<Business[]>(url);
  return res.data;
};

export const getBusinessDetailsById = async (
  id: string,
): Promise<BusinessDetails | null> => {
  const res = await apiClient.get<BusinessDetails>(
    ENDPOINTS.BUSINESS_BY_ID(id),
  );
  return res.data;
};

export const getMyBusinessProfile =
  async (): Promise<BusinessDetails | null> => {
    const res = await apiClient.get<BusinessDetails>(ENDPOINTS.BUSINESSES_ME);
    return res.data;
  };

const DAY_TO_API_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const updateBusinessOverview = async (
  businessId: string,
  payload: UpdateBusinessOverviewPayload,
): Promise<BusinessDetails> => {
  const res = await apiClient.patch<BusinessDetails>(
    ENDPOINTS.BUSINESS_BY_ID(businessId),
    {
      name: payload.name,
      address: payload.address,
      zipCode: payload.postalCode,
      city: payload.city,
      state: payload.state,
      phone: payload.phone,
      website: payload.socialLinks.website,
      instagram: payload.socialLinks.instagram,
      facebook: payload.socialLinks.facebook,
      telegram: payload.socialLinks.telegram,
      whatsapp: payload.socialLinks.whatsapp,
      hours: payload.hours.map((hour) => ({
        day: DAY_TO_API_INDEX[hour.day],
        opensAt: hour.isOpen ? hour.openTime : null,
        closesAt: hour.isOpen ? hour.closeTime : null,
        isClosed: !hour.isOpen,
      })),
    },
  );

  return res.data;
};

export type BusinessGalleryPhotoResponse = {
  id: string;
  businessId: string;
  imageUrl: string;
  url: string;
  isDefault: boolean;
  sortOrder: number;
};

const toGalleryPhoto = (photo: BusinessGalleryPhotoResponse): GalleryPhoto => ({
  id: photo.id,
  url: photo.url ?? photo.imageUrl,
  isLocal: false,
});

export const uploadBusinessGalleryPhoto = async (
  businessId: string,
  uri: string,
): Promise<GalleryPhoto> => {
  const formData = new FormData();

  formData.append("photo", {
    uri,
    name: "business-gallery-photo.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const res = await apiClient.post<BusinessGalleryPhotoResponse>(
    ENDPOINTS.BUSINESS_PHOTOS(businessId),
    formData,
  );

  return toGalleryPhoto(res.data);
};

export const deleteBusinessGalleryPhoto = async (
  businessId: string,
  photoId: string,
): Promise<void> => {
  await apiClient.delete(ENDPOINTS.BUSINESS_PHOTO_BY_ID(businessId, photoId));
};

export const updateBusinessDefaultPhotos = async (
  businessId: string,
  defaultPhotoIds: string[],
): Promise<GalleryPhoto[]> => {
  const res = await apiClient.patch<BusinessGalleryPhotoResponse[]>(
    `${ENDPOINTS.BUSINESS_PHOTOS(businessId)}/defaults`,
    { defaultPhotoIds },
  );

  return res.data.map(toGalleryPhoto);
};
