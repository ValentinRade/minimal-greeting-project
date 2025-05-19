
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const ToursLayout: React.FC = () => {
  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <Outlet />
      </div>
    </AppLayout>
  );
};

export default ToursLayout;
