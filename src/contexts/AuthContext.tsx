
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  company: any | null;
  signOut: () => Promise<void>;
  loading: boolean;
  hasCompany: boolean;
  refreshCompanyData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [company, setCompany] = useState<any | null>(null);
  const [hasCompany, setHasCompany] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const { t } = useTranslation();

  // Fetch profile data with debounce protection
  const fetchProfile = async (userId: string) => {
    if (profileLoading) return;
    
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error(t('profile.errorFetchingProfile'), error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch company data with debounce protection
  const fetchCompany = async (userId: string) => {
    if (companyLoading) return;
    
    try {
      setCompanyLoading(true);
      console.log(t('company.fetchingCompanyData'), userId);
      
      // First, get company information
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select(`
          *,
          company_types(name),
          company_legal_forms(name)
        `)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (companyError && companyError.code !== 'PGRST116') {
        console.error(t('company.errorFetchingCompany'), companyError);
      }
      
      if (companyData) {
        // For company creators, fetch their role
        const { data: roleData } = await supabase
          .from('company_users')
          .select('role')
          .eq('company_id', companyData.id)
          .eq('user_id', userId)
          .maybeSingle();
        
        // Add role to company data
        const companyWithRole = {
          ...companyData,
          role: roleData?.role || 'company_admin' // Default to company_admin for creator
        };
        
        console.log(t('company.foundCompanyThroughTable'), companyWithRole);
        setCompany(companyWithRole);
        setHasCompany(true);
        return;
      }
      
      // Check if user is part of a company but not the creator
      const { data: companyUserData, error: companyUserError } = await supabase
        .from('company_users')
        .select(`
          *,
          company:company_id (
            *,
            company_types(name),
            company_legal_forms(name)
          )
        `)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (companyUserError && companyUserError.code !== 'PGRST116') {
        console.error(t('company.errorFetchingCompanyUser'), companyUserError);
      }
      
      if (companyUserData?.company) {
        // Merge role information with company data
        const companyWithRole = {
          ...companyUserData.company,
          role: companyUserData.role
        };
        
        console.log(t('company.foundCompanyThroughUsers'), companyWithRole);
        setCompany(companyWithRole);
        setHasCompany(true);
        return;
      }
      
      setCompany(null);
      setHasCompany(false);
    } catch (error) {
      console.error(t('company.errorFetchingCompany'), error);
      setCompany(null);
      setHasCompany(false);
    } finally {
      setCompanyLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If user signs out, clear their data
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setCompany(null);
          setHasCompany(false);
          return;
        }
        
        // Fetch profile data if user is signed in
        // Use setTimeout to avoid blocking the auth state change handler
        if (currentSession?.user) {
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(currentSession.user.id);
              fetchCompany(currentSession.user.id);
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id);
            await fetchCompany(currentSession.user.id);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error(t('auth.errorInitializingAuth'), error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [t]);

  const refreshCompanyData = async () => {
    if (user) {
      await fetchCompany(user.id);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setCompany(null);
      setHasCompany(false);
    } catch (error) {
      console.error(t('auth.signOutError'), error);
      toast({
        title: t('auth.error'),
        description: t('auth.signOutError'),
        variant: "destructive"
      });
    }
  };

  const value = {
    session,
    user,
    profile,
    company,
    signOut,
    loading,
    hasCompany,
    refreshCompanyData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { t } = useTranslation();
  
  if (!context) {
    throw new Error(t('auth.useAuthError'));
  }
  return context;
};
