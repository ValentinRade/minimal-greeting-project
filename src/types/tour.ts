
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
