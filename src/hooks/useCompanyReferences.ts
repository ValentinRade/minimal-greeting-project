
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyReference {
  id: string;
  company_id: string | null;
  customer_name: string | null;
  industry: string;
  category: string;
  start_date: string;
  end_date: string | null;
  until_today: boolean;
  allow_publication: boolean;
  anonymize: boolean;
  created_at: string;
  updated_at: string;
}

export const useCompanyReferences = (companyId: string | undefined) => {
  const fetchReferences = async (): Promise<CompanyReference[]> => {
    if (!companyId) return [];

    const { data, error } = await supabase
      .from('subcontractor_references')
      .select('*')
      .eq('company_id', companyId)
      .eq('allow_publication', true)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching references:', error);
      return [];
    }

    return data || [];
  };

  return useQuery({
    queryKey: ['companyReferences', companyId],
    queryFn: fetchReferences,
    enabled: !!companyId,
  });
};
