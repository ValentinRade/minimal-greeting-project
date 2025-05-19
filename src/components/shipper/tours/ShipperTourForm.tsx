
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TourWithRelations } from '@/types/tour';
import { useAuth } from '@/contexts/AuthContext';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShipperTourFormStepper from './ShipperTourFormStepper';
import Step1VehicleRequirements from './steps/Step1VehicleRequirements';
import Step2RouteDetails from './steps/Step2RouteDetails';
import Step3TransportFrequency from './steps/Step3TransportFrequency';
import Step4Compensation from './steps/Step4Compensation';
import Step5PaymentTerms from './steps/Step5PaymentTerms';
import Step6Summary from './steps/Step6Summary';

interface ShipperTourFormProps {
  initialData?: TourWithRelations;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

// Tour form schema
const formSchema = z.object({
  // Step 1: Vehicle requirements
  title: z.string().min(1, { message: 'Title is required' }),
  vehicle_type: z.string().min(1, { message: 'Vehicle type is required' }),
  body_type: z.string().min(1, { message: 'Body type is required' }),
  certificates: z.array(z.string()).optional(),
  
  // Step 2: Route and cargo details
  start_location: z.string().min(1, { message: 'Start location is required' }),
  end_location: z.string().optional(),
  total_distance: z.number().min(0, { message: 'Distance must be positive' }),
  cargo_weight: z.number().min(0, { message: 'Weight must be positive' }),
  cargo_volume: z.number().optional(),
  cargo_description: z.string().optional(),
  is_palletized: z.boolean().default(false),
  is_hazardous: z.boolean().default(false),
  temperature_sensitive: z.boolean().default(false),
  pallet_exchange: z.boolean().default(false),
  stops: z.array(z.object({
    location: z.string(),
    order: z.number()
  })).optional(),
  
  // Step 3: Transport frequency
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().optional(),
  schedules: z.array(z.object({
    day_of_week: z.number(),
    is_active: z.boolean(),
    start_time: z.string().optional(),
    loading_time: z.number().optional(),
    working_time: z.number().optional()
  })).optional(),
  
  // Step 4: Compensation
  compensation_basis: z.enum(['fixed', 'per_km', 'per_time', 'other']),
  target_price: z.number().optional(),
  show_target_price: z.boolean().default(true),
  diesel_surcharge: z.boolean().default(false),
  commercial_calculation_required: z.boolean().default(false),
  
  // Step 5: Payment terms
  billing_type: z.enum(['invoice', 'credit_note']),
  payment_term_value: z.number(),
  payment_term_unit: z.enum(['days', 'weeks', 'months']),
  currency: z.string(),
  
  // Step 6: Summary and status
  status: z.enum(['active', 'cancelled', 'paused', 'awarded', 'pending']).default('pending'),
  cancellation_reason: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const ShipperTourForm: React.FC<ShipperTourFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  
  // Initialize form with default values or initial data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      // Map existing data to form values
      title: initialData.title || '',
      vehicle_type: initialData.vehicle_type || '',
      body_type: initialData.body_type?.toString() || 'box',
      certificates: [],
      start_location: initialData.start_location || '',
      end_location: initialData.end_location || '',
      total_distance: initialData.total_distance || 0,
      cargo_weight: initialData.cargo_weight || 0,
      cargo_volume: initialData.cargo_volume || 0,
      cargo_description: initialData.cargo_description || '',
      is_palletized: initialData.is_palletized || false,
      is_hazardous: initialData.is_hazardous || false,
      temperature_sensitive: initialData.temperature_sensitive || false,
      pallet_exchange: initialData.pallet_exchange || false,
      stops: initialData.stops || [],
      start_date: initialData.start_date || '',
      end_date: initialData.end_date || '',
      schedules: initialData.schedules?.map(s => ({
        day_of_week: s.day_of_week,
        is_active: s.is_active,
        start_time: s.start_time || '',
        loading_time: s.loading_time || 0,
        working_time: s.working_time || 0
      })) || Array(7).fill(0).map((_, i) => ({
        day_of_week: i,
        is_active: false,
        start_time: '',
        loading_time: 0,
        working_time: 0
      })),
      compensation_basis: 'fixed',
      target_price: 0,
      show_target_price: true,
      diesel_surcharge: false,
      commercial_calculation_required: false,
      billing_type: 'invoice',
      payment_term_value: 14,
      payment_term_unit: 'days',
      currency: 'EUR',
      status: initialData.status || 'pending',
      cancellation_reason: ''
    } : {
      // Default values for new tour
      title: '',
      vehicle_type: '',
      body_type: 'box',
      certificates: [],
      start_location: '',
      end_location: '',
      total_distance: 0,
      cargo_weight: 0,
      cargo_volume: 0,
      cargo_description: '',
      is_palletized: false,
      is_hazardous: false,
      temperature_sensitive: false,
      pallet_exchange: false,
      stops: [],
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      schedules: Array(7).fill(0).map((_, i) => ({
        day_of_week: i,
        is_active: false,
        start_time: '',
        loading_time: 0,
        working_time: 0
      })),
      compensation_basis: 'fixed',
      target_price: 0,
      show_target_price: true,
      diesel_surcharge: false,
      commercial_calculation_required: false,
      billing_type: 'invoice',
      payment_term_value: 14,
      payment_term_unit: 'days',
      currency: 'EUR',
      status: 'pending',
      cancellation_reason: ''
    }
  });

  const nextStep = async () => {
    let canProceed = false;
    
    // Validate current step before proceeding
    switch (step) {
      case 1:
        canProceed = await form.trigger(['title', 'vehicle_type', 'body_type']);
        break;
      case 2:
        canProceed = await form.trigger(['start_location', 'total_distance', 'cargo_weight']);
        break;
      case 3:
        canProceed = await form.trigger(['start_date']);
        break;
      case 4:
        canProceed = await form.trigger(['compensation_basis']);
        break;
      case 5:
        canProceed = await form.trigger(['billing_type', 'payment_term_value', 'payment_term_unit', 'currency']);
        break;
      default:
        canProceed = true;
        break;
    }
    
    if (canProceed && step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    // Map form values to tour data structure
    const tourData = {
      ...values,
      user_id: user?.id,
    };
    
    onSubmit(tourData);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1VehicleRequirements form={form} />;
      case 2:
        return <Step2RouteDetails form={form} />;
      case 3:
        return <Step3TransportFrequency form={form} />;
      case 4:
        return <Step4Compensation form={form} />;
      case 5:
        return <Step5PaymentTerms form={form} />;
      case 6:
        return <Step6Summary form={form} />;
      default:
        return null;
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Card>
          <CardContent className="pt-6">
            <ShipperTourFormStepper currentStep={step} totalSteps={totalSteps} />
            <div className="mt-6">
              {renderStepContent()}
            </div>
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
              {step < totalSteps ? (
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
                  {initialData ? t('tours.updateTour') : t('tours.createTour')}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ShipperTourForm;
