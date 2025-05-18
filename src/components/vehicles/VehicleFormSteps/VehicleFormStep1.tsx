
import React from 'react';
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
import { VehicleFormData } from '../VehicleForm';

const VehicleFormStep1 = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<VehicleFormData>();

  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('id, name');
      
      if (error) {
        console.error('Error fetching vehicle types:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const { data: bodyTypes = [] } = useQuery({
    queryKey: ['bodyTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('body_types')
        .select('id, name');
      
      if (error) {
        console.error('Error fetching body types:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Generate a range of years for the select field
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="vehicle_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.vehicleType')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.select')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleTypes.map((type) => (
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
        
        <FormField
          control={control}
          name="body_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.bodyType')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.select')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bodyTypes.map((type) => (
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="brand"
          rules={{ required: t('common.required') }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.brand')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="model"
          rules={{ required: t('common.required') }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.model')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="year"
          rules={{ required: t('common.required') }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.year')}</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.select')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="fin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.fin')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="license_plate"
          rules={{ required: t('common.required') }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.licensePlate')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="total_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.totalWeight')}</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  {...field}
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="load_volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.loadVolume')}</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.1"
                  {...field}
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </CardContent>
  );
};

export default VehicleFormStep1;
