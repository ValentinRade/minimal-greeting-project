
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import type { Employee } from '@/types/employee';
import type { Tour } from '@/types/tour';
import { mapDbEmployeeToEmployee } from '@/utils/employeeUtils';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  vehicle_type_id: string | null;
  body_type_id: string | null;
  license_plate: string;
}

interface VehicleType {
  id: string;
  name: string;
}

interface CompanyPublicData {
  employees: Employee[];
  vehicles: Vehicle[];
  tours: Tour[];
  vehicleTypes: VehicleType[];
  totalVehicles: number;
  totalVehicleTypes: number;
  isLoading: boolean;
  isError: boolean;
}

export const useCompanyPublicData = (companyId: string | undefined): CompanyPublicData => {
  const { t } = useTranslation();

  // Query to fetch company employees
  const employeesQuery = useQuery({
    queryKey: ['publicEmployees', companyId],
    queryFn: async () => {
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
        console.error('Error fetching public employees:', error);
        toast({
          title: t('publicProfile.fetchError'),
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      return data ? data.map(mapDbEmployeeToEmployee) : [];
    },
    enabled: !!companyId,
  });

  // Query to fetch company vehicles
  const vehiclesQuery = useQuery({
    queryKey: ['publicVehicles', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching public vehicles:', error);
        toast({
          title: t('publicProfile.fetchError'),
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      return data || [];
    },
    enabled: !!companyId,
  });

  // Query to fetch vehicle types
  const vehicleTypesQuery = useQuery({
    queryKey: ['publicVehicleTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*');

      if (error) {
        console.error('Error fetching vehicle types:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!companyId,
  });

  // Query to fetch company tours
  const toursQuery = useQuery({
    queryKey: ['publicTours', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching public tours:', error);
        toast({
          title: t('publicProfile.fetchError'),
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      return data || [];
    },
    enabled: !!companyId,
  });

  // Get all vehicle types for this company
  const companyVehicleTypes = vehiclesQuery.data?.reduce((types, vehicle) => {
    if (vehicle.vehicle_type_id && !types.includes(vehicle.vehicle_type_id)) {
      types.push(vehicle.vehicle_type_id);
    }
    return types;
  }, [] as string[]) || [];

  return {
    employees: employeesQuery.data || [],
    vehicles: vehiclesQuery.data || [],
    tours: toursQuery.data || [],
    vehicleTypes: vehicleTypesQuery.data || [],
    totalVehicles: vehiclesQuery.data?.length || 0,
    totalVehicleTypes: companyVehicleTypes.length,
    isLoading: 
      employeesQuery.isLoading || 
      vehiclesQuery.isLoading || 
      toursQuery.isLoading || 
      vehicleTypesQuery.isLoading,
    isError: 
      employeesQuery.isError || 
      vehiclesQuery.isError || 
      toursQuery.isError ||
      vehicleTypesQuery.isError,
  };
};
