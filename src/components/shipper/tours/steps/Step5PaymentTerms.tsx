
import React from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Step5PaymentTermsProps {
  form: UseFormReturn<any>;
}

const Step5PaymentTerms: React.FC<Step5PaymentTermsProps> = ({ form }) => {
  const { t } = useTranslation();
  
  const billingTypes = [
    { id: 'invoice', label: t('tours.form.invoice') },
    { id: 'credit_note', label: t('tours.form.creditNote') },
  ];
  
  const timeUnits = [
    { value: 'days', label: t('tours.form.days') },
    { value: 'weeks', label: t('tours.form.weeks') },
    { value: 'months', label: t('tours.form.months') },
  ];
  
  const currencies = [
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CHF', label: 'CHF' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('tours.form.billingType')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="billing_type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {billingTypes.map((type) => (
                      <FormItem key={type.id} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={type.id} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {type.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  {t('tours.form.billingTypeDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="border rounded-md p-6">
        <h3 className="text-lg font-medium mb-4">{t('tours.form.paymentTerm')}</h3>
        <div className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="payment_term_value"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t('tours.form.paymentTermValue')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="14"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_term_unit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t('tours.form.paymentTermUnit')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('tours.form.selectUnit')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('tours.form.currency')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('tours.form.selectCurrency')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {t('tours.form.currencyDescription')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step5PaymentTerms;
