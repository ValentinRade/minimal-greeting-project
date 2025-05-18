
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  company: any | null;
  signOut: () => Promise<void>;
  loading: boolean;
  hasCompany: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [company, setCompany] = useState<any | null>(null);
  const [hasCompany, setHasCompany] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch profile data if user is signed in
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
            fetchCompany(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setCompany(null);
          setHasCompany(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
        fetchCompany(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchCompany = async (userId: string) => {
    try {
      // First, get company information
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select(`
          *,
          company_types(name),
          company_legal_forms(name)
        `)
        .eq('user_id', userId)
        .single();
        
      if (companyError) {
        if (companyError.code !== 'PGRST116') { // PGRST116 means no rows returned
          console.error('Error fetching company:', companyError);
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
          .single();
        
        if (companyUserError) {
          if (companyUserError.code !== 'PGRST116') { // PGRST116 means no rows returned
            console.error('Error fetching company user:', companyUserError);
          }
          setHasCompany(false);
          return;
        }
        
        if (companyUserData) {
          // Merge role information with company data
          const companyWithRole = {
            ...companyUserData.company,
            role: companyUserData.role
          };
          
          setCompany(companyWithRole);
          setHasCompany(true);
          return;
        }
        
        setHasCompany(false);
        return;
      }
      
      if (companyData) {
        // For company creators, fetch their role
        const { data: roleData } = await supabase
          .from('company_users')
          .select('role')
          .eq('company_id', companyData.id)
          .eq('user_id', userId)
          .single();
        
        // Add role to company data
        const companyWithRole = {
          ...companyData,
          role: roleData?.role || 'company_admin' // Default to company_admin for creator
        };
        
        setCompany(companyWithRole);
        setHasCompany(true);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      setHasCompany(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setCompany(null);
    setHasCompany(false);
  };

  const value = {
    session,
    user,
    profile,
    company,
    signOut,
    loading,
    hasCompany
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
