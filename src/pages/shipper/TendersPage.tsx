
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Calendar, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateTenderForm from '@/components/tenders/CreateTenderForm';
import { TenderDetails } from '@/types/tender';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { de } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

// Mock tender data
const mockTenders: TenderDetails[] = [
  {
    id: "tender-001",
    title: "Lieferung von Pharmazeutischen Produkten",
    description: "Regelmäßige Lieferungen von Pharmazeutika an 12 Standorte in Bayern mit Temperaturkontrolle.",
    tenderType: 'transport_route',
    showContactInfo: true,
    prequalifications: ["GDP-Zertifizierung", "Temperaturgeführte Fahrzeuge"],
    duration: {
      value: "6",
      unit: "months"
    },
    commercialCalculation: 'yes',
    serviceProviderOption: 'single_provider',
    inviteServiceProviders: {
      email: "medsupply@example.com",
      confirmed: true
    },
    contractorPreferences: {
      experience: 'more_than_2_years',
      fleetSize: '3_or_more_vehicles',
      vehicleAge: 'less_than_1_year',
      regionality: 'local',
      industryExperience: 'yes',
      flexibility: '1_week'
    },
    createdAt: "2025-05-01T10:30:00Z",
    status: 'active',
    toursCount: 8
  },
  {
    id: "tender-002",
    title: "Frische Lebensmittel für Einzelhandel",
    description: "Tägliche Lieferung von frischen Lebensmitteln an Supermarktfilialen in Berlin und Brandenburg.",
    tenderType: 'fixed_area',
    showContactInfo: true,
    prequalifications: ["HACCP-Zertifizierung", "Kühlfahrzeuge"],
    duration: {
      value: "12",
      unit: "months"
    },
    commercialCalculation: 'yes',
    serviceProviderOption: 'single_provider',
    inviteServiceProviders: {
      email: "",
      confirmed: false
    },
    contractorPreferences: {
      experience: 'more_than_1_year',
      fleetSize: '3_or_more_vehicles',
      vehicleAge: 'less_than_1_year',
      regionality: 'local',
      industryExperience: 'yes',
      flexibility: '1_day'
    },
    createdAt: "2025-04-15T09:15:00Z",
    status: 'active',
    toursCount: 24
  },
  {
    id: "tender-003",
    title: "Automobil-Zuliefererlogistik",
    description: "Just-in-time Lieferung von Automobilkomponenten zum BMW-Werk München.",
    tenderType: 'transport_route',
    showContactInfo: false,
    prequalifications: ["VDA 6.2", "ISO 9001"],
    duration: {
      value: "24",
      unit: "months"
    },
    commercialCalculation: 'yes',
    serviceProviderOption: 'own_fleet',
    inviteServiceProviders: {
      email: "autoparts@example.com",
      confirmed: false
    },
    contractorPreferences: {
      experience: 'more_than_3_years',
      fleetSize: '3_or_more_vehicles',
      vehicleAge: 'less_than_1_year',
      regionality: 'local',
      industryExperience: 'yes',
      flexibility: '1_day'
    },
    createdAt: "2025-03-28T14:45:00Z",
    status: 'draft',
    toursCount: 0
  },
  {
    id: "tender-004",
    title: "E-Commerce Paketlieferungen",
    description: "Zustellung von Online-Bestellungen im Raum Hamburg und Umgebung.",
    tenderType: 'fixed_area',
    showContactInfo: true,
    prequalifications: [],
    duration: {
      value: "3",
      unit: "months"
    },
    commercialCalculation: 'no',
    serviceProviderOption: 'single_provider',
    inviteServiceProviders: {
      email: "",
      confirmed: false
    },
    contractorPreferences: {
      experience: 'less_than_1_year',
      fleetSize: 'less_than_3_vehicles',
      vehicleAge: 'more_than_1_year',
      regionality: 'local',
      industryExperience: 'no',
      flexibility: '1_week'
    },
    createdAt: "2025-05-07T08:20:00Z",
    status: 'active',
    toursCount: 6
  },
  {
    id: "tender-005",
    title: "Schwertransport für Windkraftanlagen",
    description: "Transport von Windkraftanlagenkomponenten von Hamburg nach Bayern.",
    tenderType: 'transport_route',
    showContactInfo: true,
    prequalifications: ["Schwertransportgenehmigung", "Erfahrung mit Sondertransporten"],
    duration: {
      value: "2",
      unit: "months"
    },
    commercialCalculation: 'yes',
    serviceProviderOption: 'single_provider',
    inviteServiceProviders: {
      email: "heavyhaul@example.com",
      confirmed: true
    },
    contractorPreferences: {
      experience: 'more_than_3_years',
      fleetSize: '3_or_more_vehicles',
      vehicleAge: 'more_than_1_year',
      regionality: 'international',
      industryExperience: 'yes',
      flexibility: 'more_than_1_month'
    },
    createdAt: "2025-04-02T11:00:00Z",
    status: 'awarded',
    toursCount: 4
  },
  {
    id: "tender-006",
    title: "Gefahrguttransporte für Chemieunternehmen",
    description: "Transport von ADR-pflichtigen Chemikalien zwischen drei Produktionsstandorten.",
    tenderType: 'transport_route',
    showContactInfo: false,
    prequalifications: ["ADR-Zertifizierung", "SQAS"],
    duration: {
      value: "18",
      unit: "months"
    },
    commercialCalculation: 'yes',
    serviceProviderOption: 'single_provider',
    inviteServiceProviders: {
      email: "",
      confirmed: false
    },
    contractorPreferences: {
      experience: 'more_than_3_years',
      fleetSize: '3_or_more_vehicles',
      vehicleAge: 'less_than_1_year',
      regionality: 'international',
      industryExperience: 'yes',
      flexibility: '1_week'
    },
    createdAt: "2025-03-10T16:30:00Z",
    status: 'closed',
    toursCount: 0
  }
];

const TendersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [tenders, setTenders] = useState<TenderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle resize to determine if mobile view should be used
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check if we should open create form based on location state
  React.useEffect(() => {
    if (location.state?.createNew) {
      setIsCreateFormOpen(true);
      // Clear the state so it doesn't open again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Load tenders on mount
  useEffect(() => {
    loadTenders();
  }, []);
  
  const loadTenders = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would call the API
      // const loadedTenders = await getTenders();
      
      // For now, use mock data
      setTimeout(() => {
        setTenders(mockTenders);
        setIsLoading(false);
      }, 500); // Add a small delay to simulate API call
    } catch (error) {
      console.error("Error loading tenders:", error);
      toast({
        title: "Fehler beim Laden der Ausschreibungen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const handleTenderCreated = () => {
    setIsCreateFormOpen(false);
    loadTenders();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Aktiv</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500">Entwurf</Badge>;
      case 'closed':
        return <Badge className="bg-red-500">Geschlossen</Badge>;
      case 'awarded':
        return <Badge className="bg-blue-500">Vergeben</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: de });
    } catch (error) {
      return 'Ungültiges Datum';
    }
  };

  const handleToursClick = () => {
    navigate('/dashboard/shipper/tours');
  };

  const handleDeleteTender = (id: string) => {
    setTenders((prev) => prev.filter((tender) => tender.id !== id));
    toast({
      title: "Ausschreibung gelöscht",
      description: "Die Ausschreibung wurde erfolgreich gelöscht."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ausschreibungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Transport-Ausschreibungen.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToursClick} className="gap-2">
            <Calendar className="h-4 w-4" />
            Touren verwalten
          </Button>

          {isMobileView ? (
            <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Neue Ausschreibung
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] sm:h-[90vh] w-full overflow-y-auto">
                <SheetHeader className="text-left">
                  <SheetTitle>Neue Ausschreibung erstellen</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <CreateTenderForm onTenderCreated={handleTenderCreated} />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
              <Button onClick={() => setIsCreateFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Neue Ausschreibung
              </Button>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Neue Ausschreibung erstellen</DialogTitle>
                </DialogHeader>
                <CreateTenderForm onTenderCreated={handleTenderCreated} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ausschreibungen</CardTitle>
          <CardDescription>
            Hier können Sie neue Ausschreibungen erstellen und bestehende verwalten.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : tenders.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg">
              Keine Ausschreibungen vorhanden. Klicken Sie auf "Neue Ausschreibung", um zu beginnen.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titel</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erstellt am</TableHead>
                    <TableHead>Touren</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenders.map((tender) => (
                    <TableRow key={tender.id}>
                      <TableCell className="font-medium">{tender.title}</TableCell>
                      <TableCell>
                        {tender.tenderType === 'transport_route' ? 'Transportstrecke' : 'Festes Einsatzgebiet'}
                      </TableCell>
                      <TableCell>{getStatusBadge(tender.status)}</TableCell>
                      <TableCell>{formatDate(tender.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {tender.toursCount}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={handleToursClick}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ausschreibung löschen</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Möchten Sie diese Ausschreibung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteTender(tender.id)}
                                >
                                  Löschen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TendersPage;
