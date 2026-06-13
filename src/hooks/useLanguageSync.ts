import i18n from '@/src/i18n';
import { useProfileStore } from '@/src/store/profile.store';
import { useEffect } from 'react';

export function useLanguageSync() {
  const language = useProfileStore((s) => s.settings?.language);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
}