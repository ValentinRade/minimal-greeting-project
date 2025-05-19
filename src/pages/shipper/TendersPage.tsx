
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TendersPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ausschreibungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Transport-Ausschreibungen.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neue Ausschreibung
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ausschreibungen</CardTitle>
          <CardDescription>
            Hier können Sie neue Ausschreibungen erstellen und bestehende verwalten.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg">
            Keine Ausschreibungen vorhanden. Klicken Sie auf "Neue Ausschreibung", um zu beginnen.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TendersPage;
