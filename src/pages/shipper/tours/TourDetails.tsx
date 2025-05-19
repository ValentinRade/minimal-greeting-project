
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useTourById } from '@/hooks/useTours';
import { Edit, ArrowLeft } from 'lucide-react';
import TourDetail from '@/components/tours/TourDetail';

const TourDetails: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId: string }>();
  const { tour, isLoading } = useTourById(tourId);

  const handleEdit = () => {
    navigate(`/dashboard/shipper/tours/${tourId}/edit`);
  };

  const handleBack = () => {
    navigate('/dashboard/shipper/tours');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-[500px] w-full" />
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('common.back')}
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">{tour.title}</h1>
        </div>
        <Button onClick={handleEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          {t('common.edit')}
        </Button>
      </div>

      <TourDetail tour={tour} />
    </div>
  );
};

export default TourDetails;
