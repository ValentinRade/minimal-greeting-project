
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';

// Get all employees function separated to avoid circular references
export const fetchEmployees = async (companyId: string | undefined): Promise<Employee[]> => {
  if (!companyId) return [];

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }

  return data as Employee[] || [];
};

// Hook to get all employees
export const useEmployees = (companyId: string | undefined) => {
  return useQuery({
    queryKey: ['employees', companyId],
    queryFn: () => fetchEmployees(companyId),
    enabled: !!companyId,
  });
};

// Hook to get an employee by ID
export const useEmployeeById = (employeeId: string | undefined) => {
  const fetchEmployee = async (): Promise<Employee | null> => {
    if (!employeeId) return null;

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (error) {
      console.error('Error fetching employee:', error);
      return null;
    }

    return data as Employee;
  };

  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: fetchEmployee,
    enabled: !!employeeId,
  });
};
