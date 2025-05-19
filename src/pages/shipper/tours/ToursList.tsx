
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TourFilterOptions } from '@/types/tour';
import { useTours } from '@/hooks/useTours';
import { Plus, FileText } from 'lucide-react';
import TourTable from '@/components/tours/TourTable';
import TourStats from '@/components/tours/TourStats';
import TourFilterBar from '@/components/tours/TourFilterBar';

const ToursList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] = useState<TourFilterOptions>({
    timeframe: 'all',
    regions: [],
    vehicleType: '',
    employeeId: '',
    status: 'all',
    sortBy: 'date',
    sortDirection: 'desc',
  });

  const { tours, stats, isLoadingTours, isLoadingStats, deleteTour } = useTours(filterOptions);

  const handleAddTour = () => {
    navigate('/dashboard/shipper/tours/add');
  };
  
  // Filter handler function
  const handleFilterChange = (key: keyof TourFilterOptions, value: any) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('tours.title')}</h1>
          <p className="text-muted-foreground">
            {t('tours.description')}
          </p>
        </div>
        <Button onClick={handleAddTour} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('tours.addTour')}
        </Button>
      </div>

      <TourStats stats={stats} isLoading={isLoadingStats} />

      <Card>
        <CardHeader>
          <CardTitle>{t('tours.allTours')}</CardTitle>
          <CardDescription>
            {t('tours.manageTours')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <TourFilterBar
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
          
          {tours.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-lg mt-6">
              <FileText className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <h3 className="font-medium">{t('tours.noTours')}</h3>
              <p className="text-sm mt-1">{t('tours.createFirstTour')}</p>
              <Button onClick={handleAddTour} variant="outline" className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                {t('tours.addTour')}
              </Button>
            </div>
          ) : (
            <TourTable tours={tours} isLoading={isLoadingTours} onDelete={deleteTour} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToursList;
