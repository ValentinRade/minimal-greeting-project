
import { Tour } from '@/integrations/supabase/types';

export type TourStatus = 'pending' | 'in_progress' | 'completed';

export type VehicleBodyType = 'box' | 'curtain' | 'refrigerated' | 'tanker' | 'flatbed' | 'other';

export interface TourStop {
  id?: string;
  tour_id?: string;
  stop_number: number;
  location: string;
  location_lat?: number;
  location_lng?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TourSchedule {
  id?: string;
  tour_id?: string;
  day_of_week: number;
  is_active: boolean;
  start_time?: string;
  loading_time?: number;
  working_time?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TourVehicle {
  id?: string;
  tour_id?: string;
  vehicle_id: string;
  created_at?: string;
}

export interface TourEmployee {
  id?: string;
  tour_id?: string;
  employee_id: string;
  created_at?: string;
}

export interface TourWithRelations extends Tour {
  stops?: TourStop[];
  schedules?: TourSchedule[];
  vehicles?: TourVehicle[];
  employees?: TourEmployee[];
}

export interface TourStats {
  total: number;
  averageDuration: number;
  statusDistribution: {
    pending: number;
    in_progress: number;
    completed: number;
    pendingPercent: number;
    inProgressPercent: number;
    completedPercent: number;
  };
  topRegions: { region: string; count: number }[];
}

export interface TourFilterOptions {
  timeframe: 'today' | 'this_week' | 'this_month' | 'all';
  regions: string[];
  vehicleType: string;
  employeeId: string;
  status: TourStatus | 'all';
  sortBy: 'date' | 'region' | 'status' | 'resources';
  sortDirection: 'asc' | 'desc';
}
