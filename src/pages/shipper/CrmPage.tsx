
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CrmPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Kunden- und Geschäftsbeziehungen.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Kundenkontakte</CardTitle>
              <CardDescription>
                Sehen und verwalten Sie alle Kundenkontakte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Hier werden Ihre Kundenkontakte angezeigt.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Kommunikation</CardTitle>
              <CardDescription>
                Verfolgen Sie Kommunikation mit Ihren Kunden.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Kommunikationshistorie mit Ihren Kunden.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Projekte</CardTitle>
              <CardDescription>
                Übersicht über alle kundenspezifischen Projekte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Projektmanagement und Projektübersicht.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CrmPage;
