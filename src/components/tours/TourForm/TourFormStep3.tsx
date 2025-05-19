
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourFormStep3Props {
  form: any;
}

const TourFormStep3: React.FC<TourFormStep3Props> = ({ form }) => {
  const { t } = useTranslation();
  const days = [
    { value: 0, label: t('common.sunday') },
    { value: 1, label: t('common.monday') },
    { value: 2, label: t('common.tuesday') },
    { value: 3, label: t('common.wednesday') },
    { value: 4, label: t('common.thursday') },
    { value: 5, label: t('common.friday') },
    { value: 6, label: t('common.saturday') },
  ];

  // Helper function to format dates safely
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      console.error("Invalid date format:", dateString, error);
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('tours.formLabels.startDate')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      formatDate(field.value)
                    ) : (
                      <span>{t('tours.formPlaceholders.selectDate')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => date && field.onChange(format(date, 'yyyy-MM-dd'))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              {t('tours.formDescriptions.startDate')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('tours.formLabels.endDate')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      formatDate(field.value)
                    ) : (
                      <span>{t('tours.formPlaceholders.selectDate')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => date && field.onChange(format(date, 'yyyy-MM-dd'))}
                  disabled={(date) => {
                    const startDate = form.getValues('start_date');
                    if (!startDate) return false;
                    return date < new Date(startDate);
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              {t('tours.formDescriptions.endDate')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="border rounded-md p-4">
        <h3 className="font-medium text-lg mb-4">{t('tours.weeklySchedule')}</h3>
        
        {days.map((day) => (
          <div key={day.value} className="mb-6 pb-4 border-b last:border-0">
            <div className="flex items-center mb-2">
              <FormField
                control={form.control}
                name={`schedules.${day.value}.is_active`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-medium">
                      {day.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch(`schedules.${day.value}.is_active`) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8">
                <FormField
                  control={form.control}
                  name={`schedules.${day.value}.start_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('tours.formLabels.startTime')}</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          value={field.value || ''}
                          onChange={(e) => {
                            // Only set value when it's not empty
                            if (e.target.value) {
                              field.onChange(e.target.value);
                            } else {
                              field.onChange(null);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`schedules.${day.value}.loading_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('tours.formLabels.loadingTime')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('tours.formPlaceholders.minutes')}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : null;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('tours.formDescriptions.minutes')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`schedules.${day.value}.working_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('tours.formLabels.workingTime')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('tours.formPlaceholders.minutes')}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : null;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('tours.formDescriptions.minutes')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourFormStep3;
