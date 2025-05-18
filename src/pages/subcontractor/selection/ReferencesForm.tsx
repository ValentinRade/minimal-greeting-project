
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const INDUSTRY_OPTIONS = [
  { value: 'healthcare', labelKey: 'Gesundheit' },
  { value: 'food', labelKey: 'Lebensmittel' },
  { value: 'beverages', labelKey: 'Getränke & Tabakwaren' },
  { value: 'wholesale', labelKey: 'Großhandel' },
  { value: 'logistics', labelKey: 'Spedition' },
];

const CATEGORY_OPTIONS = [
  "Süßwarenindustrie", "Lebensmittel", "Fleischwaren", "Landhandel", "Sanitärgrosshandel", 
  "Autoservice", "Logistik", "Speditionen", "Kurierdienste", "Reedereien", "Busunternehmen", 
  "Abfallentsorgung", "Recycling", "Versorger", "Hygieneservice", "Discounter", "Cash-and-Carry", 
  "Kliniken", "Pflegeheime", "Brotfabriken", "Brauereien", "Getränkeindustrie", "Molkereien", 
  "Großhandel-Technik", "Stahlgroßhändler", "Großverbraucher", "Hafenbetriebe", "Möbelfracht", 
  "Bäckereien", "Getränkemärkte", "Optiker", "Labore", "Pflegedienste", "Obst & Gemüse", 
  "Mühlenbetriebe", "TK-Hersteller", "Fischfabriken", "Feinkosthersteller", "Gewürzhersteller", 
  "Geflügelbetriebe", "Tierfutter", "Weinkellereien", "Elektrogroßhandel", "Baustoffhändler", 
  "Papiergroßhändler", "Autoteile-Handel", "Pharmagroßhändler", "Chemiegroßhandel", "GFGH", 
  "Großhandel-Medizintechnik", "Großhandel-Sonstige", "LKW-Service", "Abbruchunternehmen", 
  "Regenerative-Energien", "Reha-Kliniken", "Dentallabore", "Sanitärhäuser", "Spirituosen", 
  "Agrarbetriebe", "Friseurgroßhandel", "Gastroausstatter", "Mineraloelhändler", "Blumengroßhandel", 
  "Taxiunternehmen", "Reformhäuser", "Feinkost", "Großhandel Reinigung", "Landtechnik"
];

const formSchema = z.object({
  allowPublication: z.boolean().default(false),
  customerName: z.string().optional(),
  industry: z.string().min(1, { message: "Industry is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  untilToday: z.boolean().default(false),
  customerFeedback: z.instanceof(FileList).optional(),
  consent: z.boolean().refine(val => val, {
    message: "You must agree to the terms",
  }),
  anonymize: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const ReferencesForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allowPublication: false,
      customerName: "",
      industry: "",
      category: "",
      untilToday: false,
      consent: false,
      anonymize: false,
    },
  });

  const allowPublication = form.watch('allowPublication');
  const untilToday = form.watch('untilToday');

  useEffect(() => {
    // If editing an existing reference, fetch the data
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
          // Parse dates from string to Date objects
          const startDate = data.start_date ? new Date(data.start_date) : undefined;
          const endDate = data.end_date ? new Date(data.end_date) : undefined;
          
          form.reset({
            allowPublication: data.allow_publication,
            customerName: data.customer_name || "",
            industry: data.industry || "",
            category: data.category || "",
            startDate: startDate,
            endDate: endDate,
            untilToday: data.until_today,
            consent: true, // We assume consent was given when creating
            anonymize: data.anonymize,
          });
          
          setFileUrl(data.customer_feedback_url || null);
        }
      } catch (error) {
        console.error('Error fetching reference:', error);
        toast.error(t('references.fetchError'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchReference();
  }, [id, form, t]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for saving
      const referenceData = {
        allow_publication: values.allowPublication,
        customer_name: values.allowPublication ? values.customerName : null,
        industry: values.industry,
        category: values.category,
        start_date: values.startDate.toISOString(),
        end_date: values.untilToday ? null : values.endDate?.toISOString(),
        until_today: values.untilToday,
        anonymize: values.anonymize,
      };

      let result;
      
      // Update or create reference
      if (id) {
        result = await supabase
          .from('subcontractor_references')
          .update(referenceData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('subcontractor_references')
          .insert([referenceData]);
      }

      if (result.error) throw result.error;
      
      // Handle file upload if provided
      const fileList = values.customerFeedback;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${id || result.data[0].id}-feedback.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('reference_documents')
          .upload(fileName, file, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        // Update reference with file URL
        const { error: updateError } = await supabase
          .from('subcontractor_references')
          .update({ customer_feedback_url: fileName })
          .eq('id', id || result.data[0].id);
          
        if (updateError) throw updateError;
      }
      
      toast.success(
        id ? t('references.updateSuccess') : t('references.saveSuccess'),
        {
          description: id 
            ? t('references.updateSuccessMessage') 
            : t('references.saveSuccessMessage'),
        }
      );
      
      navigate('/dashboard/subcontractor/selection/references');
    } catch (error) {
      console.error('Error saving reference:', error);
      toast.error(t('references.saveError'), {
        description: t('references.saveErrorMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t('references.loading')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <p>{t('common.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? t('references.editReference') : t('references.formTitle')}</CardTitle>
        <CardDescription>{t('references.formDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Publication Toggle */}
              <FormField
                control={form.control}
                name="allowPublication"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('references.publication')}</FormLabel>
                      <FormDescription>
                        {t('references.allowPublication')}
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

              {/* Customer Name */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('references.customerName')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!allowPublication}
                        value={field.value || ""}
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
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('references.selectIndustry')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((industry) => (
                          <SelectItem key={industry.value} value={industry.value}>
                            {industry.labelKey}
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
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('references.selectCategory')} />
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
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t('references.orderPeriod')}</h3>
                
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
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t('references.pickDate')}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end gap-4">
                  {/* End Date */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t('references.endDate')}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={untilToday}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{t('references.pickDate')}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={untilToday}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Until Today Checkbox */}
                  <FormField
                    control={form.control}
                    name="untilToday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t('references.untilToday')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Customer Feedback */}
              <FormField
                control={form.control}
                name="customerFeedback"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>{t('references.customerFeedback')}</FormLabel>
                    {fileUrl && (
                      <div className="mb-2 text-sm">
                        <a 
                          href={`https://ryshjxguqwhlqhqievgx.supabase.co/storage/v1/object/public/reference_documents/${fileUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {t('references.currentFile')}
                        </a>
                      </div>
                    )}
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          onChange(e.target.files || null);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('references.uploadDocument')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Privacy and Consent */}
              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="font-medium">{t('references.privacyNotice')}</h3>
                <p className="text-sm text-muted-foreground">{t('references.privacyText')}</p>
                
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t('references.consentLabel')}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="anonymize"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t('references.anonymizeOption')}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/dashboard/subcontractor/selection/references')}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReferencesForm;
