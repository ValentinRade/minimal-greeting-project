
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n/languages';

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const { changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{t('profile.welcome', { name: profile?.first_name || 'User' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile && (
            <div className="space-y-2">
              <p><strong>{t('profile.name')}:</strong> {profile.first_name} {profile.last_name}</p>
              <p><strong>{t('profile.email')}:</strong> {user?.email}</p>
              <p><strong>{t('profile.phone')}:</strong> {profile.phone}</p>
              <div className="flex flex-col space-y-2">
                <p><strong>{t('profile.language')}:</strong></p>
                <Select
                  value={profile.language}
                  onValueChange={(value) => changeLanguage(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
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
            </div>
          )}
          <Button 
            onClick={signOut} 
            variant="outline"
            className="w-full"
          >
            {t('profile.logOut')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
