
export interface ShipperPreferences {
  id: string;
  user_id: string;
  company_id: string;
  industry: string;
  transport_routes: string[];
  transport_types: string[];
  vehicle_types: string[];
  subcontractor_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'rarely';
  selection_criteria: {
    price: boolean;
    punctuality: boolean;
    communication: boolean;
    vehicle_condition: boolean;
    experience: boolean;
    language_skills: boolean;
    ratings: boolean;
    flexibility: boolean;
    regional_availability: boolean;
    documentation: boolean;
    weekend_availability: boolean;
    longterm_cooperation: boolean;
    sensitive_cargo: boolean;
  };
  required_languages: string[];
  industry_requirements: string;
  partnership_preference: 'longterm' | 'shortterm' | 'both';
  communication_preferences: string;
  additional_requirements: string;
  created_at: string;
  updated_at: string;
}

export interface ShipperPreferencesFormData {
  industry: string;
  transport_routes: string[];
  transport_types: string[];
  vehicle_types: string[];
  subcontractor_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'rarely';
  selection_criteria: {
    price: boolean;
    punctuality: boolean;
    communication: boolean;
    vehicle_condition: boolean;
    experience: boolean;
    language_skills: boolean;
    ratings: boolean;
    flexibility: boolean;
    regional_availability: boolean;
    documentation: boolean;
    weekend_availability: boolean;
    longterm_cooperation: boolean;
    sensitive_cargo: boolean;
  };
  required_languages: string[];
  industry_requirements: string;
  partnership_preference: 'longterm' | 'shortterm' | 'both';
  communication_preferences: string;
  additional_requirements: string;
}
