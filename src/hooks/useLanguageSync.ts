import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
<<<<<<< HEAD
 * This hook synchronizes language changes across all pages
 * When the language is changed in App.tsx, all components receive notification
=======
 * यह hook सभी pages में भाषा परिवर्तन को sync करता है
 * जब भी App.tsx में भाषा बदली जाएगी, सभी components को notification मिलेगी
>>>>>>> 8292c25591705a742ce217bc0675789c2d5121d6
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
<<<<<<< HEAD
    const handleLanguageChange = () => {
      // Trigger re-render by forcing i18n state update
      const currentLang = localStorage.getItem('sxc_portal_lang');
      if (currentLang && currentLang !== i18n.language) {
        i18n.changeLanguage(currentLang);
      }
    };

    // Listen to language change event
=======
    const handleLanguageChange = (event: Event) => {
      // Event सुनो और भाषा बदलो
      i18n.changeLanguage(i18n.language);
    };

    // 'sxc_portal_lang_changed' event को सुनो
>>>>>>> 8292c25591705a742ce217bc0675789c2d5121d6
    window.addEventListener('sxc_portal_lang_changed', handleLanguageChange);

    return () => {
      window.removeEventListener('sxc_portal_lang_changed', handleLanguageChange);
    };
  }, [i18n]);
}
