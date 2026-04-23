// src/features/businesses/services/business.service.ts

import { businessesMock } from "@/src/mocks/businesses.mock";
import type { Business } from "@/src/types/business";

export const getBusinesses = async (): Promise<Business[]> => {
  return Promise.resolve(businessesMock);
};
