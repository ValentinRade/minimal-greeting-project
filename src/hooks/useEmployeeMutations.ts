
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { CreateEmployeeData } from '@/types/employee';

export const useEmployeeMutations = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Mutation for creating a new employee
  const createEmployee = useMutation({
    mutationFn: async (employee: CreateEmployeeData) => {
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
          const licensesData = employee.licenses.map((license) => ({
            employee_id: data.id,
            license_type: license.license_type,
            description: license.description,
          }));
          
          const { error: licensesError } = await supabase
            .from('employee_licenses')
            .insert(licensesData);
            
          if (licensesError) throw licensesError;
        }
        
        // Handle availability if any
        if (employee.availability && employee.availability.length > 0) {
          const availabilityData = employee.availability.map((avail) => ({
            employee_id: data.id,
            day_of_week: avail.day_of_week,
            is_available: avail.is_available || false,
            start_time: avail.start_time,
            end_time: avail.end_time,
            notes: avail.notes,
          }));
          
          const { error: availabilityError } = await supabase
            .from('employee_availability')
            .insert(availabilityData);
            
          if (availabilityError) throw availabilityError;
        }
        
        // Handle regions if any
        if (employee.regions && employee.regions.length > 0) {
          const regionsData = employee.regions.map((region) => ({
            employee_id: data.id,
            country: typeof region === 'string' ? region : region.country,
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
              license_type: license.license_type,
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
          if (employee.availability && employee.availability.length > 0) {
            const availabilityData = employee.availability.map((avail: any) => ({
              employee_id: employee.id,
              day_of_week: avail.day_of_week,
              is_available: avail.is_available || false,
              start_time: avail.start_time,
              end_time: avail.end_time,
              notes: avail.notes,
            }));
            
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
            const regionsData = employee.regions.map((region: any) => ({
              employee_id: employee.id,
              country: typeof region === 'string' ? region : region.country,
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
    createEmployee,
    updateEmployee,
    deleteEmployee,
    isLoading
  };
};
