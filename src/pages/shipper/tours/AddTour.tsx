
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTours } from '@/hooks/useTours';
import { useAuth } from '@/contexts/AuthContext';
import ShipperTourForm from '@/components/shipper/tours/ShipperTourForm';
import { TourWithRelations } from '@/types/tour';
import { toast } from '@/hooks/use-toast';

const AddTour: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTour, isLoading } = useTours({
    timeframe: 'all',
    regions: [],
    vehicleType: '',
    employeeId: '',
    status: 'all',
    sortBy: 'date',
    sortDirection: 'desc',
  });

  const handleSubmit = (data: Partial<TourWithRelations>) => {
    if (user) {
      // Vergewissere dich, dass Datumswerte richtig formatiert oder null sind
      const processedData = {
        ...data,
        start_date: data.start_date ? data.start_date : null,
        end_date: data.end_date ? data.end_date : null,
        tour_type: 'shipper', // Setze den Tour-Typ auf "shipper"
        user_id: user.id,
      } as TourWithRelations;
      
      createTour(processedData, {
        onSuccess: () => {
          toast({
            title: t('tours.tourCreated'),
            description: t('tours.tourCreatedDescription'),
          });
          navigate('/dashboard/shipper/tours');
        },
        onError: (error) => {
          console.error('Error creating tour:', error);
          toast({
            title: t('tours.errorCreatingTour'),
            description: error.message || t('tours.tryAgain'),
            variant: 'destructive'
          });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('tours.addTour')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('tours.addTourDescription')}
        </p>
      </div>

      <Alert>
        <AlertTitle>{t('tours.formInfo')}</AlertTitle>
        <AlertDescription>
          {t('tours.formDescription')}
        </AlertDescription>
      </Alert>

      <ShipperTourForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default AddTour;
