
import React from 'react';
import { useTranslation } from 'react-i18next';
import PreferencesForm from '@/components/preferences/PreferencesForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PreferencesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('preferences.formTitle', 'Unternehmens-Präferenzen')}</CardTitle>
          <CardDescription>
            {t('preferences.formDescription', 'Bitte teilen Sie Ihre Präferenzen mit uns, damit wir Ihnen passende Aufträge vermitteln können.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PreferencesForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesPage;
