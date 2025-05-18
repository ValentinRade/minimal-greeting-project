
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompany?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireCompany = true }) => {
  const { user, loading, hasCompany, company } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  
  // Checking if the user is authenticated
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // Check if company registration is required
  if (requireCompany && !hasCompany && location.pathname !== '/create-company') {
    return <Navigate to="/create-company" />;
  }

  // Redirect to appropriate dashboard based on company type
  if (hasCompany && company && location.pathname !== '/dashboard/shipper' && location.pathname !== '/dashboard/subcontractor') {
    // Company type 1 is for Shipper (Versender)
    // Company type 2 is for Subcontractor (Subunternehmer)
    if (company.company_type_id === 1) {
      return <Navigate to="/dashboard/shipper" />;
    } else if (company.company_type_id === 2) {
      return <Navigate to="/dashboard/subcontractor" />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
