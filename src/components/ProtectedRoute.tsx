
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
  const isAuthRoute = location.pathname === '/auth';
  const isCreateCompanyRoute = location.pathname === '/create-company';
  
  // Wait for authentication and company data to be fully loaded
  useEffect(() => {
    if (!authLoading) {
      // Set a small timeout to ensure company data is fully loaded
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100); // Reduced timeout to prevent excessive delay
      
      return () => clearTimeout(timer);
    }
  }, [authLoading]);
  
  // Skip checks for registration via invitation routes and auth routes
  if (isRegisterInvitedRoute || isAuthRoute) {
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
  
  // Log the current state at a reasonable level (DEBUG only, not excessive)
  console.log("Protected Route Check:", {
    hasCompany,
    requireCompany,
    pathname: location.pathname,
    isReady
  });
  
  // Handle redirect to create-company page
  if (isReady && requireCompany && !hasCompany && !isCreateCompanyRoute) {
    console.log("No company found for user, redirecting to create company");
    return <Navigate to="/create-company" />;
  }
  
  // Handle redirect to dashboard when on root path
  if (isReady && hasCompany && company && location.pathname === '/') {
    // Company type 2 is for Shipper (Versender)
    // Company type 1 is for Subcontractor (Subunternehmer)
    if (company.company_type_id === 2) {
      return <Navigate to="/dashboard/shipper" />;
    } else if (company.company_type_id === 1) {
      return <Navigate to="/dashboard/subcontractor" />;
    }
  }
  
  // Handle redirect to appropriate homepage if on create-company but already has company
  if (isReady && hasCompany && isCreateCompanyRoute) {
    if (company?.company_type_id === 2) {
      return <Navigate to="/dashboard/shipper" />;
    } else if (company?.company_type_id === 1) {
      return <Navigate to="/dashboard/subcontractor" />;
    }
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
