
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateTenderForm from '@/components/tenders/CreateTenderForm';

const TendersPage: React.FC = () => {
  const { t } = useTranslation();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle resize to determine if mobile view should be used
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ausschreibungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Transport-Ausschreibungen.
          </p>
        </div>
        
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
                <CreateTenderForm />
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
              <CreateTenderForm />
            </DialogContent>
          </Dialog>
        )}
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
