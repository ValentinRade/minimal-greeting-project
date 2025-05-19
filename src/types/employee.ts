
export type EmployeeType = 'employed' | 'contractor';
export type PaymentType = 'salary' | 'invoice' | 'credit'; // Changed back to match the database schema
export type LicenseType = 'B' | 'BE' | 'C1' | 'C1E' | 'C' | 'CE';

export interface License {
  id?: string; // Made optional to allow creating new licenses without IDs
  license_type: LicenseType;
  description?: string;
}

export interface Availability {
  id?: string; // Made optional to allow creating new availabilities without IDs
  day_of_week: number;
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  notes?: string;
}

export interface Region {
  id?: string; // Made optional to allow creating new regions without IDs
  country: string;
}

export interface Employee {
  id: string;
  company_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position: string;
  employee_type: EmployeeType;
  payment_type: PaymentType;
  gross_salary?: number;
  net_salary?: number;
  hourly_rate?: number;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  licenses: License[];
  availability: Availability[];
  regions: Region[];
  
  // Additional calculated fields
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
  gross_salary?: number;
  net_salary?: number;
  hourly_rate?: number;
  location?: string;
  notes?: string;
  
  licenses: License[];
  availability: Availability[];
  regions: Region[];
}

export interface EmployeeFormProps {
  onSubmit: (data: CreateEmployeeData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  defaultValues?: Employee;
  isEdit?: boolean;
}

// Adding the missing EmployeeFilter interface
export interface EmployeeFilter {
  position?: string;
  location?: string;
  status?: string;
}
