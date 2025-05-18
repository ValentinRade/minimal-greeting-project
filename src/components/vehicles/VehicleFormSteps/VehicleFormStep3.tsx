
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload, File } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { VehicleFormData } from '../VehicleForm';

const VehicleFormStep3 = () => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext<VehicleFormData>();
  const { company } = useAuth();
  const [uploadingReport, setUploadingReport] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const inspectionReportUrl = watch('inspection_report_url');
  const reportFileName = inspectionReportUrl?.split('/').pop() || '';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;

    try {
      setUploadingReport(true);
      setUploadError(null);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${company.id}/inspection-reports/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('vehicle_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle_documents')
        .getPublicUrl(filePath);

      setValue('inspection_report_url', publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError((error as Error).message);
    } finally {
      setUploadingReport(false);
      setUploadProgress(0);
    }
  };

  return (
    <CardContent className="space-y-6">
      <FormField
        control={control}
        name="maintenance_interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.form.maintenanceInterval')}</FormLabel>
            <FormControl>
              <Input 
                type="number"
                {...field}
                value={field.value === null ? '' : field.value}
                onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
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
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>{t('common.pickDate')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => 
                    field.onChange(date ? format(date, 'yyyy-MM-dd') : null)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormItem>
        <FormLabel>{t('vehicles.form.inspectionReport')}</FormLabel>
        <div className="grid grid-cols-1 gap-4">
          <div className="mt-2">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="inspection-report-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">{t('vehicles.form.uploadInspectionReport')}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX {t('common.upTo')} 10MB
                  </p>
                </div>
                <Input 
                  id="inspection-report-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingReport}
                />
              </label>
            </div>

            {uploadingReport && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {uploadError && (
              <p className="text-sm text-destructive mt-2">
                {uploadError}
              </p>
            )}

            {inspectionReportUrl && (
              <div className="flex items-center mt-4 p-3 bg-muted rounded-md">
                <File className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium flex-1 truncate">
                  {reportFileName}
                </span>
                <a 
                  href={inspectionReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline ml-2"
                >
                  {t('common.view')}
                </a>
              </div>
            )}
          </div>
        </div>
      </FormItem>
    </CardContent>
  );
};

export default VehicleFormStep3;
