
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { EmployeeQueryResult, RawEmployeeFromDb } from '@/types/employee';
import { mapDbEmployeeToEmployee } from '@/utils/employeeUtils';

export const useEmployeeById = (employeeId?: string): EmployeeQueryResult => {
  const { company } = useAuth();
  const { t } = useTranslation();
  
  const fetchEmployee = async () => {
    if (!employeeId || !company) return null;
    
    // Use explicit typing for the query response
    interface SingleEmployeeQueryResponse {
      data: RawEmployeeFromDb | null;
      error: any;
    }
    
    const { data, error }: SingleEmployeeQueryResponse = await supabase
      .from('employees')
      .select(`
        *,
        employee_licenses(*),
        employee_availability(*),
        employee_regions(*)
      `)
      .eq('id', employeeId)
      .eq('company_id', company.id)
      .single();
      
    if (error) {
      console.error('Error fetching employee:', error);
      toast({
        title: t('employees.fetchError'),
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
    
    // Transform to match Employee interface
    if (!data) return null;
    return mapDbEmployeeToEmployee(data);
  };
  
  const employeeQuery = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: fetchEmployee,
    enabled: !!employeeId && !!company,
  });
  
  return {
    employee: employeeQuery.data || null,
    isLoading: employeeQuery.isLoading,
    isError: employeeQuery.isError,
  };
};
