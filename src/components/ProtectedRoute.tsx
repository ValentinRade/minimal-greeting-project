
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCompany?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireCompany = true }) => {
  const { user, loading, hasCompany } = useAuth();
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
  
  return <>{children}</>;
};

export default ProtectedRoute;
