import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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

const RegisterInvited = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshCompanyData } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  const handleRegister = async () => {
    if (!invitation || !password) {
      setError('Please provide all required information.');
      return;
    }
    
    setRegisterLoading(true);
    setError(null);
    
    const registerEndpoint = '/api/register-invited-user';
    
    const registerData = {
      userId: user?.id,
      invitationId: invitation.id,
      companyId: invitation.company.id,
      role: invitation.role,
      invitedBy: invitation.company.id, // Assuming company ID as inviter
      invitedAt: new Date().toISOString()
    };

    try {
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
      
      // Aktualisieren Sie die Company-Daten nach erfolgreicher Registrierung
      await refreshCompanyData();
      
      // Weiterleitung zum Dashboard nach kurzer Verzögerung
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
            <div className="space-y-2">
              <p>{t('auth.youAreInvited')}</p>
              <p>
                {t('auth.toCompany')}: <strong>{invitation.company.name}</strong>
              </p>
              <p>
                {t('auth.asRole')}: <strong>{invitation.role}</strong>
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleRegister} 
                disabled={registerLoading}
              >
                {registerLoading ? t('loading') : t('auth.register')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterInvited;
