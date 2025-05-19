
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TourStatus } from '@/types/tour';

interface Step6SummaryProps {
  form: UseFormReturn<any>;
}

const Step6Summary: React.FC<Step6SummaryProps> = ({ form }) => {
  const { t } = useTranslation();
  
  const formValues = form.getValues();
  const schedules = formValues.schedules || [];
  const stops = formValues.stops || [];
  
  const activeDays = schedules
    .filter((s: any) => s.is_active)
    .map((s: any, i: number) => t(`common.days.${['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][s.day_of_week]}`));
  
  const statusOptions = [
    { value: 'active', label: t('tours.form.statuses.active') },
    { value: 'pending', label: t('tours.form.statuses.pending') },
    { value: 'paused', label: t('tours.form.statuses.paused') },
    { value: 'cancelled', label: t('tours.form.statuses.cancelled') },
    { value: 'awarded', label: t('tours.form.statuses.awarded') },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('tours.form.tourDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.title')}
              </h4>
              <p className="font-medium">{formValues.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.vehicleAndBodyType')}
              </h4>
              <p className="font-medium">
                {formValues.vehicle_type}, {formValues.body_type}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.route')}
              </h4>
              <p className="font-medium">
                {formValues.start_location} → {formValues.end_location || t('tours.form.noEndLocation')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.distance')}
              </h4>
              <p className="font-medium">{formValues.total_distance} km</p>
            </div>
            {stops.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('tours.form.stops')}
                </h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stops.map((stop: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {stop.location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('tours.form.cargoDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.weight')}
              </h4>
              <p className="font-medium">{formValues.cargo_weight} kg</p>
            </div>
            {formValues.cargo_volume > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('tours.form.volume')}
                </h4>
                <p className="font-medium">{formValues.cargo_volume} m³</p>
              </div>
            )}
            {formValues.cargo_description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('tours.form.description')}
                </h4>
                <p className="font-medium">{formValues.cargo_description}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-1">
              {formValues.is_palletized && (
                <Badge variant="secondary">{t('tours.form.palletized')}</Badge>
              )}
              {formValues.is_hazardous && (
                <Badge variant="secondary">{t('tours.form.hazardous')}</Badge>
              )}
              {formValues.temperature_sensitive && (
                <Badge variant="secondary">{t('tours.form.temperatureControlled')}</Badge>
              )}
              {formValues.pallet_exchange && (
                <Badge variant="secondary">{t('tours.form.palletExchange')}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('tours.form.schedule')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.startDate')}
              </h4>
              <p className="font-medium">
                {formValues.start_date && format(new Date(formValues.start_date), "PPP")}
              </p>
            </div>
            {formValues.end_date && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('tours.form.endDate')}
                </h4>
                <p className="font-medium">
                  {format(new Date(formValues.end_date), "PPP")}
                </p>
              </div>
            )}
            {activeDays.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('tours.form.activeDays')}
                </h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeDays.map((day: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('tours.form.compensationAndPayment')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.compensationBasis')}
              </h4>
              <p className="font-medium">
                {t(`tours.form.${formValues.compensation_basis}`)}
              </p>
            </div>
            {formValues.target_price > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('tours.form.targetPrice')}
                </h4>
                <p className="font-medium">
                  {formValues.target_price} {formValues.currency}
                  {!formValues.show_target_price && " (Hidden)"}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.billingType')}
              </h4>
              <p className="font-medium">
                {t(`tours.form.${formValues.billing_type}`)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('tours.form.paymentTerm')}
              </h4>
              <p className="font-medium">
                {formValues.payment_term_value} {t(`tours.form.${formValues.payment_term_unit}`)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('tours.form.tourStatus')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tours.form.selectStatus')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t('tours.form.statusDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('status') === 'cancelled' && (
          <FormField
            control={form.control}
            name="cancellation_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('tours.form.cancellationReason')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('tours.form.cancellationReasonPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Step6Summary;
