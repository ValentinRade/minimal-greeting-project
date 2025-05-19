
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ShipperHeader from './ShipperHeader';
import SubcontractorHeader from './SubcontractorHeader';
import ShipperSidebar from './ShipperSidebar';
import SubcontractorSidebar from './SubcontractorSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { company } = useAuth();
  const { t } = useTranslation();
  
  // Determine if user is a shipper (company type 2) or subcontractor (company type 1)
  const isShipper = company?.company_type_id === 2;
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        {isShipper ? <ShipperSidebar /> : <SubcontractorSidebar />}
        
        <div className="flex flex-col flex-1">
          {isShipper ? <ShipperHeader /> : <SubcontractorHeader />}
          
          <main className="flex-1 p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
