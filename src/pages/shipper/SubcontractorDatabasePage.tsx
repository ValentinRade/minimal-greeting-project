
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SubcontractorDatabasePage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subunternehmerdatenbank</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Subunternehmer und deren Informationen.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default SubcontractorDatabasePage;
