
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Calendar, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateTenderForm from '@/components/tenders/CreateTenderForm';
import { getTenders, deleteTender } from '@/services/tenderService';
import { TenderDetails } from '@/types/tender';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { de } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const TendersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: isAuthLoading } = useAuth();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [tenders, setTenders] = useState<TenderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Handle resize to determine if mobile view should be used
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load tenders on mount and when user changes
  useEffect(() => {
    if (!isAuthLoading && user) {
      loadTenders();
    }
  }, [user, isAuthLoading]);
  
  const loadTenders = async () => {
    setIsLoading(true);
    try {
      const loadedTenders = await getTenders();
      setTenders(loadedTenders);
    } catch (error) {
      console.error("Error loading tenders:", error);
      toast({
        title: "Fehler beim Laden der Ausschreibungen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTenderCreated = () => {
    setIsCreateFormOpen(false);
    loadTenders();
    toast({
      title: "Ausschreibung erstellt",
      description: "Ihre Ausschreibung wurde erfolgreich erstellt",
      variant: "default"
    });
  };

  const handleDeleteTender = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteTender(id);
      setTenders(tenders.filter(tender => tender.id !== id));
      toast({
        title: "Ausschreibung gelöscht",
        description: "Die Ausschreibung wurde erfolgreich gelöscht",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Fehler beim Löschen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
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

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

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
                                  onClick={() => handleDeleteTender(tender.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                  disabled={isDeleting === tender.id}
                                >
                                  {isDeleting === tender.id ? 'Wird gelöscht...' : 'Löschen'}
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
