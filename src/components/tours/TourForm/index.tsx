
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TourFormStep1 from './TourFormStep1';
import TourFormStep2 from './TourFormStep2';
import TourFormStep3 from './TourFormStep3';
import { useAuth } from '@/contexts/AuthContext';
import { TourWithRelations } from '@/types/tour';

interface TourFormProps {
  initialData?: TourWithRelations;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const TourForm: React.FC<TourFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  
  // Prepare schedule data
  const initialSchedules = Array.from({ length: 7 }).reduce((acc, _, i) => {
    const existingSchedule = initialData?.schedules?.find(s => s.day_of_week === i);
    acc[i] = {
      is_active: existingSchedule?.is_active || false,
      start_time: existingSchedule?.start_time || '',
      loading_time: existingSchedule?.loading_time || 0,
      working_time: existingSchedule?.working_time || 0,
    };
    return acc;
  }, {} as Record<string, any>);
  
  const formSchema = z.object({
    // Step 1
    title: z.string().min(1, t('tours.validation.titleRequired')),
    vehicle_type: z.string().min(1, t('tours.validation.vehicleTypeRequired')),
    body_type: z.string().min(1, t('tours.validation.bodyTypeRequired')),
    
    // Step 2
    start_location: z.string().min(1, t('tours.validation.startLocationRequired')),
    end_location: z.string().optional(),
    start_location_lat: z.number().optional(),
    start_location_lng: z.number().optional(),
    end_location_lat: z.number().optional(),
    end_location_lng: z.number().optional(),
    total_distance: z.number().min(0, t('tours.validation.distancePositive')),
    cargo_weight: z.number().min(0, t('tours.validation.weightPositive')),
    cargo_volume: z.number().optional(),
    cargo_description: z.string().optional(),
    is_palletized: z.boolean().default(false),
    is_hazardous: z.boolean().default(false),
    temperature_sensitive: z.boolean().default(false),
    pallet_exchange: z.boolean().default(false),
    
    // Step 3
    start_date: z.string().min(1, t('tours.validation.startDateRequired')),
    end_date: z.string().min(1, t('tours.validation.endDateRequired')),
    schedules: z.record(z.object({
      is_active: z.boolean(),
      start_time: z.string().optional(),
      loading_time: z.number().optional(),
      working_time: z.number().optional(),
    })),
    
    // Hidden fields
    status: z.string().default('pending'),
    user_id: z.string().default(user?.id || ''),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      vehicle_type: initialData?.vehicle_type || '',
      body_type: initialData?.body_type || 'box',
      start_location: initialData?.start_location || '',
      end_location: initialData?.end_location || '',
      start_location_lat: initialData?.start_location_lat || undefined,
      start_location_lng: initialData?.start_location_lng || undefined,
      end_location_lat: initialData?.end_location_lat || undefined,
      end_location_lng: initialData?.end_location_lng || undefined,
      total_distance: initialData?.total_distance || 0,
      cargo_weight: initialData?.cargo_weight || 0,
      cargo_volume: initialData?.cargo_volume || 0,
      cargo_description: initialData?.cargo_description || '',
      is_palletized: initialData?.is_palletized || false,
      is_hazardous: initialData?.is_hazardous || false,
      temperature_sensitive: initialData?.temperature_sensitive || false,
      pallet_exchange: initialData?.pallet_exchange || false,
      start_date: initialData?.start_date || '',
      end_date: initialData?.end_date || '',
      schedules: initialSchedules,
      status: initialData?.status || 'pending',
      user_id: user?.id || '',
    }
  });
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Convert schedules to array format
    const scheduleRecords = Object.entries(values.schedules).map(([dayOfWeek, schedule]) => ({
      day_of_week: parseInt(dayOfWeek),
      is_active: schedule.is_active,
      start_time: schedule.start_time,
      loading_time: schedule.loading_time,
      working_time: schedule.working_time,
    }));
    
    const tourData = {
      ...values,
      id: initialData?.id,
      schedules: scheduleRecords,
    };
    
    onSubmit(tourData);
  };
  
  const nextStep = async () => {
    if (step === 1) {
      const { title, vehicle_type, body_type } = form.getValues();
      const isValid = await form.trigger(['title', 'vehicle_type', 'body_type']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const { start_location, total_distance, cargo_weight } = form.getValues();
      const isValid = await form.trigger(['start_location', 'total_distance', 'cargo_weight']);
      if (isValid) setStep(3);
    }
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <TourFormStep1 form={form} />;
      case 2:
        return <TourFormStep2 form={form} />;
      case 3:
        return <TourFormStep3 form={form} />;
      default:
        return null;
    }
  };
  
  const renderStepTitle = () => {
    switch (step) {
      case 1:
        return t('tours.formSteps.step1Title');
      case 2:
        return t('tours.formSteps.step2Title');
      case 3:
        return t('tours.formSteps.step3Title');
      default:
        return '';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{renderStepTitle()}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent>
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || isLoading}
            >
              {t('common.previous')}
            </Button>
            <div className="flex gap-2">
              {step < 3 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={isLoading}
                >
                  {t('common.next')}
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {initialData ? t('common.update') : t('common.create')}
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default TourForm;
