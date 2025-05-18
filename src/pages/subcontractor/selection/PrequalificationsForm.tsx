
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  pq_kep: z.boolean().optional(),
  bna_registration: z.boolean().optional(),
  adr_certificate: z.boolean().optional(),
  adr_1000_points: z.boolean().optional(),
  eu_license: z.boolean().optional(),
  other_qualification: z.boolean().optional(),
  other_qualification_name: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PrequalificationsForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { company } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pq_kep: false,
      bna_registration: false,
      adr_certificate: false,
      adr_1000_points: false,
      eu_license: false,
      other_qualification: false,
      other_qualification_name: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!company?.id) return;
    
    try {
      // Using the proper table name from the newly created database table
      const { error } = await supabase
        .from('subcontractor_prequalifications')
        .upsert({
          company_id: company.id,
          pq_kep: values.pq_kep || false,
          bna_registration: values.bna_registration || false,
          adr_certificate: values.adr_certificate || false,
          adr_1000_points: values.adr_1000_points || false,
          eu_license: values.eu_license || false,
          other_qualification: values.other_qualification || false,
          other_qualification_name: values.other_qualification ? values.other_qualification_name : null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'company_id',
        });
        
      if (error) throw error;
      
      toast({
        title: t('prequalifications.saveSuccess', 'Erfolgreich gespeichert'),
        description: t('prequalifications.saveSuccessMessage', 'Ihre Präqualifikationen wurden erfolgreich aktualisiert.'),
      });
      
      navigate('/dashboard/subcontractor/selection/prequalifications');
    } catch (error) {
      console.error('Error saving prequalifications:', error);
      toast({
        title: t('prequalifications.saveError', 'Fehler beim Speichern'),
        description: t('prequalifications.saveErrorMessage', 'Ihre Präqualifikationen konnten nicht gespeichert werden.'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('prequalifications.edit', 'Präqualifikationen bearbeiten')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('prequalifications.formTitle', 'Präqualifikationen angeben')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pq_kep"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>PQ KEP</FormLabel>
                      <FormDescription>
                        {t('prequalifications.pqKepDescription', 'Präqualifikation für Kurier-, Express- und Paketdienste')}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bna_registration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('prequalifications.bnaRegistration', 'Registrierung bei der Bundesnetzagentur (KEP)')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adr_certificate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('prequalifications.adrCertificate', 'ADR-Schein')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adr_1000_points"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('prequalifications.adr1000', 'ADR bis 1000 Punkte')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eu_license"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('prequalifications.euLicense', 'EU-Lizenz')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="other_qualification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('prequalifications.other', 'Weitere Präqualifikation')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch('other_qualification') && (
                <FormField
                  control={form.control}
                  name="other_qualification_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('prequalifications.otherName', 'Bezeichnung der weiteren Präqualifikation')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard/subcontractor/selection/prequalifications')}
                >
                  {t('common.cancel', 'Abbrechen')}
                </Button>
                <Button type="submit">
                  {t('common.save', 'Speichern')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrequalificationsForm;
