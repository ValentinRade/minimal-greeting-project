import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { VehicleFormData } from '../VehicleForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const VehicleFormStep4 = () => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<VehicleFormData>();
  
  const financingTypeId = watch('financing_type_id');
  const financingDetails = watch('financing_details');
  const operationalCosts = watch('operational_costs');

  const { data: financingTypes = [] } = useQuery({
    queryKey: ['financingTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financing_types')
        .select('id, name');
      
      if (error) {
        console.error('Error fetching financing types:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Update financing details fields based on financing type
  useEffect(() => {
    if (!financingTypeId) return;

    const financingType = financingTypes.find(type => type.id === financingTypeId)?.name;
    
    if (!financingType) return;
    
    // Initialize financing details structure based on type
    const defaultFinancingDetails: Record<string, any> = {};
    
    switch (financingType) {
      case 'Leasing':
        defaultFinancingDetails.rate = financingDetails?.rate || '';
        defaultFinancingDetails.term = financingDetails?.term || '';
        defaultFinancingDetails.downPayment = financingDetails?.downPayment || '';
        defaultFinancingDetails.residualValue = financingDetails?.residualValue || '';
        break;
      case 'Miete':
        defaultFinancingDetails.rate = financingDetails?.rate || '';
        defaultFinancingDetails.term = financingDetails?.term || '';
        break;
      case 'Finanzierung':
        defaultFinancingDetails.rate = financingDetails?.rate || '';
        defaultFinancingDetails.term = financingDetails?.term || '';
        defaultFinancingDetails.interestRate = financingDetails?.interestRate || '';
        break;
      case 'Eigentum':
        defaultFinancingDetails.purchasePrice = financingDetails?.purchasePrice || '';
        break;
    }
    
    setValue('financing_details', defaultFinancingDetails);
  }, [financingTypeId, financingTypes]);

  // Update operational costs structure
  useEffect(() => {
    const defaultOperationalCosts = {
      fuelPrice: operationalCosts?.fuelPrice || '',
      annualDistance: operationalCosts?.annualDistance || '',
      maintenanceCost: operationalCosts?.maintenanceCost || '',
      repairCost: operationalCosts?.repairCost || '',
      insuranceCost: operationalCosts?.insuranceCost || '',
      taxCost: operationalCosts?.taxCost || '',
      otherCosts: operationalCosts?.otherCosts || '',
    };
    
    setValue('operational_costs', defaultOperationalCosts);
  }, []);

  // Calculate total costs
  const calculateCosts = () => {
    let monthlyCosts = 0;
    let yearlyCosts = 0;
    
    // Financing costs
    if (financingTypeId) {
      const financingType = financingTypes.find(type => type.id === financingTypeId)?.name;
      
      switch (financingType) {
        case 'Leasing':
        case 'Miete':
        case 'Finanzierung':
          monthlyCosts += parseFloat(financingDetails?.rate) || 0;
          break;
        case 'Eigentum':
          // Depreciation over 5 years
          const monthlyDepreciation = 
            (parseFloat(financingDetails?.purchasePrice) || 0) / (5 * 12);
          monthlyCosts += monthlyDepreciation;
          break;
      }
    }
    
    // Operational costs
    const annualDistance = parseFloat(operationalCosts?.annualDistance) || 0;
    const fuelPrice = parseFloat(operationalCosts?.fuelPrice) || 0;
    const fuelConsumption = watch('fuel_consumption') || 0;
    
    // Monthly fuel costs
    const monthlyDistance = annualDistance / 12;
    const monthlyFuelCosts = (monthlyDistance / 100) * fuelConsumption * fuelPrice;
    monthlyCosts += monthlyFuelCosts;
    
    // Other monthly costs
    monthlyCosts += (parseFloat(operationalCosts?.maintenanceCost) || 0) / 12;
    monthlyCosts += (parseFloat(operationalCosts?.repairCost) || 0) / 12;
    monthlyCosts += (parseFloat(operationalCosts?.insuranceCost) || 0) / 12;
    monthlyCosts += (parseFloat(operationalCosts?.taxCost) || 0) / 12;
    monthlyCosts += (parseFloat(operationalCosts?.otherCosts) || 0) / 12;
    
    // Yearly costs
    yearlyCosts = monthlyCosts * 12;
    
    return {
      monthly: monthlyCosts.toFixed(2),
      yearly: yearlyCosts.toFixed(2),
    };
  };

  const costs = calculateCosts();

  return (
    <CardContent className="space-y-6">
      <FormField
        control={control}
        name="financing_type_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.financingType')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.select')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {financingTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {financingTypeId && (
        <>
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">{t('vehicles.form.financingDetails')}</h3>
            
            {financingTypes.find(type => type.id === financingTypeId)?.name === 'Leasing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="financing_details.rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.leasingRate')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="financing_details.term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.leasingTerm')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="financing_details.downPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.downPayment')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="financing_details.residualValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.residualValue')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {financingTypes.find(type => type.id === financingTypeId)?.name === 'Miete' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="financing_details.rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.rentalRate')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="financing_details.term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.rentalTerm')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {financingTypes.find(type => type.id === financingTypeId)?.name === 'Finanzierung' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="financing_details.rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.loanRate')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="financing_details.term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.loanTerm')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="financing_details.interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.interestRate')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {financingTypes.find(type => type.id === financingTypeId)?.name === 'Eigentum' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="financing_details.purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vehicles.form.purchasePrice')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </>
      )}
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-3">{t('vehicles.form.operationalCosts')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="operational_costs.fuelPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.fuelPrice')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="operational_costs.annualDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.annualDistance')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="operational_costs.maintenanceCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.maintenanceCost')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="operational_costs.repairCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.repairCost')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="operational_costs.insuranceCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.insuranceCost')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="operational_costs.taxCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.taxCost')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="operational_costs.otherCosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.otherCosts')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-3">{t('vehicles.form.costOverview')}</h3>
        
        <Tabs defaultValue="monthly">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">{t('vehicles.form.monthly')}</TabsTrigger>
            <TabsTrigger value="yearly">{t('vehicles.form.yearly')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="pt-2">
            <div className="p-4 bg-muted rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('common.total')}</p>
                  <p className="text-2xl font-semibold">{costs.monthly} €</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="pt-2">
            <div className="p-4 bg-muted rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('common.total')}</p>
                  <p className="text-2xl font-semibold">{costs.yearly} €</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CardContent>
  );
};

export default VehicleFormStep4;
