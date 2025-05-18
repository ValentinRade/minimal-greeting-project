
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Definieren des Schemas für die Validierung
const companySchema = z.object({
  company_type_id: z.string().min(1, { message: 'Unternehmenstyp muss ausgewählt werden' }),
  name: z.string().min(1, { message: 'Unternehmensname ist erforderlich' }),
  legal_form_id: z.string().min(1, { message: 'Rechtsform muss ausgewählt werden' }),
  street: z.string().min(1, { message: 'Straße ist erforderlich' }),
  postal_code: z.string().min(5, { message: 'PLZ muss mindestens 5 Zeichen haben' }),
  city: z.string().min(1, { message: 'Stadt ist erforderlich' }),
  country: z.string().min(1, { message: 'Land ist erforderlich' }).default('Deutschland'),
  vat_id: z.string().optional(),
  tax_number: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

type CompanyType = {
  id: number;
  name: string;
};

type LegalForm = {
  id: number;
  name: string;
};

const CreateCompany = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [legalForms, setLegalForms] = useState<LegalForm[]>([]);

  const { register, handleSubmit, control, formState: { errors } } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      country: 'Deutschland',
    },
  });

  useEffect(() => {
    // Überprüfen, ob der Benutzer bereits ein Unternehmen hat
    const checkExistingCompany = async () => {
      if (!user) return;

      try {
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingCompany) {
          // Wenn bereits ein Unternehmen existiert, zur Hauptseite weiterleiten
          navigate('/');
        }
      } catch (error) {
        console.error('Fehler beim Prüfen des existierenden Unternehmens:', error);
      }
    };

    // Laden der Unternehmenstypen
    const fetchCompanyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('company_types')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setCompanyTypes(data);
      } catch (error: any) {
        console.error('Fehler beim Laden der Unternehmenstypen:', error.message);
      }
    };

    // Laden der Rechtsformen
    const fetchLegalForms = async () => {
      try {
        const { data, error } = await supabase
          .from('company_legal_forms')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setLegalForms(data);
      } catch (error: any) {
        console.error('Fehler beim Laden der Rechtsformen:', error.message);
      }
    };

    checkExistingCompany();
    fetchCompanyTypes();
    fetchLegalForms();
  }, [user, navigate]);

  const onSubmit = async (data: CompanyFormValues) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Konvertiere die String-IDs zu Zahlen für die Datenbank
      const companyData = {
        ...data,
        company_type_id: parseInt(data.company_type_id),
        legal_form_id: parseInt(data.legal_form_id),
        user_id: user.id,
        // Ensure all required fields are present and non-optional
        name: data.name,
        street: data.street,
        postal_code: data.postal_code,
        city: data.city,
        country: data.country || 'Deutschland'
      };

      const { error } = await supabase.from('companies').insert([companyData]);

      if (error) throw error;

      toast({
        title: t('company.success'),
        description: t('company.successMessage'),
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: t('company.error'),
        description: `${t('company.errorMessage')}${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{t('company.create')}</CardTitle>
          <CardDescription>
            {t('company.pleaseProvide')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_type_id">{t('company.companyType')}</Label>
              <Controller
                name="company_type_id"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('company.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.company_type_id && (
                <p className="text-sm text-red-500">{errors.company_type_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t('company.companyName')}</Label>
              <Input 
                id="name"
                {...register('name')}
                placeholder="Firmenname GmbH"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="legal_form_id">{t('company.legalForm')}</Label>
              <Controller
                name="legal_form_id"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('company.selectLegalForm')} />
                    </SelectTrigger>
                    <SelectContent>
                      {legalForms.map((form) => (
                        <SelectItem key={form.id} value={form.id.toString()}>
                          {form.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.legal_form_id && (
                <p className="text-sm text-red-500">{errors.legal_form_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">{t('company.street')}</Label>
              <Input 
                id="street"
                {...register('street')}
                placeholder="Musterstraße 123"
              />
              {errors.street && (
                <p className="text-sm text-red-500">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">{t('company.postalCode')}</Label>
                <Input 
                  id="postal_code"
                  {...register('postal_code')}
                  placeholder="12345"
                />
                {errors.postal_code && (
                  <p className="text-sm text-red-500">{errors.postal_code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">{t('company.city')}</Label>
                <Input 
                  id="city"
                  {...register('city')}
                  placeholder="Berlin"
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">{t('company.country')}</Label>
              <Input 
                id="country"
                {...register('country')}
                placeholder="Deutschland"
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat_id">{t('company.vatId')}</Label>
              <Input 
                id="vat_id"
                {...register('vat_id')}
                placeholder="DE123456789"
              />
              {errors.vat_id && (
                <p className="text-sm text-red-500">{errors.vat_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_number">{t('company.taxNumber')}</Label>
              <Input 
                id="tax_number"
                {...register('tax_number')}
                placeholder="123/456/78901"
              />
              {errors.tax_number && (
                <p className="text-sm text-red-500">{errors.tax_number.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('company.creating') : t('company.create')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateCompany;
