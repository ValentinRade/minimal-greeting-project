
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { languageToLocaleCode } from '@/i18n/languages';

type LanguageContextType = {
  changeLanguage: (language: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (profile?.language) {
      const localeCode = languageToLocaleCode(profile.language);
      i18n.changeLanguage(localeCode);
      localStorage.setItem('userLanguage', profile.language);
    }
  }, [profile, i18n]);

  const changeLanguage = async (language: string) => {
    if (user) {
      try {
        // Update language in profile
        const { error } = await supabase
          .from('profiles')
          .update({ language })
          .eq('id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating language:', error);
      }
    }

    // Update local storage and i18n language
    localStorage.setItem('userLanguage', language);
    const localeCode = languageToLocaleCode(language);
    i18n.changeLanguage(localeCode);
  };

  return (
    <LanguageContext.Provider value={{ changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
