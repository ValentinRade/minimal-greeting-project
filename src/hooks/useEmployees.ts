
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Employee, EmployeeFilter } from '@/types/employee';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useEmployeeMutations } from './useEmployeeMutations';
import { mapDbEmployeeToEmployee } from '@/utils/employeeUtils';

export const useEmployees = (filters?: EmployeeFilter) => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const [filter, setFilter] = useState('');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<number | null>(null);
  const { createEmployee, updateEmployee, deleteEmployee, isLoading: mutationLoading } = useEmployeeMutations();

  const fetchEmployees = async () => {
    console.log('Employees query started');
    
    if (!company) return [];

    let query = supabase
      .from('employees')
      .select(`
        *,
        employee_licenses(*),
        employee_availability(*),
        employee_regions(*)
      `)
      .eq('company_id', company.id);

    if (filters?.position) {
      query = query.eq('position', filters.position);
    }

    if (filters?.location) {
      query = query.eq('location', filters.location);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    
    console.log('Employees query response: ', { data, error });
    
    if (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: t('employees.fetchError'),
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
    
    // Transform the data to match the Employee interface
    const employees = data ? data.map(mapDbEmployeeToEmployee) : [];

    return employees;
  };

  // Query for employees
  const employeesQuery = useQuery({
    queryKey: ['employees', company?.id, filters],
    queryFn: fetchEmployees,
    enabled: !!company,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter employees based on search, type, position, and availability
  const filteredEmployees = employeesQuery.data ? employeesQuery.data.filter(employee => {
    const matchesSearch = filter.trim() === '' || 
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(filter.toLowerCase()) ||
      (employee.email && employee.email.toLowerCase().includes(filter.toLowerCase())) ||
      (employee.position && employee.position.toLowerCase().includes(filter.toLowerCase()));
      
    const matchesType = employeeTypeFilter === '' || employee.employee_type === employeeTypeFilter;
    
    const matchesPosition = positionFilter === '' || employee.position === positionFilter;
    
    const matchesAvailability = availabilityFilter === null || 
      (employee.availability && employee.availability.some(a => 
        a.day_of_week === availabilityFilter && a.is_available
      ));
      
    return matchesSearch && matchesType && matchesPosition && matchesAvailability;
  }) : [];

  return {
    employees: filteredEmployees,
    isLoading: mutationLoading || employeesQuery.isLoading,
    isError: employeesQuery.isError,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    filter,
    setFilter,
    employeeTypeFilter,
    setEmployeeTypeFilter,
    positionFilter,
    setPositionFilter,
    availabilityFilter,
    setAvailabilityFilter,
  };
};

// Export useEmployeeById separately (no circular reference)
export { useEmployeeById } from './useEmployeeById';
