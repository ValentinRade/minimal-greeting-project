
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const INDUSTRY_OPTIONS = [
  { value: 'healthcare', labelKey: 'Gesundheit' },
  { value: 'food', labelKey: 'Lebensmittel' },
  { value: 'beverages', labelKey: 'Getränke & Tabakwaren' },
  { value: 'wholesale', labelKey: 'Großhandel' },
  { value: 'forwarding', labelKey: 'Spedition' }
];

const CATEGORY_OPTIONS = [
  'Süßwarenindustrie', 'Lebensmittel', 'Fleischwaren', 'Landhandel', 'Sanitärgrosshandel', 
  'Autoservice', 'Logistik', 'Speditionen', 'Kurierdienste', 'Reedereien', 
  'Busunternehmen', 'Abfallentsorgung', 'Recycling', 'Versorger', 'Hygieneservice', 
  'Discounter', 'Cash-and-Carry', 'Kliniken', 'Pflegeheime', 'Brotfabriken', 
  'Brauereien', 'Getränkeindustrie', 'Molkereien', 'Großhandel-Technik', 'Stahlgroßhändler', 
  'Großverbraucher', 'Hafenbetriebe', 'Möbelfracht', 'Bäckereien', 'Getränkemärkte', 
  'Optiker', 'Labore', 'Pflegedienste', 'Obst & Gemüse', 'Mühlenbetriebe', 
  'TK-Hersteller', 'Fischfabriken', 'Feinkosthersteller', 'Gewürzhersteller', 'Geflügelbetriebe', 
  'Tierfutter', 'Weinkellereien', 'Elektrogroßhandel', 'Baustoffhändler', 'Papiergroßhändler', 
  'Autoteile-Handel', 'Pharmagroßhändler', 'Chemiegroßhandel', 'GFGH', 'Großhandel-Medizintechnik', 
  'Großhandel-Sonstige', 'LKW-Service', 'Abbruchunternehmen', 'Regenerative-Energien', 'Reha-Kliniken', 
  'Dentallabore', 'Sanitärhäuser', 'Spirituosen', 'Agrarbetriebe', 'Friseurgroßhandel', 
  'Gastroausstatter', 'Mineraloelhändler', 'Blumengroßhandel', 'Taxiunternehmen', 'Reformhäuser', 
  'Feinkost', 'Großhandel Reinigung', 'Landtechnik'
];

interface FormValues {
  customerName: string;
  industry: string;
  category: string;
  startDate: Date;
  endDate?: Date;
  untilToday: boolean;
  customerFeedbackFile?: FileList;
  consent: boolean;
  allowPublication: boolean;
  anonymize: boolean;
}

const ReferencesForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { company } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      customerName: '',
      industry: '',
      category: '',
      startDate: new Date(),
      untilToday: false,
      consent: false,
      allowPublication: false,
      anonymize: false
    },
  });

  // Get the current values for conditionally showing fields
  const allowPublication = form.watch('allowPublication');
  const untilToday = form.watch('untilToday');

  useEffect(() => {
    async function fetchReference() {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('subcontractor_references')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          form.reset({
            customerName: data.customer_name || '',
            industry: data.industry || '',
            category: data.category || '',
            startDate: data.start_date ? new Date(data.start_date) : new Date(),
            endDate: data.end_date ? new Date(data.end_date) : undefined,
            untilToday: data.until_today || false,
            consent: true, // If we're editing, we can assume consent was given before
            allowPublication: data.allow_publication || false,
            anonymize: data.anonymize || false
          });

          if (data.customer_feedback_url) {
            setFileUrl(data.customer_feedback_url);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reference:', error);
        toast.error(t('references.saveError'), { 
          description: t('references.saveErrorMessage')
        });
        setIsLoading(false);
      }
    }
    
    fetchReference();
  }, [id, form, t]);

  const onSubmit = async (values: FormValues) => {
    if (!company?.id) {
      toast.error(t('common.error'), {
        description: t('common.noCompanyId'),
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for saving
      const referenceData = {
        company_id: company.id,
        allow_publication: values.allowPublication,
        customer_name: values.allowPublication ? values.customerName : null,
        industry: values.industry,
        category: values.category,
        start_date: values.startDate.toISOString(),
        end_date: (!values.untilToday && values.endDate) ? values.endDate.toISOString() : null,
        until_today: values.untilToday,
        anonymize: values.anonymize && values.allowPublication
      };

      let result;
      
      if (id) {
        // Update existing reference
        result = await supabase
          .from('subcontractor_references')
          .update(referenceData)
          .eq('id', id);
      } else {
        // Create new reference
        result = await supabase
          .from('subcontractor_references')
          .insert(referenceData)
          .select();
      }

      if (result.error) throw result.error;

      // Handle file upload if there's a new file
      const fileList = values.customerFeedbackFile;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${id || result.data?.[0]?.id}-feedback.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('reference_documents')
          .upload(fileName, file, {
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        // Update reference with the file URL
        const { error: updateError } = await supabase
          .from('subcontractor_references')
          .update({ customer_feedback_url: fileName })
          .eq('id', id || result.data?.[0]?.id);
          
        if (updateError) throw updateError;
      }
      
      toast.success(t('references.saveSuccess'), {
        description: t('references.saveSuccessMessage')
      });
      navigate('/dashboard/subcontractor/selection/references');
    } catch (error) {
      console.error('Error saving reference:', error);
      toast.error(t('references.saveError'), {
        description: t('references.saveErrorMessage')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/subcontractor/selection/references')}
          className="flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <h1 className="text-2xl font-bold">{id ? t('references.edit') : t('references.formTitle')}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('references.formTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Publication settings */}
              <div className="border p-4 rounded-md space-y-4 bg-gray-50">
                <h3 className="font-medium text-lg">{t('references.publication')}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowPublication">{t('references.allowPublication')}</Label>
                    <p className="text-sm text-gray-500">
                      {t('references.privacyText')}
                    </p>
                  </div>
                  <Switch 
                    id="allowPublication"
                    checked={form.watch('allowPublication')} 
                    onCheckedChange={(value) => form.setValue('allowPublication', value)}
                  />
                </div>

                {allowPublication && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="anonymize" 
                      checked={form.watch('anonymize')}
                      onCheckedChange={(checked) => 
                        form.setValue('anonymize', checked as boolean)
                      }
                    />
                    <Label htmlFor="anonymize">{t('references.anonymizeOption')}</Label>
                  </div>
                )}
              </div>
              
              {/* Customer Name */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('references.customerName')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('references.customerName')} 
                        {...field} 
                        disabled={!allowPublication || form.watch('anonymize')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('references.industry')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('references.industry')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.labelKey}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('references.category')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('references.category')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Period */}
              <div className="space-y-4">
                <h3 className="font-medium">{t('references.orderPeriod')}</h3>
                
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('references.startDate')}</FormLabel>
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
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => date && field.onChange(date)}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Until Today Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="untilToday" 
                    checked={form.watch('untilToday')}
                    onCheckedChange={(checked) => 
                      form.setValue('untilToday', checked as boolean)
                    }
                  />
                  <Label htmlFor="untilToday">{t('references.untilToday')}</Label>
                </div>
                
                {/* End Date (only show if "Until Today" is not checked) */}
                {!untilToday && (
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('references.endDate')}</FormLabel>
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
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => date && field.onChange(date)}
                              disabled={(date) =>
                                date > new Date() || 
                                date < new Date("1900-01-01") ||
                                (form.getValues('startDate') && date < form.getValues('startDate'))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Customer Feedback File */}
              <FormField
                control={form.control}
                name="customerFeedbackFile"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>{t('references.customerFeedback')}</FormLabel>
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                        <Input 
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files?.length) {
                              onChange(e.target.files);
                            }
                          }}
                          {...field}
                        />
                        {fileUrl && (
                          <p className="text-sm text-gray-500">
                            {t('references.uploadDocument')}: {fileUrl}
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      {t('references.uploadDocument')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Consent Checkbox */}
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md bg-gray-50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t('references.consentLabel')}
                      </FormLabel>
                      <FormDescription>
                        {t('references.privacyNotice')}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting || !form.watch('consent')}>
                {isSubmitting ? t('settings.updating') : t('common.save')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferencesForm;
