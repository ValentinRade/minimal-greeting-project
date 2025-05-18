
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import SettingsSidebar from './SettingsSidebar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

const SettingsLayout = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to the profile settings page if the user navigates to /settings directly
  useEffect(() => {
    const basePath = company?.company_type_id === 2 
      ? '/dashboard/shipper/settings' 
      : '/dashboard/subcontractor/settings';
      
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate(`${basePath}/profile`, { replace: true });
    }
  }, [location.pathname, company, navigate]);
  
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
