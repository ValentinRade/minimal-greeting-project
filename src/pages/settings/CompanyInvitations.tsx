
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, addDays, isPast } from 'date-fns';
import { UserPlus, RefreshCw, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const inviteFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.string(),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const CompanyInvitations = () => {
  const { t } = useTranslation();
  const { company, user } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: '',
    },
  });

  useEffect(() => {
    if (company) {
      fetchInvitations();
      setAvailableRoles(determineAvailableRoles());
    }
  }, [company]);

  const determineAvailableRoles = () => {
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

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('company_invitations')
        .select('*')
        .eq('company_id', company?.id)
        .order('invited_at', { ascending: false });
      
      if (error) throw error;
      
      setInvitations(data || []);
    } catch (error: any) {
      toast({
        title: t('settings.fetchError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: InviteFormValues) => {
    if (!company || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      
      // Set expiration date to 7 days from now
      const expiresAt = addDays(new Date(), 7).toISOString();
      
      const { data, error } = await supabase
        .from('company_invitations')
        .insert({
          company_id: company.id,
          email: values.email,
          role: values.role,
          invited_by: user.id,
          token,
          expires_at: expiresAt
        });
      
      if (error) throw error;
      
      toast({
        title: t('settings.invitationSent'),
        description: t('settings.invitationSentDesc'),
      });
      
      form.reset();
      setInviteDialogOpen(false);
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: t('settings.inviteError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('company_invitations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: t('settings.invitationDeleted'),
        description: t('settings.invitationDeletedDesc'),
      });
      
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: t('settings.deleteError'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleResendInvitation = async (invitation: any) => {
    try {
      // Update the expiration date to 7 days from now
      const expiresAt = addDays(new Date(), 7).toISOString();
      
      const { error } = await supabase
        .from('company_invitations')
        .update({
          invited_at: new Date().toISOString(),
          expires_at: expiresAt
        })
        .eq('id', invitation.id);
      
      if (error) throw error;
      
      toast({
        title: t('settings.invitationResent'),
        description: t('settings.invitationResentDesc'),
      });
      
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: t('settings.resendError'),
        description: error.message,
        variant: 'destructive'
      });
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

  const getInvitationStatus = (invitation: any) => {
    if (invitation.accepted_at) {
      return {
        label: t('settings.accepted'),
        color: 'bg-green-500'
      };
    }
    
    if (isPast(new Date(invitation.expires_at))) {
      return {
        label: t('settings.expired'),
        color: 'bg-red-500'
      };
    }
    
    return {
      label: t('settings.pending'),
      color: 'bg-yellow-500'
    };
  };

  // Return placeholder if company is not loaded
  if (!company) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('settings.invitations')}</h1>
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
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.companyInvitations')}</CardTitle>
          <CardDescription>{t('settings.companyInvitationsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">{t('loading')}</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">{t('settings.noInvitations')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('settings.email')}</TableHead>
                  <TableHead>{t('settings.role')}</TableHead>
                  <TableHead>{t('settings.status')}</TableHead>
                  <TableHead>{t('settings.sentAt')}</TableHead>
                  <TableHead>{t('settings.expiresAt')}</TableHead>
                  <TableHead className="text-right">{t('settings.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const status = getInvitationStatus(invitation);
                  
                  return (
                    <TableRow key={invitation.id}>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell>{getRoleTranslation(invitation.role)}</TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {invitation.invited_at 
                          ? formatDistanceToNow(new Date(invitation.invited_at), { addSuffix: true })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!invitation.accepted_at && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleResendInvitation(invitation)}
                                title={t('settings.resendInvitation')}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteInvitation(invitation.id)}
                                title={t('settings.deleteInvitation')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyInvitations;
