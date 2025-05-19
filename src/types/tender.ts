
export interface TenderDetails {
  id: string;
  tenderType: 'transport_route' | 'fixed_area';
  title: string;
  description: string;
  showContactInfo: boolean;
  prequalifications: string[];
  duration: {
    value: string;
    unit: 'days' | 'weeks' | 'months';
  };
  commercialCalculation: 'yes' | 'no';
  serviceProviderOption: 'own_fleet' | 'single_provider';
  inviteServiceProviders?: {
    email: string;
    confirmed: boolean;
  };
  contractorPreferences: {
    experience: 'less_than_1_year' | 'more_than_1_year' | 'more_than_2_years' | 'more_than_3_years';
    fleetSize: 'less_than_3_vehicles' | '3_or_more_vehicles';
    vehicleAge: 'less_than_1_year' | 'more_than_1_year' | 'more_than_2_years';
    regionality: 'local' | 'international';
    industryExperience: 'yes' | 'no';
    flexibility: '1_day' | '1_week' | '1_month' | 'more_than_1_month';
  };
  createdAt: string;
  status: 'active' | 'draft' | 'closed' | 'awarded';
  toursCount: number;
}

export interface TourFormData {
  // These will be populated in a future implementation
}
