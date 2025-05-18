
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
