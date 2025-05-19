
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface TourFormStep2Props {
  form: any;
}

const TourFormStep2: React.FC<TourFormStep2Props> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="start_location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.startLocation')}</FormLabel>
            <FormControl>
              <Input placeholder={t('tours.formPlaceholders.startLocation')} {...field} />
            </FormControl>
            <FormDescription>
              {t('tours.formDescriptions.startLocation')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end_location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.endLocation')}</FormLabel>
            <FormControl>
              <Input placeholder={t('tours.formPlaceholders.endLocation')} {...field} />
            </FormControl>
            <FormDescription>
              {t('tours.formDescriptions.endLocation')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="total_distance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.totalDistance')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('tours.formPlaceholders.totalDistance')} 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              {t('tours.formDescriptions.totalDistance')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cargo_weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.cargoWeight')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('tours.formPlaceholders.cargoWeight')} 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              {t('tours.formDescriptions.cargoWeight')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cargo_volume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.cargoVolume')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('tours.formPlaceholders.cargoVolume')} 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              {t('tours.formDescriptions.cargoVolume')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cargo_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.formLabels.cargoDescription')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('tours.formPlaceholders.cargoDescription')} 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              {t('tours.formDescriptions.cargoDescription')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="is_palletized"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-md border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('tours.formLabels.isPalletized')}
                </FormLabel>
                <FormDescription>
                  {t('tours.formDescriptions.isPalletized')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_hazardous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-md border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('tours.formLabels.isHazardous')}
                </FormLabel>
                <FormDescription>
                  {t('tours.formDescriptions.isHazardous')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="temperature_sensitive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-md border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('tours.formLabels.temperatureSensitive')}
                </FormLabel>
                <FormDescription>
                  {t('tours.formDescriptions.temperatureSensitive')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pallet_exchange"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-md border">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('tours.formLabels.palletExchange')}
                </FormLabel>
                <FormDescription>
                  {t('tours.formDescriptions.palletExchange')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default TourFormStep2;
