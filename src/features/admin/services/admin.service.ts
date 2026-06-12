import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import type {
  AdminUser,
  AdminUsersResponse,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/admin.types";

export async function fetchAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  accountType?: string;
}): Promise<AdminUsersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.accountType) query.set("accountType", params.accountType);

  const res = await apiClient.get<AdminUsersResponse>(
    `${ENDPOINTS.ADMIN_USERS}?${query.toString()}`,
  );
  return res.data;
}

export async function fetchAdminUser(id: number): Promise<AdminUser> {
  const res = await apiClient.get<AdminUser>(ENDPOINTS.ADMIN_USER_BY_ID(id));
  return res.data;
}

export async function createAdminUser(payload: CreateUserPayload): Promise<AdminUser> {
  const res = await apiClient.post<AdminUser>(
    ENDPOINTS.ADMIN_USERS,
    payload as unknown as Record<string, unknown>,
  );
  return res.data;
}

export async function updateAdminUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<AdminUser> {
  const res = await apiClient.patch<AdminUser>(
    ENDPOINTS.ADMIN_USER_BY_ID(id),
    payload as unknown as Record<string, unknown>,
  );
  return res.data;
}

export async function deleteAdminUser(id: number): Promise<void> {
  await apiClient.delete(ENDPOINTS.ADMIN_USER_BY_ID(id));
}