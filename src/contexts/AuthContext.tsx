import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
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
  
  // Add debounce refs to prevent multiple simultaneous API calls
  const fetchProfileTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchCompanyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const companyDataCache = useRef<Map<string, { data: any, timestamp: number }>>(new Map());
  
  // Cache duration in milliseconds - erhöht auf 30 Sekunden, um wiederholte Abfragen zu verhindern
  const CACHE_DURATION = 30000;
  // Minimale Zeit zwischen Unternehmensabfragen in Millisekunden
  const MIN_FETCH_INTERVAL = 10000;
  const lastFetchTime = useRef<number>(0);

  // Fetch profile data with debounce protection
  const fetchProfile = useCallback(async (userId: string) => {
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
      if (process.env.NODE_ENV === 'development') {
        console.error(t('profile.errorFetchingProfile'), error);
      }
    } finally {
      setProfileLoading(false);
    }
  }, [profileLoading, t]);

  // Fetch company data with debounce and caching
  const fetchCompany = useCallback(async (userId: string) => {
    if (companyLoading) return;
    
    // Überprüfen, ob genug Zeit seit der letzten Abfrage vergangen ist
    const now = Date.now();
    if (now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
      return; // Zu häufige Abfragen verhindern
    }
    
    // Check cache first
    const cachedData = companyDataCache.current.get(userId);
    
    if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
      // Use cached data if it's fresh enough
      if (cachedData.data) {
        setCompany(cachedData.data);
        setHasCompany(true);
      } else {
        setCompany(null);
        setHasCompany(false);
      }
      return;
    }
    
    // Update last fetch time
    lastFetchTime.current = now;
    
    try {
      setCompanyLoading(true);
      
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
        if (process.env.NODE_ENV === 'development') {
          console.error(t('company.errorFetchingCompany'), companyError);
        }
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
        
        // Cache the result
        companyDataCache.current.set(userId, { 
          data: companyWithRole, 
          timestamp: now 
        });
        
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
        if (process.env.NODE_ENV === 'development') {
          console.error(t('company.errorFetchingCompanyUser'), companyUserError);
        }
      }
      
      if (companyUserData?.company) {
        // Merge role information with company data
        const companyWithRole = {
          ...companyUserData.company,
          role: companyUserData.role
        };
        
        // Cache the result
        companyDataCache.current.set(userId, { 
          data: companyWithRole, 
          timestamp: now 
        });
        
        setCompany(companyWithRole);
        setHasCompany(true);
        return;
      }
      
      // Cache null result
      companyDataCache.current.set(userId, { 
        data: null, 
        timestamp: now 
      });
      
      setCompany(null);
      setHasCompany(false);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(t('company.errorFetchingCompany'), error);
      }
      setCompany(null);
      setHasCompany(false);
    } finally {
      setCompanyLoading(false);
    }
  }, [companyLoading, t, CACHE_DURATION, MIN_FETCH_INTERVAL]);

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
          // Clear caches on signout
          companyDataCache.current.clear();
          return;
        }
        
        // Fetch profile data if user is signed in
        if (currentSession?.user) {
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(currentSession.user.id);
              fetchCompany(currentSession.user.id);
            }
          }, 100); // Kleiner Delay, um die Initialisierung abzuschließen
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
        if (process.env.NODE_ENV === 'development') {
          console.error(t('auth.errorInitializingAuth'), error);
        }
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
  }, [t, fetchProfile, fetchCompany]);

  // Force refreshCompanyData with cache invalidation
  const refreshCompanyData = async () => {
    if (!user) return;
    
    // Clear the cache for this user
    companyDataCache.current.delete(user.id);
    
    // Fetch fresh data
    await fetchCompany(user.id);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setCompany(null);
      setHasCompany(false);
      // Clear caches on signout
      companyDataCache.current.clear();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(t('auth.signOutError'), error);
      }
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
