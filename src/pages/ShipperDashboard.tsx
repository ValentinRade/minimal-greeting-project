
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { FileText, Truck, Plus, MessageSquare, Route } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTenders } from '@/services/tenderService';
import { supabase } from '@/integrations/supabase/client';
import { Metric } from '@/components/ui/metric';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    sender: 'Müller Transport GmbH',
    avatar: 'MT',
    message: 'Wir haben Interesse an der Ausschreibung #A-2023-42 und möchten ein Angebot einreichen.',
    date: '2025-05-19T14:30:00',
    read: false,
  },
  {
    id: 2,
    sender: 'Schmidt Logistik',
    avatar: 'SL',
    message: 'Die Dokumente für die Spotladung #SL-564 wurden hochgeladen und warten auf Ihre Überprüfung.',
    date: '2025-05-18T09:15:00',
    read: true,
  },
  {
    id: 3,
    sender: 'Wagner Spedition',
    avatar: 'WS',
    message: 'Können Sie die Lieferzeit für den Transport nach München anpassen? Wir hätten einen LKW verfügbar.',
    date: '2025-05-17T16:45:00',
    read: true,
  },
];

// Mock data for spot loads
const mockSpotLoads = [
  { id: 1, origin: 'Hamburg', destination: 'München', date: '2025-05-22', status: 'Offen' },
  { id: 2, origin: 'Berlin', destination: 'Köln', date: '2025-05-23', status: 'Vergeben' },
  { id: 3, origin: 'Frankfurt', destination: 'Stuttgart', date: '2025-05-25', status: 'Offen' },
  { id: 4, origin: 'Dresden', destination: 'Nürnberg', date: '2025-05-24', status: 'Offen' },
  { id: 5, origin: 'Hannover', destination: 'Leipzig', date: '2025-05-26', status: 'Vergeben' },
  { id: 6, origin: 'Düsseldorf', destination: 'Bremen', date: '2025-05-27', status: 'Offen' },
];

const ShipperDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Query to fetch tenders count - replaced with mock data
  const { isLoading: isLoadingTenders } = useQuery({
    queryKey: ['tenders'],
    queryFn: getTenders,
    enabled: false, // Disable the actual API call since we're using mock data
  });

  // Query to fetch subcontractors count - replaced with mock data
  const { isLoading: isLoadingSubcontractors } = useQuery({
    queryKey: ['subcontractorsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('company_type_id', 1); // 1 is for subcontractors
      
      if (error) throw error;
      return count || 0;
    },
    enabled: false, // Disable the actual API call since we're using mock data
  });

  // Mock data for tenders and subcontractors
  const mockTendersCount = 35;
  const mockSubcontractorsCount = 2247;

  const handleCreateTender = () => {
    navigate('/dashboard/shipper/tenders', { state: { createNew: true } });
  };
  
  const handleSpotLoads = () => {
    navigate('/dashboard/shipper/spot-loads');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date.toDateString() === today.toDateString()) {
      return `Heute, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return `Gestern, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Willkommen im Verlader-Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Heute ist der {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern bg-gradient-primary border-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold text-white">Ausschreibungen</CardTitle>
              <FileText className="h-5 w-5 text-white/70" />
            </CardHeader>
            <CardContent>
              <Metric 
                title="Aktive Ausschreibungen"
                value={isLoadingTenders ? '...' : mockTendersCount}
                isLoading={isLoadingTenders}
                className="text-white"
              />
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">Spot-Ladungen</CardTitle>
              <Route className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Metric 
                title="Verfügbare Spot-Ladungen"
                value={mockSpotLoads.filter(load => load.status === 'Offen').length}
                className="text-primary"
              />
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">Subunternehmer</CardTitle>
              <Truck className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Metric 
                title="Registrierte Subunternehmer"
                value={isLoadingSubcontractors ? '...' : mockSubcontractorsCount.toLocaleString('de-DE')}
                isLoading={isLoadingSubcontractors}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Schnellzugriff</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreateTender} className="gap-2">
              <Plus className="h-4 w-4" />
              Neue Ausschreibung erstellen
            </Button>
            
            <Button onClick={handleSpotLoads} variant="outline" className="gap-2">
              <Route className="h-4 w-4" />
              Spot-Ladungen verwalten
            </Button>
          </div>
        </div>
        
        {/* Messages Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nachrichten</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Alle Nachrichten anzeigen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex items-start p-3 rounded-lg ${message.read ? 'bg-background' : 'bg-muted'}`}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`/avatars/${message.id}.png`} alt={message.sender} />
                      <AvatarFallback>{message.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{message.sender}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(message.date)}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    {!message.read && (
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShipperDashboard;
