
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VehicleFormData } from '../VehicleForm';

const VehicleFormStep5 = () => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext<VehicleFormData>();
  
  const availabilitySchedule = watch('availability_schedule') || {};

  // Initialize availability schedule if empty
  React.useEffect(() => {
    if (!availabilitySchedule.weekdays) {
      setValue('availability_schedule', {
        weekdays: {
          monday: { available: true, start: '08:00', end: '17:00' },
          tuesday: { available: true, start: '08:00', end: '17:00' },
          wednesday: { available: true, start: '08:00', end: '17:00' },
          thursday: { available: true, start: '08:00', end: '17:00' },
          friday: { available: true, start: '08:00', end: '17:00' },
          saturday: { available: false, start: '08:00', end: '17:00' },
          sunday: { available: false, start: '08:00', end: '17:00' },
        }
      });
    }
  }, []);

  return (
    <CardContent className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">{t('vehicles.form.availability')}</h3>
        <div className="space-y-4">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
            <div key={day} className="grid grid-cols-3 gap-3 items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`${day}-available`}
                  className="mr-2 h-4 w-4 rounded border-gray-300"
                  checked={availabilitySchedule.weekdays?.[day]?.available ?? false}
                  onChange={(e) => {
                    const newSchedule = { ...availabilitySchedule };
                    if (!newSchedule.weekdays) newSchedule.weekdays = {};
                    if (!newSchedule.weekdays[day]) newSchedule.weekdays[day] = {};
                    newSchedule.weekdays[day].available = e.target.checked;
                    setValue('availability_schedule', newSchedule);
                  }}
                />
                <label htmlFor={`${day}-available`} className="text-sm capitalize">
                  {t(`common.${day}`)}
                </label>
              </div>
              
              <Input 
                type="time"
                value={availabilitySchedule.weekdays?.[day]?.start || '08:00'}
                onChange={(e) => {
                  const newSchedule = { ...availabilitySchedule };
                  if (!newSchedule.weekdays) newSchedule.weekdays = {};
                  if (!newSchedule.weekdays[day]) newSchedule.weekdays[day] = {};
                  newSchedule.weekdays[day].start = e.target.value;
                  setValue('availability_schedule', newSchedule);
                }}
                disabled={!availabilitySchedule.weekdays?.[day]?.available}
              />
              
              <Input 
                type="time"
                value={availabilitySchedule.weekdays?.[day]?.end || '17:00'}
                onChange={(e) => {
                  const newSchedule = { ...availabilitySchedule };
                  if (!newSchedule.weekdays) newSchedule.weekdays = {};
                  if (!newSchedule.weekdays[day]) newSchedule.weekdays[day] = {};
                  newSchedule.weekdays[day].end = e.target.value;
                  setValue('availability_schedule', newSchedule);
                }}
                disabled={!availabilitySchedule.weekdays?.[day]?.available}
              />
            </div>
          ))}
        </div>
      </div>
      
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.location')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="driver_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.driver')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="additional_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.additionalInfo')}</FormLabel>
            <FormControl>
              <Textarea rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
};

export default VehicleFormStep5;
