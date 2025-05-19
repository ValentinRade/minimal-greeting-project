
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TourFilterBar from '@/components/tours/TourFilterBar';
import TourStats from '@/components/tours/TourStats';
import TourTable from '@/components/tours/TourTable';
import { useTours } from '@/hooks/useTours';
import type { TourFilterOptions } from '@/types/tour';

const ToursList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<TourFilterOptions>({
    timeframe: 'all',
    regions: [],
    vehicleType: '',
    employeeId: '',
    status: 'all',
    sortBy: 'date',
    sortDirection: 'asc',
  });
  
  const { 
    tours, 
    isLoadingTours,
    stats,
    isLoadingStats,
    deleteTour
  } = useTours(filters);
  
  const handleFilterChange = (key: keyof TourFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('tours.title')}</h1>
          <p className="text-muted-foreground">
            {t('tours.description')}
          </p>
        </div>
        <Button onClick={() => navigate('add')}>
          <Plus className="mr-2 h-4 w-4" /> {t('tours.createTour')}
        </Button>
      </div>
      
      <TourStats stats={stats} isLoading={isLoadingStats} />
      
      <TourFilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <TourTable 
        tours={tours}
        isLoading={isLoadingTours}
        onDelete={deleteTour}
      />
    </div>
  );
};

export default ToursList;
