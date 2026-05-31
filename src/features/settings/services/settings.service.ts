import { apiClient } from '@/src/services/api/client';
import { ENDPOINTS } from '@/src/services/api/endpoints';
import type { UserSettings } from '../types/settings.types';

export const getSettings = async (): Promise<UserSettings> => {
  const response = await apiClient.get<UserSettings>(ENDPOINTS.SETTINGS);
  return response.data;
};

export const updateSettings = async (patch: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await apiClient.patch<UserSettings>(ENDPOINTS.SETTINGS, patch as Record<string, unknown>);
  return response.data;
};
