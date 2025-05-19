
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Prequalification {
  id: string;
  company_id: string;
  pq_kep: boolean;
  bna_registration: boolean;
  adr_certificate: boolean;
  adr_1000_points: boolean;
  eu_license: boolean;
  other_qualification: boolean;
  other_qualification_name: string | null;
  created_at: string;
  updated_at: string;
}

export const useCompanyPrequalifications = (companyId: string | undefined) => {
  const fetchPrequalifications = async (): Promise<Prequalification | null> => {
    if (!companyId) return null;

    const { data, error } = await supabase
      .from('subcontractor_prequalifications')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error) {
      console.error('Error fetching prequalifications:', error);
      return null;
    }

    return data as Prequalification;
  };

  return useQuery({
    queryKey: ['companyPrequalifications', companyId],
    queryFn: fetchPrequalifications,
    enabled: !!companyId,
  });
};
