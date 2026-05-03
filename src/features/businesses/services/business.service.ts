// src/features/businesses/services/business.service.ts

import type {
  Business,
  BusinessDetails,
} from "@/src/features/businesses/types/business.types";
import { businessDetailsMock } from "@/src/mocks/business-details.mock";
import { businessesMock } from "@/src/mocks/businesses.mock";

export const getBusinesses = async (): Promise<Business[]> => {
  return Promise.resolve(businessesMock);
};

export const getBusinessDetailsById = async (
  id: string,
): Promise<BusinessDetails | null> => {
  const business = businessDetailsMock.find((item) => item.id === id);

  return Promise.resolve(business ?? null);
};
