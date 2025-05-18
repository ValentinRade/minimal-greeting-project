
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompany?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireCompany = true }) => {
  const { user, loading: authLoading, hasCompany, company } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  
  // Exclude certain paths from protection
  const isRegisterInvitedRoute = location.pathname === '/register-invited';
  
  // Wait for authentication and company data to be fully loaded
  useEffect(() => {
    if (!authLoading) {
      // Set a small timeout to ensure company data is fully loaded
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [authLoading]);
  
  // Skip checks for registration via invitation routes
  if (isRegisterInvitedRoute) {
    return <>{children}</>;
  }
  
  // Show loading state until both auth and company data are ready
  if (authLoading || !isReady) {
    return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
  }
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // Only check company requirements when we're sure auth and company data are fully loaded
  if (isReady && requireCompany && !hasCompany && location.pathname !== '/create-company') {
    return <Navigate to="/create-company" />;
  }

  // Only redirect to dashboard when we're sure company data is fully loaded
  if (isReady && hasCompany && company && 
      location.pathname !== '/dashboard/shipper' && 
      location.pathname !== '/dashboard/subcontractor' && 
      !location.pathname.includes('/settings') &&
      location.pathname !== '/create-company') {
    
    // Company type 2 is for Shipper (Versender)
    // Company type 1 is for Subcontractor (Subunternehmer)
    if (company.company_type_id === 2) {
      return <Navigate to="/dashboard/shipper" />;
    } else if (company.company_type_id === 1) {
      return <Navigate to="/dashboard/subcontractor" />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
