import { apiClient } from "@/src/services/api/client";
import { ENDPOINTS } from "@/src/services/api/endpoints";

export const fetchFollowedBusinessIds = async (): Promise<string[]> => {
  const res = await apiClient.get<string[]>(ENDPOINTS.USERS_ME_FOLLOWING);
  return res.data;
};

export const followBusiness = async (businessId: string): Promise<void> => {
  await apiClient.post(ENDPOINTS.BUSINESS_FOLLOW(businessId));
};

export const unfollowBusiness = async (businessId: string): Promise<void> => {
  await apiClient.delete(ENDPOINTS.BUSINESS_FOLLOW(businessId));
};
