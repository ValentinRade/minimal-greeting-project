
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface PreferencesData {
  id: string;
  preferred_tour_types: string[];
  expectations_from_shipper: string;
  flexibility: string;
  specialization: string;
  frequent_routes: string[];
  client_types: string[];
  order_preference: string;
  problem_handling: string;
}

const PreferencesOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { company } = useAuth();
  
  const fetchPreferences = async (): Promise<PreferencesData | null> => {
    if (!company?.id) return null;
    
    const { data, error } = await supabase
      .from('subcontractor_preferences')
      .select('*')
      .eq('company_id', company.id)
      .single();
      
    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }
    
    return data as PreferencesData;
  };
  
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['preferences', company?.id],
    queryFn: fetchPreferences,
    enabled: !!company?.id
  });

  const handleEdit = () => {
    navigate('/dashboard/subcontractor/preferences');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard.preferences', 'Präferenzen')}</h1>
        <Button onClick={handleEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          {t('common.edit', 'Bearbeiten')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('preferences.overview', 'Übersicht der Präferenzen')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{t('common.loading', 'Wird geladen...')}</p>
          ) : !preferences ? (
            <p>{t('preferences.noData', 'Keine Präferenzen gefunden. Klicken Sie auf "Bearbeiten", um Präferenzen anzugeben.')}</p>
          ) : (
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="w-1/3">{t('preferences.tourTypes', 'Bevorzugte Tourarten')}</TableHead>
                  <TableCell>{preferences.preferred_tour_types.join(', ') || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{t('preferences.expectations', 'Erwartungen an den Versender')}</TableHead>
                  <TableCell>{preferences.expectations_from_shipper || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{t('preferences.flexibility', 'Flexibilität')}</TableHead>
                  <TableCell>{preferences.flexibility || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{t('preferences.specialization', 'Spezialisierung')}</TableHead>
                  <TableCell>{preferences.specialization || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{t('preferences.frequentRoutes', 'Häufige Strecken')}</TableHead>
                  <TableCell>{preferences.frequent_routes.join(', ') || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{t('preferences.clientTypes', 'Kundentypen')}</TableHead>
                  <TableCell>{preferences.client_types.join(', ') || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{t('preferences.orderPreference', 'Auftragsvorlieben')}</TableHead>
                  <TableCell>{preferences.order_preference || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>{t('preferences.problemHandling', 'Problembehandlung')}</TableHead>
                  <TableCell>{preferences.problem_handling || '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesOverview;
