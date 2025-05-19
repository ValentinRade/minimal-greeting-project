
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TourForm from '@/components/tours/TourForm';
import { useTours } from '@/hooks/useTours';
import { useAuth } from '@/contexts/AuthContext';
import { TourFilterOptions } from '@/types/tour';

const AddTour: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const defaultFilters: TourFilterOptions = {
    timeframe: "all", 
    regions: [],
    vehicleType: '',
    employeeId: '',
    status: "all", 
    sortBy: 'date',
    sortDirection: 'asc',
  };
  
  const { createTour, isLoading } = useTours(defaultFilters);
  
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
    
    createTour({
      ...data,
      user_id: user?.id,
    }, {
      onSuccess: () => {
        navigate('/dashboard/subcontractor/tours');
      }
    });
  };
  
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
        <h1 className="text-3xl font-bold">{t('tours.createTour')}</h1>
        <p className="text-muted-foreground">
          {t('tours.createTourDescription')}
        </p>
      </div>
      
      <TourForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddTour;
