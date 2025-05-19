
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Employee, EmployeeFilter } from '@/types/employee';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

export const useEmployees = (filters?: EmployeeFilter) => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployees = async (): Promise<Employee[]> => {
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
    
    return data || [];
  };

  // Query for employees
  const employeesQuery = useQuery({
    queryKey: ['employees', company?.id, filters],
    queryFn: fetchEmployees,
    enabled: !!company,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for creating a new employee
  const createEmployee = useMutation({
    mutationFn: async (employee: any) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .insert([
            {
              first_name: employee.first_name,
              last_name: employee.last_name,
              position: employee.position,
              email: employee.email,
              phone: employee.phone,
              employee_type: employee.employee_type,
              payment_type: employee.payment_type,
              hourly_rate: employee.hourly_rate,
              gross_salary: employee.gross_salary,
              net_salary: employee.net_salary,
              location: employee.location,
              notes: employee.notes,
              company_id: company?.id,
              user_id: employee.user_id,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        
        // Handle licenses if any
        if (employee.licenses && employee.licenses.length > 0) {
          const licensesData = employee.licenses.map((license: any) => ({
            employee_id: data.id,
            license_type: license.type,
            description: license.description,
          }));
          
          const { error: licensesError } = await supabase
            .from('employee_licenses')
            .insert(licensesData);
            
          if (licensesError) throw licensesError;
        }
        
        // Handle availability if any
        if (employee.availability && Object.keys(employee.availability).length > 0) {
          const availabilityData = Object.entries(employee.availability).map(
            ([day, schedule]: [string, any]) => ({
              employee_id: data.id,
              day_of_week: parseInt(day),
              is_available: schedule.is_available || false,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              notes: schedule.notes,
            })
          );
          
          const { error: availabilityError } = await supabase
            .from('employee_availability')
            .insert(availabilityData);
            
          if (availabilityError) throw availabilityError;
        }
        
        // Handle regions if any
        if (employee.regions && employee.regions.length > 0) {
          const regionsData = employee.regions.map((region: string) => ({
            employee_id: data.id,
            country: region,
          }));
          
          const { error: regionsError } = await supabase
            .from('employee_regions')
            .insert(regionsData);
            
          if (regionsError) throw regionsError;
        }

        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: t('employees.createSuccess'),
        description: t('employees.employeeCreated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('employees.createError'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating an employee
  const updateEmployee = useMutation({
    mutationFn: async (employee: any) => {
      setIsLoading(true);
      try {
        // Update employee base data
        const { error } = await supabase
          .from('employees')
          .update({
            first_name: employee.first_name,
            last_name: employee.last_name,
            position: employee.position,
            email: employee.email,
            phone: employee.phone,
            employee_type: employee.employee_type,
            payment_type: employee.payment_type,
            hourly_rate: employee.hourly_rate,
            gross_salary: employee.gross_salary,
            net_salary: employee.net_salary,
            location: employee.location,
            notes: employee.notes,
          })
          .eq('id', employee.id);

        if (error) throw error;
        
        // Handle licenses: delete old ones and add new ones
        if (employee.licenses !== undefined) {
          // Delete old licenses
          const { error: deleteLicensesError } = await supabase
            .from('employee_licenses')
            .delete()
            .eq('employee_id', employee.id);
            
          if (deleteLicensesError) throw deleteLicensesError;
          
          // Add new licenses
          if (employee.licenses && employee.licenses.length > 0) {
            const licensesData = employee.licenses.map((license: any) => ({
              employee_id: employee.id,
              license_type: license.type,
              description: license.description,
            }));
            
            const { error: licensesError } = await supabase
              .from('employee_licenses')
              .insert(licensesData);
              
            if (licensesError) throw licensesError;
          }
        }
        
        // Handle availability: delete old ones and add new ones
        if (employee.availability !== undefined) {
          // Delete old availability
          const { error: deleteAvailabilityError } = await supabase
            .from('employee_availability')
            .delete()
            .eq('employee_id', employee.id);
            
          if (deleteAvailabilityError) throw deleteAvailabilityError;
          
          // Add new availability
          if (employee.availability && Object.keys(employee.availability).length > 0) {
            const availabilityData = Object.entries(employee.availability).map(
              ([day, schedule]: [string, any]) => ({
                employee_id: employee.id,
                day_of_week: parseInt(day),
                is_available: schedule.is_available || false,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                notes: schedule.notes,
              })
            );
            
            const { error: availabilityError } = await supabase
              .from('employee_availability')
              .insert(availabilityData);
              
            if (availabilityError) throw availabilityError;
          }
        }
        
        // Handle regions: delete old ones and add new ones
        if (employee.regions !== undefined) {
          // Delete old regions
          const { error: deleteRegionsError } = await supabase
            .from('employee_regions')
            .delete()
            .eq('employee_id', employee.id);
            
          if (deleteRegionsError) throw deleteRegionsError;
          
          // Add new regions
          if (employee.regions && employee.regions.length > 0) {
            const regionsData = employee.regions.map((region: string) => ({
              employee_id: employee.id,
              country: region,
            }));
            
            const { error: regionsError } = await supabase
              .from('employee_regions')
              .insert(regionsData);
              
            if (regionsError) throw regionsError;
          }
        }

        return employee;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: t('employees.updateSuccess'),
        description: t('employees.employeeUpdated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('employees.updateError'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting an employee
  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: t('employees.deleteSuccess'),
        description: t('employees.employeeDeleted'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('employees.deleteError'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: isLoading || employeesQuery.isLoading,
    isError: employeesQuery.isError,
    createEmployee: createEmployee.mutate,
    updateEmployee: updateEmployee.mutate,
    deleteEmployee: deleteEmployee.mutate,
  };
};

export const useEmployeeById = (employeeId?: string) => {
  const { company } = useAuth();
  const { t } = useTranslation();
  
  const fetchEmployee = async () => {
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
    
    return data;
  };
  
  const employeeQuery = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: fetchEmployee,
    enabled: !!employeeId && !!company,
  });
  
  return {
    employee: employeeQuery.data,
    isLoading: employeeQuery.isLoading,
    isError: employeeQuery.isError,
  };
};
