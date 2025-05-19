
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Employee, CreateEmployeeData, EmployeeType, PaymentType, LicenseType } from '@/types/employee';

export const useEmployees = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState<'employed' | 'contractor' | ''>('');
  const [positionFilter, setPositionFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<number | null>(null);

  // Get all employees
  const { data: employees = [], isLoading, refetch } = useQuery({
    queryKey: ['employees', company?.id, filter, employeeTypeFilter, positionFilter, availabilityFilter],
    queryFn: async () => {
      console.log("Fetching employees for company:", company?.id);
      if (!company?.id) return [];

      let query = supabase
        .from('employees')
        .select(`
          *,
          employee_licenses(id, license_type, description),
          employee_availability(id, day_of_week, is_available, start_time, end_time, notes),
          employee_regions(id, country)
        `)
        .eq('company_id', company.id)
        .order('last_name', { ascending: true });

      if (filter) {
        query = query.or(`first_name.ilike.%${filter}%,last_name.ilike.%${filter}%,email.ilike.%${filter}%`);
      }
      
      if (employeeTypeFilter) {
        query = query.eq('employee_type', employeeTypeFilter);
      }
      
      if (positionFilter) {
        query = query.eq('position', positionFilter);
      }

      const { data, error } = await query;
      
      console.log("Employees query response:", { data, error });

      if (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: t('errors.fetchFailed'),
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      // Process availability filter client-side if set
      let filteredData = data;
      if (availabilityFilter !== null) {
        filteredData = data.filter(employee => {
          const availabilityForDay = employee.employee_availability.find(
            a => a.day_of_week === availabilityFilter
          );
          return availabilityForDay?.is_available;
        });
      }

      // Transform and enhance data
      return filteredData.map((employee: any) => ({
        ...employee,
        licenses: employee.employee_licenses,
        availability: employee.employee_availability,
        regions: employee.employee_regions,
        // In a real app, we would fetch these counts from a join or separate query
        tour_count: 0, // Placeholder, would be replaced with actual data
        vehicle_count: 0 // Placeholder, would be replaced with actual data
      }));
    },
    enabled: !!company?.id,
  });

  // Get single employee
  const useEmployee = (id?: string) => useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          employee_licenses(id, license_type, description),
          employee_availability(id, day_of_week, is_available, start_time, end_time, notes),
          employee_regions(id, country)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching employee:', error);
        toast({
          title: t('errors.fetchFailed'),
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      return {
        ...data,
        licenses: data.employee_licenses,
        availability: data.employee_availability,
        regions: data.employee_regions,
        tour_count: 0, // Placeholder
        vehicle_count: 0 // Placeholder
      };
    },
    enabled: !!id,
  });

  // Create employee
  const createEmployee = useMutation({
    mutationFn: async (employeeData: CreateEmployeeData) => {
      if (!company?.id) {
        throw new Error('No company ID found');
      }

      const { licenses, availability, regions, ...employeeBase } = employeeData;

      // Insert employee base record
      const { data: employeeResult, error: employeeError } = await supabase
        .from('employees')
        .insert({
          ...employeeBase,
          company_id: company.id,
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
        })
        .select()
        .single();

      if (employeeError) {
        throw employeeError;
      }

      const employeeId = employeeResult.id;

      // Insert licenses
      if (licenses.length > 0) {
        const licensesData = licenses.map(license => ({
          employee_id: employeeId,
          license_type: license.license_type,
          description: license.description
        }));

        const { error: licensesError } = await supabase
          .from('employee_licenses')
          .insert(licensesData);

        if (licensesError) {
          throw licensesError;
        }
      }

      // Insert availability
      if (availability.length > 0) {
        const availabilityData = availability.map(avail => ({
          employee_id: employeeId,
          day_of_week: avail.day_of_week,
          is_available: avail.is_available,
          start_time: avail.start_time,
          end_time: avail.end_time,
          notes: avail.notes
        }));

        const { error: availabilityError } = await supabase
          .from('employee_availability')
          .insert(availabilityData);

        if (availabilityError) {
          throw availabilityError;
        }
      }

      // Insert regions
      if (regions.length > 0) {
        const regionsData = regions.map(region => ({
          employee_id: employeeId,
          country: region.country
        }));

        const { error: regionsError } = await supabase
          .from('employee_regions')
          .insert(regionsData);

        if (regionsError) {
          throw regionsError;
        }
      }

      return employeeResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: t('success.created'),
        description: t('employees.createSuccess'),
      });
    },
    onError: (error: any) => {
      console.error('Error creating employee:', error);
      toast({
        title: t('errors.createFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update employee
  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Employee> & { id: string }) => {
      const { licenses, availability, regions, ...employeeBase } = data;

      // Update base employee record
      const { error: employeeError } = await supabase
        .from('employees')
        .update(employeeBase)
        .eq('id', id);

      if (employeeError) {
        throw employeeError;
      }

      // Update licenses if provided
      if (licenses) {
        // Delete existing licenses
        const { error: deleteError } = await supabase
          .from('employee_licenses')
          .delete()
          .eq('employee_id', id);

        if (deleteError) {
          throw deleteError;
        }

        // Insert new licenses
        if (licenses.length > 0) {
          const licensesData = licenses.map(license => ({
            employee_id: id,
            license_type: license.license_type,
            description: license.description
          }));

          const { error: licensesError } = await supabase
            .from('employee_licenses')
            .insert(licensesData);

          if (licensesError) {
            throw licensesError;
          }
        }
      }

      // Update availability if provided
      if (availability) {
        // Delete existing availability
        const { error: deleteError } = await supabase
          .from('employee_availability')
          .delete()
          .eq('employee_id', id);

        if (deleteError) {
          throw deleteError;
        }

        // Insert new availability
        if (availability.length > 0) {
          const availabilityData = availability.map(avail => ({
            employee_id: id,
            day_of_week: avail.day_of_week,
            is_available: avail.is_available,
            start_time: avail.start_time,
            end_time: avail.end_time,
            notes: avail.notes
          }));

          const { error: availabilityError } = await supabase
            .from('employee_availability')
            .insert(availabilityData);

          if (availabilityError) {
            throw availabilityError;
          }
        }
      }

      // Update regions if provided
      if (regions) {
        // Delete existing regions
        const { error: deleteError } = await supabase
          .from('employee_regions')
          .delete()
          .eq('employee_id', id);

        if (deleteError) {
          throw deleteError;
        }

        // Insert new regions
        if (regions.length > 0) {
          const regionsData = regions.map(region => ({
            employee_id: id,
            country: region.country
          }));

          const { error: regionsError } = await supabase
            .from('employee_regions')
            .insert(regionsData);

          if (regionsError) {
            throw regionsError;
          }
        }
      }

      return { id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      toast({
        title: t('success.updated'),
        description: t('employees.updateSuccess'),
      });
    },
    onError: (error: any) => {
      console.error('Error updating employee:', error);
      toast({
        title: t('errors.updateFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete employee
  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: t('success.deleted'),
        description: t('employees.deleteSuccess'),
      });
    },
    onError: (error: any) => {
      console.error('Error deleting employee:', error);
      toast({
        title: t('errors.deleteFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    employees,
    isLoading,
    refetch,
    filter,
    setFilter,
    employeeTypeFilter,
    setEmployeeTypeFilter,
    positionFilter,
    setPositionFilter,
    availabilityFilter,
    setAvailabilityFilter,
    useEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};
