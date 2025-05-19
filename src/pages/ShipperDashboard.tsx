
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, FileText, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Metric } from '@/components/ui/metric';
import { getTenders } from '@/services/tenderService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const ShipperDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading, hasCompany } = useAuth();
  const [tenderCount, setTenderCount] = useState<number | null>(null);
  const [subcontractorCount, setSubcontractorCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (!hasCompany) {
        navigate('/create-company');
        return;
      }
      
      loadDashboardData();
    }
  }, [user, loading, hasCompany, navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load tender count
      const tenders = await getTenders();
      setTenderCount(tenders.length);
      
      // Load subcontractor count - Count companies with company_type_id = 1 (Subcontractor)
      const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('company_type_id', 1);
      
      if (error) {
        console.error('Error fetching subcontractor count:', error);
        setSubcontractorCount(0);
      } else {
        setSubcontractorCount(count || 0);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Fehler beim Laden der Dashboard-Daten",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTender = () => {
    navigate('/dashboard/shipper/tenders', { state: { openCreateForm: true } });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  // Simplify the rendering - we don't need additional redirect logic here
  // since the useEffect hook handles that already
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Willkommen zurück bei CARRINEX.
            </p>
          </div>
          
          <Button onClick={handleCreateTender} className="w-full md:w-auto gap-2">
            <FilePlus className="h-4 w-4" />
            Neue Ausschreibung erstellen
          </Button>
        </div>
        
        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <Metric 
                title="Ausschreibungen" 
                value={isLoading ? <span className="animate-pulse">Laden...</span> : tenderCount || 0}
                isLoading={isLoading}
                className="flex items-start gap-4"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Aktive Ausschreibungen</span>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Metric 
                title="Subunternehmer" 
                value={isLoading ? <span className="animate-pulse">Laden...</span> : subcontractorCount || 0}
                isLoading={isLoading}
                className="flex items-start gap-4"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registrierte Subunternehmer</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Message Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Nachrichten</h3>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                <p>Keine neuen Nachrichten</p>
                <Button variant="outline" size="sm" className="mt-4 gap-2">
                  Zum Postfach
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Aktuelle Aktivitäten</h3>
              </div>
              
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                <p>Keine neuen Aktivitäten</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShipperDashboard;
