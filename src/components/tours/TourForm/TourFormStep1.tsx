
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
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
import { VehicleBodyType } from '@/types/tour';

interface TourFormStep1Props {
  form: any;
}

const TourFormStep1: React.FC<TourFormStep1Props> = ({ form }) => {
  const { t } = useTranslation();

  // Vehicle types
  const vehicleTypes = [
    { value: 'small_transporter', label: t('tours.vehicleTypes.smallTransporter') },
    { value: 'transporter_35t', label: t('tours.vehicleTypes.transporter35t') },
    { value: 'truck_75t', label: t('tours.vehicleTypes.truck75t') },
    { value: 'truck_75t_40t', label: t('tours.vehicleTypes.truck75t40t') },
  ];

  // Body types
  const bodyTypes = [
    { value: 'box', label: t('tours.bodyTypes.box') },
    { value: 'curtain', label: t('tours.bodyTypes.curtain') },
    { value: 'refrigerated', label: t('tours.bodyTypes.refrigerated') },
    { value: 'tank', label: t('tours.bodyTypes.tanker') },
    { value: 'flatbed', label: t('tours.bodyTypes.flatbed') },
    { value: 'other', label: t('tours.bodyTypes.other') },
  ];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.title')}</FormLabel>
            <FormControl>
              <Input placeholder={t('tours.formPlaceholders.title')} {...field} />
            </FormControl>
            <FormDescription>
              {t('tours.formDescriptions.title')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vehicle_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.vehicleType')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('tours.formPlaceholders.vehicleType')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {t('tours.formDescriptions.vehicleType')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="body_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.bodyType')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('tours.formPlaceholders.bodyType')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {bodyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {t('tours.formDescriptions.bodyType')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TourFormStep1;
