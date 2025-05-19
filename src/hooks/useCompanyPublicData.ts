import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import type { Employee } from '@/types/employee';
import type { Tour, TourStatus } from '@/types/tour';
import { mapDbEmployeeToEmployee } from '@/utils/employeeUtils';
import { useCompanyPrequalifications } from './useCompanyPrequalifications';
import { useCompanyReferences } from './useCompanyReferences';

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
  prequalifications: any | null;
  references: any[];
  isPrequalificationsLoading: boolean;
  isReferencesLoading: boolean;
}

// Add this function to map database tours to client-side format
const mapDbTourToClientFormat = (dbTour: any): Tour => {
  return {
    id: dbTour.id,
    title: dbTour.title,
    status: dbTour.status as TourStatus,
    createdAt: dbTour.created_at,
    vehicle_type: dbTour.vehicle_type,
    body_type: dbTour.body_type,
    start_location: dbTour.start_location,
    end_location: dbTour.end_location,
    total_distance: dbTour.total_distance,
    start_date: dbTour.start_date,
    end_date: dbTour.end_date,
    cargo_weight: dbTour.cargo_weight,
    cargo_volume: dbTour.cargo_volume,
    cargo_description: dbTour.cargo_description,
    is_palletized: dbTour.is_palletized,
    is_hazardous: dbTour.is_hazardous,
    temperature_sensitive: dbTour.temperature_sensitive,
    pallet_exchange: dbTour.pallet_exchange,
    start_location_lat: dbTour.start_location_lat,
    start_location_lng: dbTour.start_location_lng,
    end_location_lat: dbTour.end_location_lat,
    end_location_lng: dbTour.end_location_lng,
    user_id: dbTour.user_id
  };
};

// Update the function that returns tours
const fetchCompanyTours = async (companyId: string): Promise<Tour[]> => {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('company_id', companyId);
    
  if (error) {
    console.error('Error fetching company tours:', error);
    return [];
  }
  
  // Map the DB tours to our client interface
  return data ? data.map(mapDbTourToClientFormat) : [];
};

export const useCompanyPublicData = (companyId: string | undefined): CompanyPublicData => {
  const { t } = useTranslation();
  
  // Get prequalifications and references using the hooks
  const { data: prequalifications, isLoading: isPrequalificationsLoading } = useCompanyPrequalifications(companyId);
  const { data: references, isLoading: isReferencesLoading } = useCompanyReferences(companyId);

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

      // Map the DB tours to our client interface
      return data ? data.map(mapDbTourToClientFormat) : [];
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
    prequalifications,
    references: references || [],
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
    isPrequalificationsLoading,
    isReferencesLoading
  };
};
