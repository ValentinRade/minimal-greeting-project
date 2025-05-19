import React, { useEffect, useState, useRef } from 'react';
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
  const checkedRef = useRef(false);
  const loggedRef = useRef(false);
  
  // Exclude certain paths from protection - calculate these variables outside of any conditionals
  const isRegisterInvitedRoute = location.pathname === '/register-invited';
  const isAuthRoute = location.pathname === '/auth';
  const isCreateCompanyRoute = location.pathname === '/create-company';
  
  // Debug logging nur einmal pro Mount und Route-Änderung
  useEffect(() => {
    // Nur loggen, wenn wir bereit sind und noch nicht für diesen Pfad geloggt haben
    if (isReady && !loggedRef.current) {
      console.log("Protected Route Check:", {
        hasCompany,
        requireCompany,
        pathname: location.pathname,
        isReady
      });
      loggedRef.current = true;
    }
    
    // Logging-Flag zurücksetzen, wenn sich der Pfad ändert
    return () => {
      loggedRef.current = false;
    };
  }, [location.pathname]);
  
  // Wait for authentication and company data to be fully loaded
  useEffect(() => {
    if (!authLoading && !checkedRef.current) {
      checkedRef.current = true;
      // Set a small timeout to ensure company data is fully loaded
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100); // Reduced timeout to prevent excessive delay
      
      return () => clearTimeout(timer);
    }
  }, [authLoading]);
  
  // Render loading state if data isn't ready yet
  if (authLoading || !isReady) {
    return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
  }
  
  // Skip checks for specific routes
  if (isRegisterInvitedRoute || isAuthRoute) {
    return <>{children}</>;
  }
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // Handle redirect to create-company page
  if (requireCompany && !hasCompany && !isCreateCompanyRoute) {
    console.log("No company found for user, redirecting to create company");
    return <Navigate to="/create-company" />;
  }
  
  // Handle redirect to dashboard when on root path
  if (hasCompany && company && location.pathname === '/') {
    // Company type 2 is for Shipper (Versender)
    // Company type 1 is for Subcontractor (Subunternehmer)
    if (company.company_type_id === 2) {
      return <Navigate to="/dashboard/shipper" />;
    } else if (company.company_type_id === 1) {
      return <Navigate to="/dashboard/subcontractor" />;
    }
  }
  
  // Handle redirect to appropriate homepage if on create-company but already has company
  if (hasCompany && isCreateCompanyRoute) {
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
