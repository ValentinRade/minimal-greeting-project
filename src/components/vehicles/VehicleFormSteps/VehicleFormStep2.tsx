
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import { Textarea } from '@/components/ui/textarea';
import { VehicleFormData } from '../VehicleForm';

const VehicleFormStep2 = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<VehicleFormData>();

  const powerUnits = [
    { value: 'kW', label: 'kW' },
    { value: 'PS', label: 'PS/HP' },
    { value: 'HP', label: 'HP' },
  ];

  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="engine_power"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.enginePower')}</FormLabel>
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
            name="engine_power_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.enginePowerUnit')}</FormLabel>
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
                    {powerUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name="fuel_consumption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.form.fuelConsumption')}</FormLabel>
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

      <div>
        <h3 className="text-sm font-medium mb-3">{t('vehicles.form.dimensions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.length')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
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
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.width')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
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
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.form.height')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01"
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
      </div>

      <FormField
        control={control}
        name="additional_tech_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.additionalTechInfo')}</FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
};

export default VehicleFormStep2;
