
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Step1VehicleRequirementsProps {
  form: UseFormReturn<any>;
}

const vehicleTypes = [
  { value: '3_5t', label: '3.5t' },
  { value: '7_5t', label: '7.5t' },
  { value: '12t', label: '12t' },
  { value: '40t', label: '40t' },
];

const bodyTypes = [
  { value: 'box', label: 'Box' },
  { value: 'curtain', label: 'Plane/Curtain' },
  { value: 'refrigerated', label: 'Refrigerated/Frigo' },
  { value: 'walking_floor', label: 'Schubboden/Walking Floor' },
  { value: 'flatbed', label: 'Flatbed' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'other', label: 'Other' },
];

const certificates = [
  { id: 'adr', label: 'ADR Certificate' },
  { id: 'eu_license', label: 'EU License' },
  { id: 'bna', label: 'BNA Registration' },
  { id: 'other', label: 'Other' },
];

const Step1VehicleRequirements: React.FC<Step1VehicleRequirementsProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('tours.form.title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('tours.form.titlePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>
                {t('tours.form.titleDescription')}
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
              <FormLabel>{t('tours.form.vehicleType')}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('tours.form.selectVehicleType')} />
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
                {t('tours.form.vehicleTypeDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="body_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.form.bodyType')}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('tours.form.selectBodyType')} />
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
              {t('tours.form.bodyTypeDescription')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="certificates"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>{t('tours.form.certificates')}</FormLabel>
              <FormDescription>
                {t('tours.form.certificatesDescription')}
              </FormDescription>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {certificates.map((certificate) => (
                <FormField
                  key={certificate.id}
                  control={form.control}
                  name="certificates"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={certificate.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(certificate.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              return checked
                                ? field.onChange([...current, certificate.id])
                                : field.onChange(current.filter((value: string) => value !== certificate.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {certificate.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step1VehicleRequirements;
