
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TourWithRelations } from '@/types/tour';
import { format } from 'date-fns';
import TourStatusBadge from './TourStatusBadge';

interface TourDetailProps {
  tour: TourWithRelations;
}

const TourDetail: React.FC<TourDetailProps> = ({ tour }) => {
  const { t } = useTranslation();
  
  const getDayName = (dayOfWeek: number) => {
    const days = [
      t('common.sunday'),
      t('common.monday'),
      t('common.tuesday'),
      t('common.wednesday'),
      t('common.thursday'),
      t('common.friday'),
      t('common.saturday'),
    ];
    return days[dayOfWeek];
  };
  
  const getVehicleTypeName = (type: string) => {
    const types: Record<string, string> = {
      'small_transporter': t('tours.vehicleTypes.smallTransporter'),
      'transporter_35t': t('tours.vehicleTypes.transporter35t'),
      'truck_75t': t('tours.vehicleTypes.truck75t'),
      'truck_75t_40t': t('tours.vehicleTypes.truck75t40t'),
    };
    return types[type] || type;
  };
  
  const getBodyTypeName = (type: string) => {
    const types: Record<string, string> = {
      'box': t('tours.bodyTypes.box'),
      'curtain': t('tours.bodyTypes.curtain'),
      'refrigerated': t('tours.bodyTypes.refrigerated'),
      'tanker': t('tours.bodyTypes.tanker'),
      'flatbed': t('tours.bodyTypes.flatbed'),
      'other': t('tours.bodyTypes.other'),
    };
    return types[type] || type;
  };
  
  const activeSchedules = tour.schedules?.filter(s => s.is_active) || [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">{tour.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <TourStatusBadge status={tour.status} />
            <span className="text-muted-foreground">
              {t('tours.id')}: {tour.id?.substring(0, 8)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('tours.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">{t('tours.formLabels.vehicleType')}</div>
              <div>{getVehicleTypeName(tour.vehicle_type)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium">{t('tours.formLabels.bodyType')}</div>
              <div>{getBodyTypeName(tour.body_type)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium">{t('tours.formLabels.startLocation')}</div>
              <div>{tour.start_location}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium">{t('tours.formLabels.endLocation')}</div>
              <div>{tour.end_location || '-'}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium">{t('tours.formLabels.totalDistance')}</div>
              <div>{tour.total_distance} km</div>
            </div>
            
            <div>
              <div className="text-sm font-medium">{t('tours.dateRange')}</div>
              <div>
                {tour.start_date && tour.end_date ? (
                  <>
                    {format(new Date(tour.start_date), 'dd.MM.yyyy')} - {format(new Date(tour.end_date), 'dd.MM.yyyy')}
                  </>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('tours.cargoInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">{t('tours.formLabels.cargoWeight')}</div>
              <div>{tour.cargo_weight} kg</div>
            </div>
            
            {tour.cargo_volume && (
              <div>
                <div className="text-sm font-medium">{t('tours.formLabels.cargoVolume')}</div>
                <div>{tour.cargo_volume} m³</div>
              </div>
            )}
            
            {tour.cargo_description && (
              <div>
                <div className="text-sm font-medium">{t('tours.formLabels.cargoDescription')}</div>
                <div>{tour.cargo_description}</div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm font-medium">{t('tours.formLabels.isPalletized')}</div>
                <div>{tour.is_palletized ? t('common.yes') : t('common.no')}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">{t('tours.formLabels.isHazardous')}</div>
                <div>{tour.is_hazardous ? t('common.yes') : t('common.no')}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">{t('tours.formLabels.temperatureSensitive')}</div>
                <div>{tour.temperature_sensitive ? t('common.yes') : t('common.no')}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium">{t('tours.formLabels.palletExchange')}</div>
                <div>{tour.pallet_exchange ? t('common.yes') : t('common.no')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('tours.schedule')}</CardTitle>
          {activeSchedules.length === 0 && (
            <CardDescription>{t('tours.noScheduleData')}</CardDescription>
          )}
        </CardHeader>
        {activeSchedules.length > 0 && (
          <CardContent>
            <div className="space-y-4">
              {activeSchedules.map((schedule, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                  <div className="font-medium">{getDayName(schedule.day_of_week)}</div>
                  <div className="flex flex-col md:flex-row gap-6 mt-2 md:mt-0">
                    {schedule.start_time && (
                      <div>
                        <div className="text-sm text-muted-foreground">{t('tours.formLabels.startTime')}</div>
                        <div>{schedule.start_time}</div>
                      </div>
                    )}
                    
                    {schedule.loading_time && (
                      <div>
                        <div className="text-sm text-muted-foreground">{t('tours.formLabels.loadingTime')}</div>
                        <div>{schedule.loading_time} {t('tours.minutes')}</div>
                      </div>
                    )}
                    
                    {schedule.working_time && (
                      <div>
                        <div className="text-sm text-muted-foreground">{t('tours.formLabels.workingTime')}</div>
                        <div>{schedule.working_time} {t('tours.minutes')}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default TourDetail;
