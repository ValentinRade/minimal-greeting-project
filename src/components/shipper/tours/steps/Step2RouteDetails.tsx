
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { TourStop } from '@/types/tour';
import { Badge } from '@/components/ui/badge';

interface Step2RouteDetailsProps {
  form: UseFormReturn<any>;
}

const Step2RouteDetails: React.FC<Step2RouteDetailsProps> = ({ form }) => {
  const { t } = useTranslation();
  const [newStopLocation, setNewStopLocation] = useState('');
  
  // Get stops from form
  const stops = form.watch('stops') || [];

  const addStop = () => {
    if (!newStopLocation.trim()) return;
    
    const newStops = [...stops];
    newStops.push({
      location: newStopLocation,
      order: newStops.length + 1
    });
    
    form.setValue('stops', newStops);
    setNewStopLocation('');
  };
  
  const removeStop = (index: number) => {
    const newStops = [...stops];
    newStops.splice(index, 1);
    
    // Update order for remaining stops
    newStops.forEach((stop, idx) => {
      stop.order = idx + 1;
    });
    
    form.setValue('stops', newStops);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="start_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('tours.form.startLocation')}</FormLabel>
              <FormControl>
                <Input placeholder={t('tours.form.locationPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('tours.form.endLocation')}</FormLabel>
              <FormControl>
                <Input placeholder={t('tours.form.locationPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="total_distance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.form.totalDistance')}</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="0" 
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              {t('tours.form.totalDistanceDescription')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('tours.form.cargoDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="cargo_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tours.form.cargoWeight')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo_volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tours.form.cargoVolume')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="cargo_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('tours.form.cargoDescription')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('tours.form.cargoDescriptionPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <FormField
              control={form.control}
              name="is_palletized"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('tours.form.isPalletized')}
                    </FormLabel>
                    <FormDescription>
                      {t('tours.form.isPalletizedDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_hazardous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('tours.form.isDangerous')}
                    </FormLabel>
                    <FormDescription>
                      {t('tours.form.isDangerousDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="temperature_sensitive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('tours.form.temperatureSensitive')}
                    </FormLabel>
                    <FormDescription>
                      {t('tours.form.temperatureSensitiveDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pallet_exchange"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('tours.form.palletExchange')}
                    </FormLabel>
                    <FormDescription>
                      {t('tours.form.palletExchangeDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('tours.form.stops')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {stops.length > 0 && (
              <div className="space-y-2">
                {stops.map((stop: TourStop, index: number) => (
                  <div key={index} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{stop.order}</Badge>
                      <span>{stop.location}</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeStop(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder={t('tours.form.addStopPlaceholder')}
                value={newStopLocation}
                onChange={(e) => setNewStopLocation(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addStop}
                disabled={!newStopLocation.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('tours.form.addStop')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2RouteDetails;
