
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import VehicleFormStep1 from './VehicleFormSteps/VehicleFormStep1';
import VehicleFormStep2 from './VehicleFormSteps/VehicleFormStep2';
import VehicleFormStep3 from './VehicleFormSteps/VehicleFormStep3';
import VehicleFormStep4 from './VehicleFormSteps/VehicleFormStep4';
import VehicleFormStep5 from './VehicleFormSteps/VehicleFormStep5';
import VehicleFormNavigation from './VehicleFormNavigation';

export interface VehicleFormData {
  vehicle_type_id: string;
  body_type_id: string;
  brand: string;
  model: string;
  year: number;
  fin: string;
  license_plate: string;
  total_weight: number | null;
  load_volume: number | null;
  engine_power: number | null;
  engine_power_unit: string;
  fuel_consumption: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  additional_tech_info: string;
  maintenance_interval: number | null;
  last_inspection: string | null;
  inspection_report_url: string | null;
  financing_type_id: string | null;
  financing_details: Record<string, any>;
  operational_costs: Record<string, any>;
  availability_schedule: Record<string, any>;
  location: string;
  driver_id: string | null;
  additional_info: string;
}

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormData>;
  vehicleId?: string;
  isEditing?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  defaultValues,
  vehicleId,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const { company, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm<VehicleFormData>({
    defaultValues: {
      vehicle_type_id: '',
      body_type_id: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      fin: '',
      license_plate: '',
      total_weight: null,
      load_volume: null,
      engine_power: null,
      engine_power_unit: 'kW',
      fuel_consumption: null,
      length: null,
      width: null,
      height: null,
      additional_tech_info: '',
      maintenance_interval: null,
      last_inspection: null,
      inspection_report_url: null,
      financing_type_id: null,
      financing_details: {},
      operational_costs: {},
      availability_schedule: {},
      location: '',
      driver_id: null,
      additional_info: '',
      ...defaultValues,
    },
  });

  const steps = [
    { id: 1, label: t('vehicles.form.step1') },
    { id: 2, label: t('vehicles.form.step2') },
    { id: 3, label: t('vehicles.form.step3') },
    { id: 4, label: t('vehicles.form.step4') },
    { id: 5, label: t('vehicles.form.step5') },
  ];

  const goToNextStep = async () => {
    const validationResult = await formMethods.trigger(
      getFieldsForStep(currentStep)
    );
    if (validationResult) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const getFieldsForStep = (step: number): any[] => {
    switch (step) {
      case 1:
        return [
          'vehicle_type_id',
          'body_type_id',
          'brand',
          'model',
          'year',
          'license_plate',
        ];
      case 2:
        return []; // Technical data - optional fields
      case 3:
        return []; // Maintenance - optional fields
      case 4:
        return []; // Costs - optional fields
      case 5:
        return []; // Additional info - optional fields
      default:
        return [];
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    if (!company) {
      toast({
        title: t('common.error'),
        description: t('common.noCompanyId'),
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }
    
    if (!user) {
      toast({
        title: t('common.error'),
        description: t('common.notLoggedIn'),
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const vehicleData = {
        ...data,
        company_id: company.id,
        user_id: user.id,
      };

      let result;

      if (isEditing && vehicleId) {
        // Update existing vehicle
        result = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', vehicleId)
          .eq('company_id', company.id);
      } else {
        // Insert new vehicle
        result = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select('id')
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? t('vehicles.vehicleUpdated') : t('vehicles.vehicleAdded'),
        duration: 3000,
      });

      // Navigate back to vehicles list or vehicle details
      if (isEditing && vehicleId) {
        navigate(`/dashboard/subcontractor/vehicles/${vehicleId}`);
      } else if (result.data?.id) {
        navigate(`/dashboard/subcontractor/vehicles/${result.data.id}`);
      } else {
        navigate('/dashboard/subcontractor/vehicles');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        title: t('common.error'),
        description: (error as Error)?.message || t('common.unknownError'),
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <VehicleFormNavigation
            currentStep={currentStep}
            steps={steps}
            setCurrentStep={setCurrentStep}
          />
          
          <Tabs value={`step-${currentStep}`} className="mt-6">
            <TabsContent value="step-1">
              <VehicleFormStep1 />
            </TabsContent>
            <TabsContent value="step-2">
              <VehicleFormStep2 />
            </TabsContent>
            <TabsContent value="step-3">
              <VehicleFormStep3 />
            </TabsContent>
            <TabsContent value="step-4">
              <VehicleFormStep4 />
            </TabsContent>
            <TabsContent value="step-5">
              <VehicleFormStep5 />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between p-6">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={goToPreviousStep}>
                {t('vehicles.form.previous')}
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard/subcontractor/vehicles')}
              >
                {t('common.cancel')}
              </Button>
            )}

            {currentStep < steps.length ? (
              <Button type="button" onClick={goToNextStep}>
                {t('vehicles.form.next')}
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 
                  t('common.saving') : 
                  isEditing ? t('vehicles.edit') : t('vehicles.form.save')
                }
              </Button>
            )}
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

export default VehicleForm;
