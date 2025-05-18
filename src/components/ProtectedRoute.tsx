
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
