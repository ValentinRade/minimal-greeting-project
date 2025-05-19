
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

export interface Tour {
  id?: string;
  company_id?: string;
  user_id?: string;
  title: string;
  vehicle_type: string;
  body_type: VehicleBodyType;
  start_location: string;
  start_location_lat?: number;
  start_location_lng?: number;
  end_location?: string;
  end_location_lat?: number;
  end_location_lng?: number;
  total_distance: number;
  status: TourStatus;
  cargo_weight: number;
  cargo_volume?: number;
  cargo_description?: string;
  is_palletized?: boolean;
  is_hazardous?: boolean;
  temperature_sensitive?: boolean;
  pallet_exchange?: boolean;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
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
