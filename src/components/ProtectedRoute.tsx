
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
  
  // Überprüfen, ob der Benutzer authentifiziert ist
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // Überprüfen, ob die Unternehmensregistrierung erforderlich ist
  if (requireCompany && !hasCompany && location.pathname !== '/create-company') {
    return <Navigate to="/create-company" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
