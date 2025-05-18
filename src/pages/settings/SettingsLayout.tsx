
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import SettingsSidebar from './SettingsSidebar';
import { useTranslation } from 'react-i18next';

const SettingsLayout = () => {
  const { t } = useTranslation();
  
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row w-full">
        <SettingsSidebar />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsLayout;
