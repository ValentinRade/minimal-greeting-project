
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Employee } from '@/types/employee';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { mapDbEmployeeToEmployee } from '@/utils/employeeUtils';

// Export implementation to avoid circular reference 
export const useEmployeeByIdImpl = (employeeId?: string) => {
  const { t } = useTranslation();
  const { company } = useAuth();
  
  const fetchEmployee = async (): Promise<Employee | null> => {
    if (!employeeId || !company) return null;
    
    const { data, error } = await supabase
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
    
    return mapDbEmployeeToEmployee(data);
  };
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['employee', employeeId, company?.id],
    queryFn: fetchEmployee,
    enabled: !!employeeId && !!company,
  });
  
  return {
    employee: data,
    isLoading,
    isError,
    refetch
  };
};

// Export the hook that uses the implementation
export const useEmployeeById = useEmployeeByIdImpl;
