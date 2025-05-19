
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';
import { useAuth } from '@/contexts/AuthContext';
import { mapDbEmployeeToEmployee } from '@/utils/employeeUtils';
import { useEmployeeMutations } from './useEmployeeMutations';

// Get all employees function separated to avoid circular references
export const fetchEmployees = async (companyId: string | undefined): Promise<Employee[]> => {
  if (!companyId) return [];

  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      employee_licenses(*),
      employee_availability(*),
      employee_regions(*)
    `)
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }

  // Map the database structure to our application structure
  return data.map(mapDbEmployeeToEmployee) || [];
};

// Hook to get all employees with filtering capabilities
export const useEmployees = (companyId?: string) => {
  const { company } = useAuth();
  const effectiveCompanyId = companyId || company?.id;
  const [filter, setFilter] = useState('');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<number | null>(null);

  // Get employee mutations (create, update, delete)
  const { createEmployee, updateEmployee, deleteEmployee, isLoading: isMutating } = useEmployeeMutations();

  // Query to get all employees
  const { data = [], isLoading: isQueryLoading, isError, refetch } = useQuery({
    queryKey: ['employees', effectiveCompanyId],
    queryFn: () => fetchEmployees(effectiveCompanyId),
    enabled: !!effectiveCompanyId,
  });

  // Apply filters to the employees data
  const filteredEmployees = data.filter(employee => {
    // Text filter (name, email, position)
    const textMatch = !filter || 
      employee.first_name.toLowerCase().includes(filter.toLowerCase()) || 
      employee.last_name.toLowerCase().includes(filter.toLowerCase()) || 
      (employee.email && employee.email.toLowerCase().includes(filter.toLowerCase())) ||
      (employee.position && employee.position.toLowerCase().includes(filter.toLowerCase()));
    
    // Employee type filter
    const typeMatch = !employeeTypeFilter || employee.employee_type === employeeTypeFilter;
    
    // Position filter
    const positionMatch = !positionFilter || employee.position === positionFilter;
    
    // Availability filter
    const availabilityMatch = availabilityFilter === null || 
      (employee.availability && employee.availability.some(a => 
        a.day_of_week === availabilityFilter && a.is_available
      ));
    
    return textMatch && typeMatch && positionMatch && availabilityMatch;
  });

  // Return both the original query result and our additional functionality
  return {
    // Original query properties
    data,
    isLoading: isQueryLoading || isMutating,
    isError,
    refetch,
    
    // Extended functionality
    employees: filteredEmployees,
    filter,
    setFilter,
    employeeTypeFilter,
    setEmployeeTypeFilter,
    positionFilter,
    setPositionFilter,
    availabilityFilter,
    setAvailabilityFilter,
    
    // Mutations
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};

// Hook to get an employee by ID
export const useEmployeeById = (employeeId: string | undefined) => {
  const fetchEmployee = async (): Promise<Employee | null> => {
    if (!employeeId) return null;

    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        employee_licenses(*),
        employee_availability(*),
        employee_regions(*)
      `)
      .eq('id', employeeId)
      .single();

    if (error) {
      console.error('Error fetching employee:', error);
      return null;
    }

    return mapDbEmployeeToEmployee(data);
  };

  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: fetchEmployee,
    enabled: !!employeeId,
  });
};
