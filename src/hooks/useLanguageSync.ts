import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * This hook synchronizes language changes across all pages
 * When the language is changed in App.tsx, all components receive notification
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      // Trigger re-render by forcing i18n state update
      const currentLang = localStorage.getItem('sxc_portal_lang');
      if (currentLang && currentLang !== i18n.language) {
        i18n.changeLanguage(currentLang);
      }
    };

    // Listen to language change event
    window.addEventListener('sxc_portal_lang_changed', handleLanguageChange);

    return () => {
      window.removeEventListener('sxc_portal_lang_changed', handleLanguageChange);
    };
  }, [i18n]);
}
