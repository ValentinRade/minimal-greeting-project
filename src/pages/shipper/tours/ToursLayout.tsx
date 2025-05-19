
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const ToursLayout: React.FC = () => {
  return (
    <AppLayout>
      <div className="container py-6 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </AppLayout>
  );
};

export default ToursLayout;
