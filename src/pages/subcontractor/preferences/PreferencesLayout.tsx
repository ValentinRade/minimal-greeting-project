
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useTranslation } from 'react-i18next';

const PreferencesLayout = () => {
  const { t } = useTranslation();
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('preferences.title', 'Präferenzen')}</h1>
        <Outlet />
      </div>
    </AppLayout>
  );
};

export default PreferencesLayout;
