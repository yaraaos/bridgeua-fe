import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settings.service';
import type { UserSettings } from '../types/settings.types';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load settings');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const updateSetting = async (key: keyof UserSettings, value: boolean | string) => {
    if (!settings) return;
    const previous = settings;
    setSettings({ ...settings, [key]: value });
    setError(null);
    try {
      const updated = await updateSettings({ [key]: value });
      setSettings(updated);
    } catch (err: unknown) {
      setSettings(previous);
      setError(err instanceof Error ? err.message : 'Failed to update setting');
    }
  };

  return { settings, isLoading, error, updateSetting };
}
