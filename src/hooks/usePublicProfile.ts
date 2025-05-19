
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export interface PublicProfile {
  id: string;
  company_id: string;
  enabled: boolean;
  profile_url_path: string | null;
  short_description: string | null;
  show_fleet: boolean;
  show_references: boolean;
  show_qualifications: boolean;
  show_tours: boolean;
  show_ratings: boolean;
  created_at: string;
  updated_at: string;
}

interface PublicProfileUpdateData {
  enabled?: boolean;
  short_description?: string | null;
  show_fleet?: boolean;
  show_references?: boolean;
  show_qualifications?: boolean;
  show_tours?: boolean;
  show_ratings?: boolean;
}

// Hook to fetch and manage the current company's public profile
export const usePublicProfile = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const queryClient = useQueryClient();

  // Fetch public profile data
  const fetchPublicProfile = async (): Promise<PublicProfile | null> => {
    if (!company) return null;

    const { data, error } = await supabase
      .from('subcontractor_public_profiles')
      .select('*')
      .eq('company_id', company.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error fetching public profile:', error);
      toast({
        title: t('profile.fetchError'),
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }

    return data as PublicProfile | null;
  };

  // Query to get public profile
  const profileQuery = useQuery({
    queryKey: ['publicProfile', company?.id],
    queryFn: fetchPublicProfile,
    enabled: !!company,
  });

  // Create initial profile
  const createProfileMutation = useMutation({
    mutationFn: async () => {
      if (!company) throw new Error("No company found");

      // Generate URL path using the company name
      const { data: urlPath, error: urlError } = await supabase
        .rpc('generate_profile_url_path', { company_name: company.name });

      if (urlError) {
        console.error('Error generating URL path:', urlError);
        throw urlError;
      }

      const profile: Omit<PublicProfile, 'id' | 'created_at' | 'updated_at'> = {
        company_id: company.id,
        enabled: false,
        profile_url_path: urlPath || null,
        short_description: "",
        show_fleet: true,
        show_references: true,
        show_qualifications: true,
        show_tours: true,
        show_ratings: true,
      };

      const { data, error } = await supabase
        .from('subcontractor_public_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) {
        console.error('Error creating public profile:', error);
        throw error;
      }

      return data as PublicProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['publicProfile', company?.id], data);
      toast({
        title: t('profile.createSuccess'),
        description: t('profile.profileCreated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('profile.createError'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: PublicProfileUpdateData) => {
      if (!profileQuery.data?.id) throw new Error("No profile found to update");

      const { data, error } = await supabase
        .from('subcontractor_public_profiles')
        .update(updateData)
        .eq('id', profileQuery.data.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating public profile:', error);
        throw error;
      }

      return data as PublicProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['publicProfile', company?.id], data);
      toast({
        title: t('profile.updateSuccess'),
        description: t('profile.profileUpdated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('profile.updateError'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    isCreatingProfile: createProfileMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    publicUrl: profileQuery.data?.profile_url_path ? 
      `/profile/${profileQuery.data.profile_url_path}` : null,
  };
};

// Hook to fetch a public profile by URL path
export const usePublicProfileByPath = (urlPath: string | undefined) => {
  const fetchPublicProfileByPath = async (): Promise<PublicProfile | null> => {
    if (!urlPath) return null;

    const { data, error } = await supabase
      .from('subcontractor_public_profiles')
      .select('*')
      .eq('profile_url_path', urlPath)
      .eq('enabled', true)
      .single();

    if (error) {
      console.error('Error fetching public profile by path:', error);
      return null;
    }

    return data as PublicProfile;
  };

  return useQuery({
    queryKey: ['publicProfileByPath', urlPath],
    queryFn: fetchPublicProfileByPath,
    enabled: !!urlPath,
  });
};

// Hook to fetch company information for a public profile
export const usePublicCompanyInfo = (companyId: string | undefined) => {
  const fetchCompanyInfo = async () => {
    if (!companyId) return null;

    const { data, error } = await supabase
      .from('companies')
      .select('id, name, city, country, created_at')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('Error fetching company info:', error);
      return null;
    }

    return data;
  };

  return useQuery({
    queryKey: ['publicCompanyInfo', companyId],
    queryFn: fetchCompanyInfo,
    enabled: !!companyId,
  });
};

// Hook to fetch company awards
export const useCompanyAwards = (companyId: string | undefined) => {
  const fetchAwards = async () => {
    if (!companyId) return [];

    const { data, error } = await supabase
      .from('subcontractor_awards')
      .select('*')
      .eq('company_id', companyId)
      .order('awarded_at', { ascending: false });

    if (error) {
      console.error('Error fetching company awards:', error);
      return [];
    }

    return data || [];
  };

  return useQuery({
    queryKey: ['companyAwards', companyId],
    queryFn: fetchAwards,
    enabled: !!companyId,
  });
};

// Hook to fetch company ratings
export const useCompanyRatings = (companyId: string | undefined) => {
  const fetchRatings = async () => {
    if (!companyId) return [];

    const { data, error } = await supabase
      .from('subcontractor_ratings')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching company ratings:', error);
      return [];
    }

    return data || [];
  };

  return useQuery({
    queryKey: ['companyRatings', companyId],
    queryFn: fetchRatings,
    enabled: !!companyId,
  });
};
