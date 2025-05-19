
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/layout/AppLayout';
import PublicProfileSettings from '@/components/public-profile/PublicProfileSettings';
import { Separator } from '@/components/ui/separator';
import { Globe } from 'lucide-react';

const PublicProfilePage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <AppLayout>
      <div className="container max-w-4xl py-6">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-3xl font-bold">{t('publicProfile.title')}</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          {t('publicProfile.pageDescription')}
        </p>
        
        <Separator className="my-6" />
        
        <PublicProfileSettings />
      </div>
    </AppLayout>
  );
};

export default PublicProfilePage;
