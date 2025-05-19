
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useTourById, useTours } from '@/hooks/useTours';
import ShipperTourForm from '@/components/shipper/tours/ShipperTourForm';
import { TourWithRelations } from '@/types/tour';

const EditTour: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId: string }>();
  const { tour, isLoading: isLoadingTour } = useTourById(tourId);
  const { updateTour, isLoading: isUpdating } = useTours({
    timeframe: 'all',
    regions: [],
    vehicleType: '',
    employeeId: '',
    status: 'all',
    sortBy: 'date',
    sortDirection: 'desc',
  });

  const handleSubmit = (data: Partial<TourWithRelations>) => {
    if (tour) {
      const updatedTour = {
        ...tour,
        ...data,
        id: tour.id,
      } as TourWithRelations;
      
      updateTour(updatedTour, {
        onSuccess: () => {
          navigate('/dashboard/shipper/tours');
        }
      });
    }
  };

  if (isLoadingTour) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!tour) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('tours.notFound')}</AlertTitle>
        <AlertDescription>
          {t('tours.notFoundDescription')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('tours.editTour')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('tours.editTourDescription')}
        </p>
      </div>

      <ShipperTourForm 
        initialData={tour} 
        onSubmit={handleSubmit} 
        isLoading={isUpdating} 
      />
    </div>
  );
};

export default EditTour;
