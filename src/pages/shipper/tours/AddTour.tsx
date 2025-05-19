
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTours } from '@/hooks/useTours';
import { useAuth } from '@/contexts/AuthContext';
import ShipperTourForm from '@/components/shipper/tours/ShipperTourForm';
import { TourWithRelations } from '@/types/tour';

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
      const tourData = {
        ...data,
        user_id: user.id,
      } as TourWithRelations;
      
      createTour(tourData, {
        onSuccess: () => {
          navigate('/dashboard/shipper/tours');
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
