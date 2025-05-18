
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/i18n/languages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const { changeLanguage } = useLanguage();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('');
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setLanguage(profile.language || 'Deutsch');
    }
  }, [profile]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          language
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: t('settings.profileUpdated'),
        description: t('settings.profileUpdateSuccess'),
      });
      
      // Update language if changed
      if (language !== profile?.language) {
        changeLanguage(language);
      }
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
  
  if (loading) {
    return <div className="flex items-center justify-center p-8">{t('loading')}</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('settings.personalProfile')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.basicInfo')}</CardTitle>
          <CardDescription>{t('settings.basicInfoDesc')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">{t('auth.language')}</Label>
              <Select 
                value={language} 
                onValueChange={setLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('profile.selectLanguage')} />
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
            <Button 
              type="submit" 
              disabled={updating}
            >
              {updating ? t('settings.updating') : t('settings.updateProfile')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSettings;
