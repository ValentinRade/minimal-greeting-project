
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { languageToLocaleCode } from '@/i18n/languages';

type LanguageContextType = {
  changeLanguage: (language: string) => Promise<void>;
  currentLanguage: string | null;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  userId?: string | null;
  userLanguage?: string | null;
}

export const LanguageProvider = ({ 
  children, 
  userId = null, 
  userLanguage = null 
}: LanguageProviderProps) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(
    userLanguage || localStorage.getItem('userLanguage') || 'Deutsch'
  );

  useEffect(() => {
    // If user profile language is available, use it
    if (userLanguage) {
      const localeCode = languageToLocaleCode(userLanguage);
      i18n.changeLanguage(localeCode);
      localStorage.setItem('userLanguage', userLanguage);
      setCurrentLanguage(userLanguage);
    } else {
      // Fallback to stored language or default
      const storedLanguage = localStorage.getItem('userLanguage') || 'Deutsch';
      const localeCode = languageToLocaleCode(storedLanguage);
      i18n.changeLanguage(localeCode);
      setCurrentLanguage(storedLanguage);
    }
  }, [userLanguage, i18n]);

  const changeLanguage = async (language: string) => {
    // Update user profile if logged in
    if (userId) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ language })
          .eq('id', userId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating language:', error);
      }
    }

    // Update local storage and i18n language
    localStorage.setItem('userLanguage', language);
    const localeCode = languageToLocaleCode(language);
    i18n.changeLanguage(localeCode);
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ changeLanguage, currentLanguage }}>
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
