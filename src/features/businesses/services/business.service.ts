// src/features/businesses/services/business.service.ts
import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { apiClient } from "@/src/services/api/client";
import { API_BASE_URL } from "@/src/services/api/config";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import {
  GalleryPhoto,
  ServiceLibraryItem,
  UpdateBusinessAboutPayload,
  UpdateBusinessOverviewPayload,
  UpdateBusinessServicesPayload,
} from "../types/editBusiness.types";

export type GetBusinessesParams = {
  categoryId?: string;
  categoryName?: string;
  sort?: string;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
  state?: string;
};

const getAbsoluteImageUrl = (url: string) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
};

const normalizeBusinessDetailsImages = (
  business: BusinessDetails | null,
): BusinessDetails | null => {
  if (!business) return business;

  return {
    ...business,
    avatarUrl: business.avatarUrl
      ? getAbsoluteImageUrl(business.avatarUrl)
      : business.avatarUrl,
    images: business.images.map((image) => ({
      ...image,
      url: getAbsoluteImageUrl(image.url),
    })),
  };
};

export const getBusinesses = async (
  params?: GetBusinessesParams,
): Promise<Business[]> => {
  let url: string = ENDPOINTS.BUSINESSES;

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
    if (params.state) query.set("state", params.state);

    const qs = query.toString();
    if (qs) url = `${url}?${qs}`;
  }

  const res = await apiClient.get<Business[]>(url);

  return res.data.map((business) => ({
    ...business,
    avatarUrl: business.avatarUrl
      ? getAbsoluteImageUrl(business.avatarUrl)
      : business.avatarUrl,
    image: business.image
      ? getAbsoluteImageUrl(business.image)
      : business.image,
  }));
};

export const getBusinessDetailsById = async (
  id: string,
): Promise<BusinessDetails | null> => {
  const res = await apiClient.get<BusinessDetails>(
    ENDPOINTS.BUSINESS_BY_ID(id),
  );

  return normalizeBusinessDetailsImages(res.data);
};

export const getMyBusinessProfile =
  async (): Promise<BusinessDetails | null> => {
    const res = await apiClient.get<BusinessDetails>(ENDPOINTS.BUSINESSES_ME);

    return normalizeBusinessDetailsImages(res.data);
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
      latitude: payload.latitude ? parseFloat(payload.latitude) : undefined,
      longitude: payload.longitude ? parseFloat(payload.longitude) : undefined,
    },
  );

  return normalizeBusinessDetailsImages(res.data) as BusinessDetails;
};

export type BusinessAvatarUploadResponse = {
  avatarUrl: string;
  business: BusinessDetails;
};

export const uploadBusinessAvatar = async (
  uri: string,
): Promise<BusinessAvatarUploadResponse> => {
  const formData = new FormData();

  formData.append("avatar", {
    uri,
    name: "business-avatar.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const res = await apiClient.post<BusinessAvatarUploadResponse>(
    ENDPOINTS.BUSINESSES_ME_AVATAR,
    formData,
  );

  return {
    avatarUrl: getAbsoluteImageUrl(res.data.avatarUrl),
    business: normalizeBusinessDetailsImages(
      res.data.business,
    ) as BusinessDetails,
  };
};

export const updateBusinessAbout = async (
  payload: UpdateBusinessAboutPayload,
): Promise<BusinessDetails> => {
  const res = await apiClient.patch<BusinessDetails>(
    ENDPOINTS.BUSINESSES_ME_ABOUT,
    {
      description: payload.description,
      languages: payload.languages,
      amenities: payload.amenities,
    },
  );

  return normalizeBusinessDetailsImages(res.data) as BusinessDetails;
};

export const getBusinessServiceLibrary = async (): Promise<
  ServiceLibraryItem[]
> => {
  const res = await apiClient.get<ServiceLibraryItem[]>(
    ENDPOINTS.BUSINESSES_ME_SERVICE_LIBRARY,
  );

  return res.data;
};

export const updateBusinessServices = async (
  payload: UpdateBusinessServicesPayload,
): Promise<BusinessDetails> => {
  const res = await apiClient.patch<BusinessDetails>(
    ENDPOINTS.BUSINESSES_ME_SERVICES,
    payload,
  );

  return normalizeBusinessDetailsImages(res.data) as BusinessDetails;
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
  url: getAbsoluteImageUrl(photo.url ?? photo.imageUrl),
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

export const deleteBusiness = async (businessId: string): Promise<void> => {
  await apiClient.delete(ENDPOINTS.BUSINESS_BY_ID(businessId));
};

export const getBusinessStates = async (): Promise<string[]> => {
  const res = await apiClient.get<string[]>(ENDPOINTS.BUSINESSES_STATES);
  return res.data;
};
