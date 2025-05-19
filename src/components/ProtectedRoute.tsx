import React, { useEffect, useRef } from 'react';
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
  const routeCheckedRef = useRef(false);
  
  // Exclude certain paths from protection - calculate these variables outside of any conditionals
  const isRegisterInvitedRoute = location.pathname === '/register-invited';
  const isAuthRoute = location.pathname === '/auth';
  const isCreateCompanyRoute = location.pathname === '/create-company';
  
  // Only log in development mode and only once per path
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !routeCheckedRef.current && !authLoading) {
      routeCheckedRef.current = true;
      // Logging nur für Entwicklungszwecke
      if (requireCompany && !isRegisterInvitedRoute && !isAuthRoute) {
        console.debug("Protected Route Check:", {
          hasCompany,
          requireCompany,
          pathname: location.pathname,
        });
      }
    }
    
    return () => {
      routeCheckedRef.current = false;
    };
  }, [location.pathname, authLoading, hasCompany, requireCompany]);
  
  // Skip checks for specific routes that don't need auth
  if (isRegisterInvitedRoute || isAuthRoute) {
    return <>{children}</>;
  }
  
  // Show loading state while auth is being checked
  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t('common.loading')}</div>;
  }
  
  // User not authenticated - redirect to auth
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // Handle company requirement
  if (requireCompany && !hasCompany && !isCreateCompanyRoute) {
    return <Navigate to="/create-company" />;
  }
  
  // Handle root path redirects based on company type
  if (location.pathname === '/' && hasCompany && company) {
    const companyTypeId = company.company_type_id;
    
    if (companyTypeId === 2) {
      return <Navigate to="/dashboard/shipper" />;
    } 
    
    if (companyTypeId === 1) {
      return <Navigate to="/dashboard/subcontractor" />;
    }
  }
  
  // Handle redirect from create-company when already has company
  if (hasCompany && isCreateCompanyRoute) {
    const companyTypeId = company?.company_type_id;
    
    if (companyTypeId === 2) {
      return <Navigate to="/dashboard/shipper" />;
    } 
    
    if (companyTypeId === 1) {
      return <Navigate to="/dashboard/subcontractor" />;
    }
    
    return <Navigate to="/" />;
  }
  
  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
