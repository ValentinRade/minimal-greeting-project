
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n/languages';

const Index = () => {
  const { user, profile, company, signOut } = useAuth();
  const { changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        <Card className="w-full">
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
              </div>
            )}
          </CardContent>
        </Card>

        {company && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t('companyInfo.title')}</CardTitle>
              <CardDescription>{t('companyInfo.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">{t('companyInfo.name')}</p>
                  <p>{company.name}</p>
                </div>
                <div>
                  <p className="font-semibold">{t('companyInfo.type')}</p>
                  <p>{company.company_types?.name}</p>
                </div>
                <div>
                  <p className="font-semibold">{t('companyInfo.legalForm')}</p>
                  <p>{company.company_legal_forms?.name}</p>
                </div>
                <div>
                  <p className="font-semibold">{t('companyInfo.address')}</p>
                  <p>{company.street}, {company.postal_code} {company.city}, {company.country}</p>
                </div>
                {company.vat_id && (
                  <div>
                    <p className="font-semibold">{t('companyInfo.vatId')}</p>
                    <p>{company.vat_id}</p>
                  </div>
                )}
                {company.tax_number && (
                  <div>
                    <p className="font-semibold">{t('companyInfo.taxNumber')}</p>
                    <p>{company.tax_number}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          onClick={signOut} 
          variant="outline"
          className="w-full"
        >
          {t('profile.logOut')}
        </Button>
      </div>
    </div>
  );
};

export default Index;
