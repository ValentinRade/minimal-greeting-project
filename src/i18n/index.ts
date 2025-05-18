
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { languageToLocaleCode } from './languages';

// Import all translations
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import ro from './locales/ro.json';
import bg from './locales/bg.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';

const resources = {
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  it: { translation: it },
  pl: { translation: pl },
  ro: { translation: ro },
  bg: { translation: bg },
  tr: { translation: tr },
  ar: { translation: ar }
};

// Try to get user language from local storage or profile if signed in
const getUserLanguage = (): string => {
  try {
    const storedLanguage = localStorage.getItem('userLanguage');
    if (storedLanguage) {
      return languageToLocaleCode(storedLanguage);
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
  
  return 'de'; // Default to German
};

i18n
  .use(LanguageDetector) // Add language detector (optional)
  .use(initReactI18next)
  .init({
    resources,
    lng: getUserLanguage(),
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    react: {
      useSuspense: false, // Prevents issues during SSR or when translations are loading
    },
  });

export default i18n;
