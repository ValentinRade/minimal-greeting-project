import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TourFilterOptions, TourStats, TourWithRelations, Tour, TourStatus, VehicleBodyType } from '@/types/tour';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

export function useTours(filterOptions: TourFilterOptions) {
  const { t } = useTranslation();
  const { company } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tours with relations
  const fetchTours = async (): Promise<TourWithRelations[]> => {
    if (!company) return [];

    let query = supabase.from('tours')
      .select(`
        *,
        tour_stops(*),
        tour_schedules(*),
        tour_vehicles(*, vehicles:vehicle_id(*)),
        tour_employees(*, employees:employee_id(*))
      `)
      .eq('company_id', company.id);

    // Apply filters
    if (filterOptions.status !== 'all') {
      // Using 'any' to bypass the type check temporarily
      query = query.eq('status', filterOptions.status as any);
    }

    if (filterOptions.timeframe !== 'all') {
      const now = new Date();
      if (filterOptions.timeframe === 'today') {
        const today = now.toISOString().split('T')[0];
        query = query.eq('start_date', today);
      } else if (filterOptions.timeframe === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        query = query.gte('start_date', startOfWeek.toISOString().split('T')[0]);
      } else if (filterOptions.timeframe === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        query = query.gte('start_date', startOfMonth.toISOString().split('T')[0]);
      }
    }

    // Apply sorting
    if (filterOptions.sortBy === 'date') {
      query = query.order('start_date', { ascending: filterOptions.sortDirection === 'asc' });
    } else if (filterOptions.sortBy === 'status') {
      query = query.order('status', { ascending: filterOptions.sortDirection === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: t('tours.fetchError'),
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }

    // Map DB fields to our interface
    return data?.map(tour => ({
      id: tour.id,
      title: tour.title,
      status: tour.status as TourStatus,
      createdAt: tour.created_at,
      vehicle_type: tour.vehicle_type,
      body_type: tour.body_type as VehicleBodyType,
      start_location: tour.start_location,
      end_location: tour.end_location,
      total_distance: tour.total_distance,
      start_date: tour.start_date,
      end_date: tour.end_date,
      cargo_weight: tour.cargo_weight,
      cargo_volume: tour.cargo_volume,
      cargo_description: tour.cargo_description,
      is_palletized: tour.is_palletized,
      is_hazardous: tour.is_hazardous,
      temperature_sensitive: tour.temperature_sensitive,
      pallet_exchange: tour.pallet_exchange,
      start_location_lat: tour.start_location_lat,
      start_location_lng: tour.start_location_lng,
      end_location_lat: tour.end_location_lat,
      end_location_lng: tour.end_location_lng,
      user_id: tour.user_id,
      stops: tour.tour_stops,
      schedules: tour.tour_schedules,
      vehicles: tour.tour_vehicles,
      employees: tour.tour_employees
    })) || [];
  };

  // Fetch tour statistics
  const fetchTourStats = async (): Promise<TourStats> => {
    if (!company) {
      return {
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        averageDuration: 0,
        statusDistribution: {
          pending: 0,
          in_progress: 0,
          completed: 0,
          pendingPercent: 0,
          inProgressPercent: 0,
          completedPercent: 0,
        },
        topRegions: [],
      };
    }

    // Get total count
    const { count: total, error: countError } = await supabase
      .from('tours')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', company.id);

    if (countError) {
      console.error('Error fetching tour count:', countError);
      return {
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        averageDuration: 0,
        statusDistribution: {
          pending: 0,
          in_progress: 0,
          completed: 0,
          pendingPercent: 0,
          inProgressPercent: 0,
          completedPercent: 0,
        },
        topRegions: [],
      };
    }

    // Get status distribution
    const { data: statusData, error: statusError } = await supabase
      .from('tours')
      .select('status')
      .eq('company_id', company.id);

    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let active = 0;
    let cancelled = 0;

    if (!statusError && statusData) {
      pending = statusData.filter(tour => tour.status === 'pending').length;
      inProgress = statusData.filter(tour => tour.status === 'in_progress').length;
      completed = statusData.filter(tour => tour.status === 'completed').length;
      active = statusData.filter(tour => tour.status === 'active').length;
      cancelled = statusData.filter(tour => tour.status === 'cancelled').length;
    }

    const pendingPercent = total ? Math.round((pending / total) * 100) : 0;
    const inProgressPercent = total ? Math.round((inProgress / total) * 100) : 0;
    const completedPercent = total ? Math.round((completed / total) * 100) : 0;

    // Get top regions (start locations as regions)
    const { data: regionsData, error: regionsError } = await supabase
      .from('tours')
      .select('start_location')
      .eq('company_id', company.id);

    let topRegions: { name: string; count: number }[] = [];
    
    if (!regionsError && regionsData) {
      const regionCounts: Record<string, number> = {};
      regionsData.forEach(tour => {
        const location = tour.start_location || '';
        regionCounts[location] = (regionCounts[location] || 0) + 1;
      });

      topRegions = Object.entries(regionCounts)
        .map(([region, count]) => ({ name: region, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    // Calculate average duration (currently a placeholder since we don't track actual durations)
    const averageDuration = 120; // Placeholder: 2 hours in minutes

    return {
      total: total || 0,
      active,
      completed,
      cancelled,
      averageDuration,
      statusDistribution: {
        pending,
        in_progress: inProgress,
        completed,
        pendingPercent,
        inProgressPercent,
        completedPercent,
      },
      topRegions,
    };
  };

  // Query for tours
  const toursQuery = useQuery({
    queryKey: ['tours', company?.id, filterOptions],
    queryFn: fetchTours,
    enabled: !!company,
  });

  // Query for tour stats
  const statsQuery = useQuery({
    queryKey: ['tourStats', company?.id],
    queryFn: fetchTourStats,
    enabled: !!company,
  });

  // Mutation for creating a new tour
  const createTourMutation = useMutation({
    mutationFn: async (tour: TourWithRelations) => {
      setIsLoading(true);
      try {
        if (!company) throw new Error(t('tours.companyRequired'));

        // Insert the tour
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .insert({
            company_id: company.id,
            user_id: tour.user_id,
            title: tour.title,
            vehicle_type: tour.vehicle_type,
            body_type: tour.body_type as VehicleBodyType,
            start_location: tour.start_location,
            start_location_lat: tour.start_location_lat,
            start_location_lng: tour.start_location_lng,
            end_location: tour.end_location,
            end_location_lat: tour.end_location_lat,
            end_location_lng: tour.end_location_lng,
            total_distance: tour.total_distance,
            status: tour.status as any,
            cargo_weight: tour.cargo_weight,
            cargo_volume: tour.cargo_volume,
            cargo_description: tour.cargo_description,
            is_palletized: tour.is_palletized,
            is_hazardous: tour.is_hazardous,
            temperature_sensitive: tour.temperature_sensitive,
            pallet_exchange: tour.pallet_exchange,
            start_date: tour.start_date,
            end_date: tour.end_date
          })
          .select()
          .single();

        if (tourError) throw tourError;
        
        const tourId = tourData.id;

        // Insert tour stops if provided
        if (tour.stops && tour.stops.length > 0) {
          const stopsToInsert = tour.stops.map(stop => ({
            ...stop,
            tour_id: tourId,
          }));

          const { error: stopsError } = await supabase
            .from('tour_stops')
            .insert(stopsToInsert);

          if (stopsError) throw stopsError;
        }

        // Insert tour schedules if provided
        if (tour.schedules && tour.schedules.length > 0) {
          const schedulesToInsert = tour.schedules.map(schedule => ({
            ...schedule,
            tour_id: tourId,
          }));

          const { error: schedulesError } = await supabase
            .from('tour_schedules')
            .insert(schedulesToInsert);

          if (schedulesError) throw schedulesError;
        }

        // Insert tour vehicles if provided
        if (tour.vehicles && tour.vehicles.length > 0) {
          const vehiclesToInsert = tour.vehicles.map(vehicle => ({
            ...vehicle,
            tour_id: tourId,
          }));

          const { error: vehiclesError } = await supabase
            .from('tour_vehicles')
            .insert(vehiclesToInsert);

          if (vehiclesError) throw vehiclesError;
        }

        // Insert tour employees if provided
        if (tour.employees && tour.employees.length > 0) {
          const employeesToInsert = tour.employees.map(employee => ({
            ...employee,
            tour_id: tourId,
          }));

          const { error: employeesError } = await supabase
            .from('tour_employees')
            .insert(employeesToInsert);

          if (employeesError) throw employeesError;
        }

        return tourData;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: t('tours.createSuccess'),
        description: t('tours.createSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tourStats'] });
    },
    onError: (error: any) => {
      toast({
        title: t('tours.createError'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating a tour
  const updateTourMutation = useMutation({
    mutationFn: async (tour: TourWithRelations) => {
      setIsLoading(true);
      try {
        if (!tour.id) throw new Error(t('tours.idRequired'));

        // Update the tour
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .update({
            title: tour.title,
            vehicle_type: tour.vehicle_type,
            body_type: tour.body_type as VehicleBodyType,
            start_location: tour.start_location,
            start_location_lat: tour.start_location_lat,
            start_location_lng: tour.start_location_lng,
            end_location: tour.end_location,
            end_location_lat: tour.end_location_lat,
            end_location_lng: tour.end_location_lng,
            total_distance: tour.total_distance,
            status: tour.status as any,
            cargo_weight: tour.cargo_weight,
            cargo_volume: tour.cargo_volume,
            cargo_description: tour.cargo_description,
            is_palletized: tour.is_palletized,
            is_hazardous: tour.is_hazardous,
            temperature_sensitive: tour.temperature_sensitive,
            pallet_exchange: tour.pallet_exchange,
            start_date: tour.start_date,
            end_date: tour.end_date,
          })
          .eq('id', tour.id)
          .select()
          .single();

        if (tourError) throw tourError;

        // Update stops: Delete existing ones and insert new ones
        if (tour.stops) {
          // Delete existing stops
          const { error: deleteStopsError } = await supabase
            .from('tour_stops')
            .delete()
            .eq('tour_id', tour.id);

          if (deleteStopsError) throw deleteStopsError;

          // Insert new stops
          if (tour.stops.length > 0) {
            const stopsToInsert = tour.stops.map(stop => ({
              ...stop,
              tour_id: tour.id,
            }));

            const { error: stopsError } = await supabase
              .from('tour_stops')
              .insert(stopsToInsert);

            if (stopsError) throw stopsError;
          }
        }

        // Update schedules: Delete existing ones and insert new ones
        if (tour.schedules) {
          // Delete existing schedules
          const { error: deleteSchedulesError } = await supabase
            .from('tour_schedules')
            .delete()
            .eq('tour_id', tour.id);

          if (deleteSchedulesError) throw deleteSchedulesError;

          // Insert new schedules
          if (tour.schedules.length > 0) {
            const schedulesToInsert = tour.schedules.map(schedule => ({
              ...schedule,
              tour_id: tour.id,
            }));

            const { error: schedulesError } = await supabase
              .from('tour_schedules')
              .insert(schedulesToInsert);

            if (schedulesError) throw schedulesError;
          }
        }

        // Update vehicles: Delete existing ones and insert new ones
        if (tour.vehicles) {
          // Delete existing vehicles
          const { error: deleteVehiclesError } = await supabase
            .from('tour_vehicles')
            .delete()
            .eq('tour_id', tour.id);

          if (deleteVehiclesError) throw deleteVehiclesError;

          // Insert new vehicles
          if (tour.vehicles.length > 0) {
            const vehiclesToInsert = tour.vehicles.map(vehicle => ({
              ...vehicle,
              tour_id: tour.id,
            }));

            const { error: vehiclesError } = await supabase
              .from('tour_vehicles')
              .insert(vehiclesToInsert);

            if (vehiclesError) throw vehiclesError;
          }
        }

        // Update employees: Delete existing ones and insert new ones
        if (tour.employees) {
          // Delete existing employees
          const { error: deleteEmployeesError } = await supabase
            .from('tour_employees')
            .delete()
            .eq('tour_id', tour.id);

          if (deleteEmployeesError) throw deleteEmployeesError;

          // Insert new employees
          if (tour.employees.length > 0) {
            const employeesToInsert = tour.employees.map(employee => ({
              ...employee,
              tour_id: tour.id,
            }));

            const { error: employeesError } = await supabase
              .from('tour_employees')
              .insert(employeesToInsert);

            if (employeesError) throw employeesError;
          }
        }

        return tourData;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: t('tours.updateSuccess'),
        description: t('tours.updateSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tourStats'] });
    },
    onError: (error: any) => {
      toast({
        title: t('tours.updateError'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting a tour
  const deleteTourMutation = useMutation({
    mutationFn: async (tourId: string) => {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId);

      if (error) throw error;
      return tourId;
    },
    onSuccess: () => {
      toast({
        title: t('tours.deleteSuccess'),
        description: t('tours.deleteSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tourStats'] });
    },
    onError: (error: any) => {
      toast({
        title: t('tours.deleteError'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    tours: toursQuery.data || [],
    isLoadingTours: toursQuery.isLoading,
    isErrorTours: toursQuery.isError,
    stats: statsQuery.data || {
      total: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      averageDuration: 0,
      statusDistribution: {
        pending: 0,
        in_progress: 0,
        completed: 0,
        pendingPercent: 0,
        inProgressPercent: 0,
        completedPercent: 0,
      },
      topRegions: [],
    },
    isLoadingStats: statsQuery.isLoading,
    isErrorStats: statsQuery.isError,
    createTour: createTourMutation.mutate,
    updateTour: updateTourMutation.mutate,
    deleteTour: deleteTourMutation.mutate,
    isLoading: isLoading || createTourMutation.isPending || updateTourMutation.isPending || deleteTourMutation.isPending,
  };
}

export function useTourById(tourId?: string) {
  const { t } = useTranslation();
  const { company } = useAuth();

  const fetchTour = async (): Promise<TourWithRelations | null> => {
    if (!tourId || !company) return null;

    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        tour_stops(*),
        tour_schedules(*),
        tour_vehicles(*, vehicles:vehicle_id(*)),
        tour_employees(*, employees:employee_id(*))
      `)
      .eq('id', tourId)
      .eq('company_id', company.id)
      .single();

    if (error) {
      console.error('Error fetching tour:', error);
      toast({
        title: t('tours.fetchError'),
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }

    return data;
  };

  const tourQuery = useQuery({
    queryKey: ['tour', tourId],
    queryFn: fetchTour,
    enabled: !!tourId && !!company,
  });

  return {
    tour: tourQuery.data,
    isLoading: tourQuery.isLoading,
    isError: tourQuery.isError,
  };
}
