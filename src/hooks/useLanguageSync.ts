import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * यह hook सभी pages में भाषा परिवर्तन को sync करता है
 * जब भी App.tsx में भाषा बदली जाएगी, सभी components को notification मिलेगी
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      // Event सुनो और भाषा बदलो
      i18n.changeLanguage(i18n.language);
    };

    // 'sxc_portal_lang_changed' event को सुनो
    window.addEventListener('sxc_portal_lang_changed', handleLanguageChange);

    return () => {
      window.removeEventListener('sxc_portal_lang_changed', handleLanguageChange);
    };
  }, [i18n]);
}
