
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { code: "de", name: "Deutsch", nativeName: "Deutsch" },
  { code: "en", name: "Englisch", nativeName: "English" },
  { code: "es", name: "Spanisch", nativeName: "Español" },
  { code: "fr", name: "Französisch", nativeName: "Français" },
  { code: "it", name: "Italienisch", nativeName: "Italiano" },
  { code: "pl", name: "Polnisch", nativeName: "Polski" },
  { code: "ro", name: "Rumänisch", nativeName: "Română" },
  { code: "bg", name: "Bulgarisch", nativeName: "Български" },
  { code: "tr", name: "Türkisch", nativeName: "Türkçe" },
  { code: "ar", name: "Arabisch", nativeName: "العربية" }
];

export const getLanguageByCode = (code: string): LanguageOption => {
  return languages.find(lang => lang.code === code) || languages[0];
};

export const languageCodeToName = (code: string): string => {
  const language = getLanguageByCode(code);
  return language ? language.name : "Deutsch";
};

export const languageToLocaleCode = (languageName: string): string => {
  const language = languages.find(lang => lang.name === languageName);
  return language ? language.code : "de";
};
