
export type EmployeeType = 'employed' | 'contractor';
export type PaymentType = 'salary' | 'invoice' | 'credit';
export type LicenseType = 'B' | 'BE' | 'C1' | 'C1E' | 'C' | 'CE';

export interface License {
  id?: string;
  license_type: LicenseType;
  description?: string;
}

export interface Availability {
  id?: string;
  day_of_week: number;
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  notes?: string;
}

export interface Region {
  id?: string;
  country: string;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position: string;
  employee_type: EmployeeType;
  payment_type: PaymentType;
  hourly_rate?: number | null;
  net_salary?: number | null;
  gross_salary?: number | null;
  location?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  licenses?: License[];
  availability?: Availability[];
  regions?: Region[];
  tour_count?: number;
  vehicle_count?: number;
}

export interface CreateEmployeeData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position: string;
  employee_type: EmployeeType;
  payment_type: PaymentType;
  hourly_rate?: number | null;
  net_salary?: number | null;
  gross_salary?: number | null;
  location?: string;
  notes?: string;
  licenses: License[];
  availability: Availability[];
  regions: Region[];
}
