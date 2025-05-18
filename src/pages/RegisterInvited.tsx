
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { languages } from '@/i18n/languages';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RegisterInvited = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('Deutsch');
  const [loading, setLoading] = useState(false);
  const [invitationLoading, setInvitationLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Fetch invitation details based on token
  useEffect(() => {
    async function fetchInvitation() {
      if (!token) {
        setError(t('invitation.noToken'));
        setInvitationLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('company_invitations')
          .select('*')
          .eq('token', token)
          .single();

        if (error) throw error;
        
        if (!data) {
          setError(t('invitation.invalidToken'));
          setInvitationLoading(false);
          return;
        }

        // Check if invitation has expired
        if (new Date(data.expires_at) < new Date()) {
          setError(t('invitation.expired'));
          setInvitationLoading(false);
          return;
        }

        // Check if invitation is already accepted
        if (data.accepted_at) {
          setError(t('invitation.alreadyAccepted'));
          setInvitationLoading(false);
          return;
        }

        setInvitation(data);
        setEmail(data.email);
        setInvitationLoading(false);
      } catch (error: any) {
        console.error('Error fetching invitation:', error);
        setError(t('invitation.fetchError'));
        setInvitationLoading(false);
      }
    }

    fetchInvitation();
  }, [token, t]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitation) {
      toast({
        title: t('invitation.invalidInvitation'),
        description: t('invitation.tryAgain'),
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        console.log("User created successfully:", data.user.id);
        
        // 2. Create profile entry manually since trigger might not work immediately
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            language: language
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw profileError;
        }
        console.log("Profile created successfully");
        
        // 3. Create a company_users entry
        const { error: companyUserError } = await supabase
          .from('company_users')
          .insert({
            company_id: invitation.company_id,
            user_id: data.user.id,
            role: invitation.role,
            invited_by: invitation.invited_by,
            invited_at: invitation.invited_at,
            accepted_at: new Date().toISOString()
          });
          
        if (companyUserError) {
          console.error("Company user creation error:", companyUserError);
          throw companyUserError;
        }
        console.log("User added to company successfully");
        
        // 4. Update the invitation as accepted
        const { error: invitationError } = await supabase
          .from('company_invitations')
          .update({
            accepted_at: new Date().toISOString()
          })
          .eq('id', invitation.id);
          
        if (invitationError) {
          console.error("Invitation update error:", invitationError);
          throw invitationError;
        }
        console.log("Invitation marked as accepted");
        
        toast({
          title: t('auth.registrationSuccess'),
          description: t('invitation.accountCreated'),
        });
        
        // 5. Log in the user automatically
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error("Auto-login error:", signInError);
          // Don't throw, just navigate to login page instead
          navigate('/auth');
          return;
        }
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: t('auth.registrationFailed'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (invitationLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="mt-4">{t('loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">{t('invitation.error')}</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate('/auth')}>
              {t('auth.goToLogin')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{t('invitation.register')}</CardTitle>
          <CardDescription className="text-center">
            {t('invitation.joinCompany')} {invitation?.company_name || ''}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t('invitation.emailFromInvitation')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first-name">{t('auth.firstName')}</Label>
              <Input 
                id="first-name"
                placeholder="John" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">{t('auth.lastName')}</Label>
              <Input 
                id="last-name"
                placeholder="Doe" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input 
                id="phone"
                type="tel" 
                placeholder="+1234567890" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">{t('auth.language')}</Label>
              <Select
                value={language}
                onValueChange={(val) => {
                  setLanguage(val);
                  const langObj = languages.find(l => l.name === val);
                  if (langObj) {
                    i18n.changeLanguage(langObj.code);
                  }
                }}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select your language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.name}>
                      {lang.nativeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterInvited;
