// src/features/businesses/services/business.service.ts

import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";
import { UpdateBusinessOverviewPayload } from "../types/editBusiness.types";

export const getBusinesses = async (): Promise<Business[]> => {
  const res = await apiClient.get<Business[]>(ENDPOINTS.BUSINESSES);
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

export const updateBusinessOverview = async (
  businessId: string,
  payload: UpdateBusinessOverviewPayload,
): Promise<BusinessDetails> => {
  const res = await apiClient.patch<BusinessDetails>(
    ENDPOINTS.BUSINESS_BY_ID(businessId),
    {
      address: payload.address,
      zipCode: payload.postalCode,
      city: payload.city,
      state: payload.state,
      phone: payload.phone,
      website: payload.socialLinks.website,
    },
  );

  return res.data;
};
