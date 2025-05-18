
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const CompanySettings = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [vatId, setVatId] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setStreet(company.street || '');
      setPostalCode(company.postal_code || '');
      setCity(company.city || '');
      setCountry(company.country || 'Deutschland');
      setVatId(company.vat_id || '');
      setTaxNumber(company.tax_number || '');
    }
  }, [company]);
  
  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name,
          street,
          postal_code: postalCode,
          city,
          country,
          vat_id: vatId || null,
          tax_number: taxNumber || null
        })
        .eq('id', company.id);
      
      if (error) throw error;
      
      toast({
        title: t('settings.companyUpdated'),
        description: t('settings.companyUpdateSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('settings.updateError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };
  
  if (!company) {
    return null;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('settings.companyProfile')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.companyInfo')}</CardTitle>
          <CardDescription>{t('settings.companyInfoDesc')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateCompany}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('companyInfo.name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">{t('settings.street')}</Label>
                <Input
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t('settings.postalCode')}</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">{t('settings.city')}</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">{t('settings.country')}</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vatId">{t('companyInfo.vatId')}</Label>
                <Input
                  id="vatId"
                  value={vatId || ''}
                  onChange={(e) => setVatId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxNumber">{t('companyInfo.taxNumber')}</Label>
                <Input
                  id="taxNumber"
                  value={taxNumber || ''}
                  onChange={(e) => setTaxNumber(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={updating}
            >
              {updating ? t('settings.updating') : t('settings.updateCompany')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanySettings;
