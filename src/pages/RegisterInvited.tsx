
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface InvitationData {
  id: string;
  company: {
    id: string;
    name: string;
    company_type_id: number;
  };
  email: string;
  role: string;
  token: string;
}

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const RegisterInvited = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshCompanyData } = useAuth();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
    },
  });
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    if (!token) {
      setError('Invalid invitation link.');
      setLoading(false);
      return;
    }
    
    const fetchInvitation = async (token: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/get-invitation?token=${token}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch invitation data.');
        }
        
        const data = await response.json();
        
        if (data && data.invitation) {
          setInvitation(data.invitation);
        } else {
          setError('Invitation not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch invitation.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvitation(token);
  }, [location.search]);
  
  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    if (!invitation) {
      setError('Please provide all required information.');
      return;
    }
    
    setRegisterLoading(true);
    setError(null);
    
    try {
      // First update the user's profile with the new information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone || '',
        })
        .eq('id', user?.id);

      if (profileError) {
        throw new Error(profileError.message || 'Failed to update profile');
      }
      
      // Then register the user with the company
      const registerEndpoint = '/api/register-invited-user';
      
      const registerData = {
        userId: user?.id,
        invitationId: invitation.id,
        companyId: invitation.company.id,
        role: invitation.role,
        invitedBy: invitation.company.id, // Assuming company ID as inviter
        invitedAt: new Date().toISOString()
      };

      const response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }
      
      setRegisterSuccess(true);
      toast({
        title: t('auth.success'),
        description: t('auth.registerSuccess'),
      });
      
      // Refresh the company data after successful registration
      await refreshCompanyData();
      
      // Redirect to the dashboard after short delay
      setTimeout(() => {
        if (invitation.company.company_type_id === 2) {
          navigate('/dashboard/shipper');
        } else {
          navigate('/dashboard/subcontractor');
        }
      }, 1500);
      
    } catch (error: any) {
      setError(error.message || 'Registration failed.');
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setRegisterLoading(false);
    }
  };
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
  }
  
  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;
  }
  
  if (registerSuccess) {
    return <div className="flex min-h-screen items-center justify-center">{t('auth.registerSuccess')}</div>;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.registerInvited')}</CardTitle>
          <CardDescription>{t('auth.completeRegistration')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invitation && (
            <div className="space-y-4">
              <p>{t('auth.youAreInvited')}</p>
              <p>
                {t('auth.toCompany')}: <strong>{invitation.company.name}</strong>
              </p>
              <p>
                {t('auth.asRole')}: <strong>{invitation.role}</strong>
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.firstName')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.lastName')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.phone')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.password')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerLoading}
                  >
                    {registerLoading ? t('loading') : t('auth.register')}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterInvited;
