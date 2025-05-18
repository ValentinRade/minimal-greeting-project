
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/i18n/languages';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  currentLanguage: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className, currentLanguage }) => {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();

  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('profile.selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.name}>
              {lang.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
