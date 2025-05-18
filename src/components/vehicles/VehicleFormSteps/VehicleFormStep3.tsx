
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

const VehicleFormStep3: React.FC = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const { control, setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const inspectionReportUrl = watch('inspection_report_url');
  const lastInspection = watch('last_inspection');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !company) {
      return;
    }

    try {
      setIsUploading(true);

      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${company.id}/documents/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('vehicle_documents')
        .upload(filePath, file, {
          cacheControl: '3600'
          // Remove the problematic onUploadProgress property
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('vehicle_documents')
        .getPublicUrl(filePath);

      if (data) {
        setValue('inspection_report_url', data.publicUrl);
        toast.success(t('vehicles.form.fileUploaded'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(t('vehicles.form.fileUploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setValue('inspection_report_url', null);
  };

  return (
    <CardContent className="space-y-4 pt-6">
      <h2 className="text-lg font-semibold mb-4">{t('vehicles.form.maintenanceTitle')}</h2>
      
      <FormField
        control={control}
        name="maintenance_interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.maintenanceInterval')}</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder={t('vehicles.form.maintenanceIntervalPlaceholder')} 
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="last_inspection"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('vehicles.form.lastInspection')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>{t('vehicles.form.selectDate')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="inspection_report_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.inspectionReport')}</FormLabel>
            <div className="mt-2">
              {!inspectionReportUrl ? (
                <div className="flex items-center">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded hover:bg-secondary/80 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{t('vehicles.form.uploadFile')}</span>
                    </div>
                    <Input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && <span className="ml-2 text-sm">{t('common.uploading')}...</span>}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded">
                  <FileText className="h-4 w-4" />
                  <a 
                    href={inspectionReportUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 truncate text-sm text-primary hover:underline"
                  >
                    {t('vehicles.form.viewFile')}
                  </a>
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

    </CardContent>
  );
};

export default VehicleFormStep3;
