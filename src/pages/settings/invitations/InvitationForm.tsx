
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDays } from 'date-fns';
import { Database } from '@/integrations/supabase/types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

// Define type for company role using the Database type
type CompanyRole = Database['public']['Enums']['company_role'];

const inviteFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(['company_admin', 'logistics_manager', 'finance_manager', 'employee', 'driver'] as const),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InvitationFormProps {
  onInvitationSent: () => void;
}

const InvitationForm = ({ onInvitationSent }: InvitationFormProps) => {
  const { t } = useTranslation();
  const { company, user } = useAuth();
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<CompanyRole[]>([]);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: undefined,
    },
  });

  React.useEffect(() => {
    if (company) {
      setAvailableRoles(determineAvailableRoles());
    }
  }, [company]);

  const determineAvailableRoles = (): CompanyRole[] => {
    if (!company) return [];

    // For company type 1 (subcontractor)
    if (company.company_type_id === 1) {
      return ['company_admin', 'logistics_manager', 'finance_manager', 'employee', 'driver'];
    }
    // For company type 2 (shipper)
    else if (company.company_type_id === 2) {
      return ['company_admin', 'logistics_manager', 'finance_manager', 'employee'];
    }
    
    return [];
  };

  const onSubmit = async (values: InviteFormValues) => {
    if (!company || !user) {
      toast({
        title: t('settings.inviteError'),
        description: 'Company or user information is missing',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Creating invitation with values:', values);
      
      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      
      // Set expiration date to 7 days from now
      const expiresAt = addDays(new Date(), 7).toISOString();
      
      // Use the typed role value from the form
      const role = values.role as CompanyRole;
      
      const { data, error } = await supabase
        .from('company_invitations')
        .insert({
          company_id: company.id,
          email: values.email,
          role: role,
          invited_by: user.id,
          token,
          expires_at: expiresAt,
          invited_at: new Date().toISOString() // Explicitly set invited_at to current time
        });
      
      if (error) {
        console.error('Error creating invitation:', error);
        throw error;
      }
      
      toast({
        title: t('settings.invitationSent'),
        description: t('settings.invitationSentDesc'),
      });
      
      form.reset();
      setInviteDialogOpen(false);
      onInvitationSent();
    } catch (error: any) {
      console.error('Error in onSubmit:', error);
      toast({
        title: t('settings.inviteError'),
        description: error.message || 'An error occurred while sending the invitation',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleTranslation = (role: string) => {
    switch (role) {
      case 'company_admin':
        return t('roles.companyAdmin');
      case 'logistics_manager':
        return t('roles.logisticsManager');
      case 'finance_manager':
        return t('roles.financeManager');
      case 'employee':
        return t('roles.employee');
      case 'driver':
        return t('roles.driver');
      default:
        return role;
    }
  };

  return (
    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('settings.inviteUser')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.inviteUser')}</DialogTitle>
          <DialogDescription>{t('settings.inviteUserDesc')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.role')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('settings.selectRole')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {getRoleTranslation(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('settings.sending') : t('settings.sendInvitation')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationForm;
