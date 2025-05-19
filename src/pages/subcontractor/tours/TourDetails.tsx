
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TourDetail from '@/components/tours/TourDetail';
import { useTourById, useTours } from '@/hooks/useTours';
import { TourFilterOptions } from '@/types/tour';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TourDetails: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tourId } = useParams<{ tourId: string }>();
  
  const { tour, isLoading } = useTourById(tourId);
  
  const defaultFilters: TourFilterOptions = {
    timeframe: 'all',
    regions: [],
    vehicleType: '',
    employeeId: '',
    status: 'all',
    sortBy: 'date',
    sortDirection: 'asc',
  };
  
  const { deleteTour } = useTours(defaultFilters);
  
  const handleDelete = () => {
    deleteTour(tourId!, {
      onSuccess: () => {
        navigate('/dashboard/subcontractor/tours');
      }
    });
  };
  
  if (isLoading) {
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
          <div className="h-8 bg-muted rounded-md mb-4 w-48 animate-pulse"></div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-muted rounded-md w-full"></div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/subcontractor/tours')}
            className="mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/subcontractor/tours/${tourId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.delete')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('tours.confirmDeleteTitle')}</DialogTitle>
                <DialogDescription>
                  {t('tours.confirmDeleteDescription')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => navigate(`/dashboard/subcontractor/tours/${tourId}`)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  {t('common.confirmDelete')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <TourDetail tour={tour} />
    </div>
  );
};

export default TourDetails;
