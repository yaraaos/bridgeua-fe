import { useProfileStore } from '@/src/store/profile.store';
import { useState } from 'react';
import { updateSettings } from '../services/settings.service';
import type { UserSettings } from '../types/settings.types';

export function useSettings() {
  const settings = useProfileStore((state) => state.settings);
  const [error, setError] = useState<string | null>(null);

  const updateSetting = async (key: keyof UserSettings, value: boolean | string) => {
    if (!settings) return;
    const previous = settings;
    useProfileStore.getState().setSettings({ ...settings, [key]: value });
    setError(null);
    try {
      const updated = await updateSettings({ [key]: value });
      useProfileStore.getState().setSettings(updated);
    } catch (err: unknown) {
      useProfileStore.getState().setSettings(previous);
      setError(err instanceof Error ? err.message : 'Failed to update setting');
    }
  };

  return { settings, isLoading: false, error, updateSetting };
}
