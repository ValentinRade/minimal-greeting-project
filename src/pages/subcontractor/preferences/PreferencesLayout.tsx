
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const PreferencesLayout = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </AppLayout>
  );
};

export default PreferencesLayout;
