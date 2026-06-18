import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DICTIONARY } from './utils/locale';

// Convert the existing dictionary into i18next resources format
const resources = {
  en: { translation: {} as Record<string, string> },
  hi: { translation: {} as Record<string, string> },
  ur: { translation: {} as Record<string, string> }
};

Object.keys(DICTIONARY).forEach((key) => {
  resources.en.translation[key] = DICTIONARY[key].en;
  resources.hi.translation[key] = DICTIONARY[key].hi;
  resources.ur.translation[key] = DICTIONARY[key].ur;
});

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('sxc_portal_lang') || 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
