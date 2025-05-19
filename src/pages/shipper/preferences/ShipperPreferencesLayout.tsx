
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const ShipperPreferencesLayout: React.FC = () => {
  return (
    <AppLayout>
      <div className="container py-6">
        <Outlet />
      </div>
    </AppLayout>
  );
};

export default ShipperPreferencesLayout;
