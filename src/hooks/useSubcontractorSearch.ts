
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types for search filters
export type SubcontractorFilters = {
  searchText?: string;
  region?: string[];
  vehicleTypes?: string[];
  bodyTypes?: string[];
  languages?: string[];
  specializations?: string[];
  serviceRegions?: string[];
  availability?: 'immediate' | 'scheduled' | null;
  minRating?: number;
  certificates?: {
    adr?: boolean;
    eu?: boolean;
    gdp?: boolean;
    other?: boolean;
  };
};

// Type for subcontractor search result
export type SubcontractorSearchResult = {
  id: string;
  company_id: string;
  company_name: string;
  city: string;
  country: string;
  languages: string[];
  service_regions: string[];
  specializations: string[];
  vehicle_types: string[];
  body_types: string[];
  has_dangerous_goods_capability: boolean;
  has_temperature_control: boolean;
  has_express_capability: boolean;
  availability_type: string;
  avg_rating: number | null;
  total_ratings: number;
  total_vehicles: number;
  total_employees: number;
  has_adr_certificate: boolean;
  has_eu_license: boolean;
  has_gdp: boolean;
  has_other_certificates: boolean;
  location_lat: number | null;
  location_lng: number | null;
};

// Function to fetch subcontractors with filters
export const fetchSubcontractors = async (
  filters: SubcontractorFilters = {}
): Promise<SubcontractorSearchResult[]> => {
  let query = supabase
    .from('subcontractor_search_data')
    .select('*');

  // Apply text search filter
  if (filters.searchText) {
    const searchText = filters.searchText.toLowerCase();
    query = query.or(
      `company_name.ilike.%${searchText}%,city.ilike.%${searchText}%,country.ilike.%${searchText}%`
    );
  }

  // Apply region filter
  if (filters.region && filters.region.length > 0) {
    query = query.or(
      filters.region.map(region => `country.eq.${region}`).join(',')
    );
  }

  // Apply vehicle type filter
  if (filters.vehicleTypes && filters.vehicleTypes.length > 0) {
    query = query.contains('vehicle_types', filters.vehicleTypes);
  }

  // Apply body type filter
  if (filters.bodyTypes && filters.bodyTypes.length > 0) {
    query = query.contains('body_types', filters.bodyTypes);
  }

  // Apply language filter
  if (filters.languages && filters.languages.length > 0) {
    query = query.contains('languages', filters.languages);
  }

  // Apply specialization filter
  if (filters.specializations && filters.specializations.length > 0) {
    query = query.contains('specializations', filters.specializations);
  }

  // Apply service region filter
  if (filters.serviceRegions && filters.serviceRegions.length > 0) {
    query = query.contains('service_regions', filters.serviceRegions);
  }

  // Apply availability filter
  if (filters.availability) {
    query = query.eq('availability_type', filters.availability);
  }

  // Apply rating filter
  if (filters.minRating && filters.minRating > 0) {
    query = query.gte('avg_rating', filters.minRating);
  }

  // Apply certificate filters
  if (filters.certificates) {
    if (filters.certificates.adr) {
      query = query.eq('has_adr_certificate', true);
    }
    if (filters.certificates.eu) {
      query = query.eq('has_eu_license', true);
    }
    if (filters.certificates.gdp) {
      query = query.eq('has_gdp', true);
    }
    if (filters.certificates.other) {
      query = query.eq('has_other_certificates', true);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching subcontractors:', error);
    return [];
  }

  return data || [];
};

// Hook to search and filter subcontractors
export const useSubcontractorSearch = () => {
  const [filters, setFilters] = useState<SubcontractorFilters>({});
  
  // Query to fetch subcontractors based on filters
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['subcontractor-search', filters],
    queryFn: () => fetchSubcontractors(filters),
  });

  // Function to update filters
  const updateFilters = (newFilters: Partial<SubcontractorFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  return {
    subcontractors: data,
    isLoading,
    isError,
    filters,
    updateFilters,
    resetFilters,
    refetch
  };
};
