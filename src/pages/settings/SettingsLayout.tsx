
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import SettingsSidebar from './SettingsSidebar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import SettingsIndex from './SettingsIndex';

const SettingsLayout = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const location = useLocation();
  
  // Check if we're on the main settings page
  const isMainSettingsPage = location.pathname === '/dashboard/shipper/settings' || 
                             location.pathname === '/dashboard/subcontractor/settings' || 
                             location.pathname === '/dashboard/shipper/settings/' || 
                             location.pathname === '/dashboard/subcontractor/settings/';
  
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row w-full">
        <SettingsSidebar />
        <div className="flex-1 p-6">
          {isMainSettingsPage ? (
            <SettingsIndex />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsLayout;
