export interface TourFormData {
  // Step 1: Vehicle requirements and certificates
  title: string;
  vehicleType: string;
  bodyType: string[];
  certificates: string[];
  
  // Step 2: Route and cargo details
  startLocation: string;
  endLocation?: string;
  totalDistance: number;
  cargo: {
    weight: number;
    volume?: number;
    description?: string;
    isPalletized: boolean;
    isHazardous: boolean;
    temperatureSensitivity?: string;
    palletExchange: boolean;
  };
  stops: {
    location: string;
    order: number;
  }[];
  
  // Step 3: Transport frequency
  startDate: Date;
  endDate?: Date;
  weeklySchedule: {
    day: number;
    isActive: boolean;
    startTime?: string;
    loadingTime?: number;
    workingTime?: number;
  }[];
  
  // Step 4: Compensation
  compensationBasis: 'fixed' | 'per_km' | 'per_time' | 'other';
  targetPrice: number;
  showTargetPrice: boolean;
  dieselSurcharge: boolean;
  commercialCalculationRequired: boolean;
  
  // Step 5: Payment terms
  billingType: 'invoice' | 'credit_note';
  paymentTerm: {
    value: number;
    unit: 'days' | 'weeks' | 'months';
  };
  currency: string;
  
  // Step 6: Summary and status
  status: 'active' | 'cancelled' | 'paused' | 'awarded';
  cancellationReason?: string;
}

// Add missing type definitions needed by components
export type TourStatus = 'active' | 'cancelled' | 'paused' | 'awarded' | 'draft' | 'completed' | 'pending' | 'in_progress';

export interface Tour {
  id: string;
  title: string;
  status: TourStatus;
  createdAt: string;
  // Add other basic tour fields as needed
  vehicle_type: string;
  body_type: string;
  start_location: string;
  end_location?: string;
  total_distance: number;
  start_date: string;
  end_date?: string;
  cargo_weight: number;
  cargo_volume?: number;
  cargo_description?: string;
  is_palletized: boolean;
  is_hazardous: boolean;
  temperature_sensitive: boolean;
  pallet_exchange: boolean;
  start_location_lat?: number;
  start_location_lng?: number;
  end_location_lat?: number;
  end_location_lng?: number;
}

export interface TourWithRelations extends Tour {
  // Add related fields like driver, vehicle, etc.
  driverId?: string;
  vehicleId?: string;
  schedules?: {
    day_of_week: number;
    is_active: boolean;
    start_time?: string;
    loading_time?: number;
    working_time?: number;
  }[];
  // Other relation fields
}

export interface TourStats {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  averageDuration: number; // Add this missing property
  statusDistribution: {
    [key: string]: number;
  };
  topRegions: {
    name: string;
    count: number;
  }[];
}

export interface TourFilterOptions {
  timeframe: 'today' | 'week' | 'month' | 'all';
  regions: string[];
  vehicleType: string;
  employeeId: string;
  status: TourStatus | 'all';
  sortBy: 'date' | 'status' | 'price';
  sortDirection: 'asc' | 'desc';
}

export type VehicleBodyType = 
  | 'tarp' // Plane
  | 'refrigerated' // Frigo
  | 'walking_floor' // Schubboden
  | 'box'
  | 'flatbed'
  | 'tank'
  | 'container'
  | 'curtain' // Added to match usage in the code
  | 'tanker' // Added to match usage in the code
  | 'other';
