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

  // Ref, um den Status der Ladeprozesse zu verfolgen
  const dataLoadingRef = useRef({
    profileRequested: false,
    companyRequested: false,
    profileLoaded: false,
    companyLoaded: false
  });

  // Funktion, um zu prüfen ob alle Daten geladen sind und den Ladezustand zu aktualisieren
  const checkDataLoaded = useCallback(() => {
    const { profileRequested, companyRequested, profileLoaded, companyLoaded } = dataLoadingRef.current;
    
    // Wenn beide Datensätze angefragt und geladen wurden, setze loading auf false
    if (profileRequested && companyRequested && profileLoaded && companyLoaded) {
      setLoading(false);
    }
  }, []);

  // Fetch profile data with debounce protection
  const fetchProfile = useCallback(async (userId: string) => {
    if (profileLoading) return;
    
    // Markiere Profil als angefragt
    dataLoadingRef.current.profileRequested = true;
    
    // Clear any pending timeouts
    if (fetchProfileTimeoutRef.current) {
      clearTimeout(fetchProfileTimeoutRef.current);
    }
    
    // Ausführung direkt ohne setTimeout - reduziert die Anzahl der Anfragen
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
      
      // Markiere Profil als geladen
      dataLoadingRef.current.profileLoaded = true;
      checkDataLoaded();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(t('profile.errorFetchingProfile'), error);
      }
      // Auch bei Fehler als geladen markieren, um den Ladezustand zu beenden
      dataLoadingRef.current.profileLoaded = true;
      checkDataLoaded();
    } finally {
      setProfileLoading(false);
      fetchProfileTimeoutRef.current = null;
    }
  }, [profileLoading, t, checkDataLoaded]);

  // Fetch company data with debounce and caching
  const fetchCompany = useCallback(async (userId: string) => {
    if (companyLoading) return;
    
    // Markiere Unternehmen als angefragt
    dataLoadingRef.current.companyRequested = true;
    
    // Überprüfen, ob genug Zeit seit der letzten Abfrage vergangen ist
    const now = Date.now();
    if (now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
      // Bei zu häufigen Anfragen trotzdem als geladen markieren
      dataLoadingRef.current.companyLoaded = true;
      checkDataLoaded();
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
      
      // Markiere Unternehmensdaten als geladen (aus Cache)
      dataLoadingRef.current.companyLoaded = true;
      checkDataLoaded();
      return;
    }
    
    // Update last fetch time
    lastFetchTime.current = now;
    
    // Clear any pending timeouts
    if (fetchCompanyTimeoutRef.current) {
      clearTimeout(fetchCompanyTimeoutRef.current);
    }
    
    // Ausführung direkt ohne setTimeout - reduziert die Anzahl der Anfragen
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
        
        // Markiere Unternehmensdaten als geladen
        dataLoadingRef.current.companyLoaded = true;
        checkDataLoaded();
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
        
        // Markiere Unternehmensdaten als geladen
        dataLoadingRef.current.companyLoaded = true;
        checkDataLoaded();
        return;
      }
      
      // Cache null result
      companyDataCache.current.set(userId, { 
        data: null, 
        timestamp: now 
      });
      
      setCompany(null);
      setHasCompany(false);
      
      // Auch bei fehlendem Unternehmen als geladen markieren
      dataLoadingRef.current.companyLoaded = true;
      checkDataLoaded();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(t('company.errorFetchingCompany'), error);
      }
      setCompany(null);
      setHasCompany(false);
      
      // Auch bei Fehler als geladen markieren
      dataLoadingRef.current.companyLoaded = true;
      checkDataLoaded();
    } finally {
      setCompanyLoading(false);
      fetchCompanyTimeoutRef.current = null;
    }
  }, [companyLoading, t, CACHE_DURATION, MIN_FETCH_INTERVAL, checkDataLoaded]);

  useEffect(() => {
    let isMounted = true;
    
    // Zurücksetzen des Ladezustands bei Montage
    dataLoadingRef.current = {
      profileRequested: false,
      companyRequested: false,
      profileLoaded: false,
      companyLoaded: false
    };
    
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
          
          // Zurücksetzen des Ladezustands
          dataLoadingRef.current = {
            profileRequested: false,
            companyRequested: false,
            profileLoaded: false,
            companyLoaded: false
          };
          
          setLoading(false);
          return;
        }
        
        // Bei Anmeldung/Sitzungsänderung als noch nicht geladen markieren
        setLoading(true);
        
        // Fetch profile data if user is signed in - ohne setTimeout
        if (currentSession?.user && isMounted) {
          fetchProfile(currentSession.user.id);
          fetchCompany(currentSession.user.id);
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
          } else {
            // Wenn kein Benutzer vorhanden ist, können wir den Ladezustand beenden
            setLoading(false);
          }
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
      
      // Clear any pending timeouts on unmount
      if (fetchProfileTimeoutRef.current) {
        clearTimeout(fetchProfileTimeoutRef.current);
      }
      if (fetchCompanyTimeoutRef.current) {
        clearTimeout(fetchCompanyTimeoutRef.current);
      }
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
