
// Map language codes to user-friendly names
export const languagesToUserFriendly: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pl: 'Polski',
  ro: 'Română',
  bg: 'Български',
  tr: 'Türkçe',
  ar: 'العربية'
};

// Map user-friendly names to language codes
export const userFriendlyToLanguages: Record<string, string> = {
  Deutsch: 'de',
  English: 'en',
  Español: 'es',
  Français: 'fr',
  Italiano: 'it',
  Polski: 'pl',
  Română: 'ro',
  Български: 'bg',
  Türkçe: 'tr',
  العربية: 'ar'
};

// Define the language structure for components to use
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Create the languages array that multiple components are trying to import
export const languages: Language[] = [
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'fr', name: 'Français', nativeName: 'Français' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano' },
  { code: 'pl', name: 'Polski', nativeName: 'Polski' },
  { code: 'ro', name: 'Română', nativeName: 'Română' },
  { code: 'bg', name: 'Български', nativeName: 'Български' },
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe' },
  { code: 'ar', name: 'العربية', nativeName: 'العربية' }
];

// Convert from language name to locale code
export const languageToLocaleCode = (language: string): string => {
  return userFriendlyToLanguages[language] || 'de';
};

// Convert from locale code to language name
export const localeCodeToLanguage = (code: string): string => {
  return languagesToUserFriendly[code] || 'Deutsch';
};

// Get all available languages as options
export const getAllLanguages = () => {
  return Object.keys(languagesToUserFriendly).map(code => ({
    value: code,
    label: languagesToUserFriendly[code]
  }));
};
