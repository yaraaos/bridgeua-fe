// src/features/businesses/services/business.service.ts

import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";

export const getBusinesses = async (): Promise<Business[]> => {
  const res = await apiClient.get<Business[]>(ENDPOINTS.BUSINESSES);
  return res.data;
};

export const getBusinessDetailsById = async (
  id: string,
): Promise<BusinessDetails | null> => {
  const res = await apiClient.get<BusinessDetails>(ENDPOINTS.BUSINESS_BY_ID(id));
  return res.data;
};
