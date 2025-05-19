
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TourForm from '@/components/tours/TourForm';
import { useTours, useTourById } from '@/hooks/useTours';
import { TourFilterOptions } from '@/types/tour';

const EditTour: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId: string }>();
  
  const { tour, isLoading: isLoadingTour } = useTourById(tourId);
  
  const defaultFilters: TourFilterOptions = {
    timeframe: "all",
    regions: [],
    vehicleType: '',
    employeeId: '',
    status: "all",
    sortBy: 'date',
    sortDirection: 'asc',
  };
  
  const { updateTour, isLoading: isUpdating } = useTours(defaultFilters);
  
  const handleSubmit = (data: any) => {
    // Process schedules to ensure no empty strings for time fields
    if (data.schedules) {
      const formattedSchedules = Object.entries(data.schedules).map(([dayOfWeek, schedule]: [string, any]) => {
        return {
          day_of_week: parseInt(dayOfWeek),
          is_active: schedule.is_active,
          start_time: schedule.start_time || null,
          loading_time: schedule.loading_time || null,
          working_time: schedule.working_time || null,
        };
      });
      
      data.schedules = formattedSchedules;
    }
    
    updateTour({
      ...data,
      id: tourId,
    }, {
      onSuccess: () => {
        navigate(`/dashboard/subcontractor/tours/${tourId}`);
      }
    });
  };
  
  if (isLoadingTour) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/dashboard/subcontractor/tours/${tourId}`)}
            className="mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('tours.editTour')}</h1>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded-md mb-4 w-full max-w-sm"></div>
          <div className="h-64 bg-muted rounded-md w-full"></div>
        </div>
      </div>
    );
  }
  
  if (!tour) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/subcontractor/tours')}
            className="mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('tours.tourNotFound')}</h1>
        </div>
        <p>{t('tours.tourNotFoundDescription')}</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/dashboard/subcontractor/tours')}
        >
          {t('tours.returnToTours')}
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/dashboard/subcontractor/tours/${tourId}`)}
          className="mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <h1 className="text-3xl font-bold">{t('tours.editTour')}</h1>
        <p className="text-muted-foreground">
          {t('tours.editTourDescription')}
        </p>
      </div>
      
      <TourForm 
        initialData={tour} 
        onSubmit={handleSubmit} 
        isLoading={isUpdating} 
      />
    </div>
  );
};

export default EditTour;
