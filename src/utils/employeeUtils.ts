
import { Employee, RawEmployeeFromDb } from '@/types/employee';

// Helper function to map database response to Employee interface
export const mapDbEmployeeToEmployee = (item: RawEmployeeFromDb): Employee => {
  return {
    id: item.id,
    company_id: item.company_id,
    user_id: item.user_id,
    first_name: item.first_name,
    last_name: item.last_name,
    email: item.email,
    phone: item.phone,
    position: item.position,
    employee_type: item.employee_type,
    payment_type: item.payment_type,
    gross_salary: item.gross_salary,
    net_salary: item.net_salary,
    hourly_rate: item.hourly_rate,
    location: item.location,
    notes: item.notes,
    created_at: item.created_at,
    updated_at: item.updated_at,
    licenses: item.employee_licenses || [],
    availability: item.employee_availability || [],
    regions: item.employee_regions || []
  };
};
