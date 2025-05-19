export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      body_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          city: string
          company_type_id: number
          country: string
          created_at: string
          id: string
          legal_form_id: number
          name: string
          postal_code: string
          street: string
          tax_number: string | null
          updated_at: string
          user_id: string
          vat_id: string | null
        }
        Insert: {
          city: string
          company_type_id: number
          country?: string
          created_at?: string
          id?: string
          legal_form_id: number
          name: string
          postal_code: string
          street: string
          tax_number?: string | null
          updated_at?: string
          user_id: string
          vat_id?: string | null
        }
        Update: {
          city?: string
          company_type_id?: number
          country?: string
          created_at?: string
          id?: string
          legal_form_id?: number
          name?: string
          postal_code?: string
          street?: string
          tax_number?: string | null
          updated_at?: string
          user_id?: string
          vat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_company_type_id_fkey"
            columns: ["company_type_id"]
            isOneToOne: false
            referencedRelation: "company_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_legal_form_id_fkey"
            columns: ["legal_form_id"]
            isOneToOne: false
            referencedRelation: "company_legal_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      company_invitations: {
        Row: {
          accepted_at: string | null
          company_id: string
          email: string
          expires_at: string
          id: string
          invited_at: string | null
          invited_by: string
          role: Database["public"]["Enums"]["company_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          email: string
          expires_at: string
          id?: string
          invited_at?: string | null
          invited_by: string
          role: Database["public"]["Enums"]["company_role"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          email?: string
          expires_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string
          role?: Database["public"]["Enums"]["company_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_legal_forms: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      company_types: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      company_users: {
        Row: {
          accepted_at: string | null
          company_id: string
          id: string
          invited_at: string | null
          invited_by: string | null
          role: Database["public"]["Enums"]["company_role"]
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role: Database["public"]["Enums"]["company_role"]
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role?: Database["public"]["Enums"]["company_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_availability: {
        Row: {
          created_at: string
          day_of_week: number
          employee_id: string
          end_time: string | null
          id: string
          is_available: boolean
          notes: string | null
          start_time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          employee_id: string
          end_time?: string | null
          id?: string
          is_available?: boolean
          notes?: string | null
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          employee_id?: string
          end_time?: string | null
          id?: string
          is_available?: boolean
          notes?: string | null
          start_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_availability_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_licenses: {
        Row: {
          created_at: string
          description: string | null
          employee_id: string
          id: string
          license_type: Database["public"]["Enums"]["license_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_id: string
          id?: string
          license_type: Database["public"]["Enums"]["license_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_id?: string
          id?: string
          license_type?: Database["public"]["Enums"]["license_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_licenses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_regions: {
        Row: {
          country: string
          created_at: string
          employee_id: string
          id: string
        }
        Insert: {
          country: string
          created_at?: string
          employee_id: string
          id?: string
        }
        Update: {
          country?: string
          created_at?: string
          employee_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_regions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          employee_type: Database["public"]["Enums"]["employee_type"]
          first_name: string
          gross_salary: number | null
          hourly_rate: number | null
          id: string
          last_name: string
          location: string | null
          net_salary: number | null
          notes: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          phone: string | null
          position: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          employee_type?: Database["public"]["Enums"]["employee_type"]
          first_name: string
          gross_salary?: number | null
          hourly_rate?: number | null
          id?: string
          last_name: string
          location?: string | null
          net_salary?: number | null
          notes?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          phone?: string | null
          position: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          employee_type?: Database["public"]["Enums"]["employee_type"]
          first_name?: string
          gross_salary?: number | null
          hourly_rate?: number | null
          id?: string
          last_name?: string
          location?: string | null
          net_salary?: number | null
          notes?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          phone?: string | null
          position?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      financing_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          language: string | null
          last_name: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          language?: string | null
          last_name: string
          phone: string
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          language?: string | null
          last_name?: string
          phone?: string
        }
        Relationships: []
      }
      subcontractor_preferences: {
        Row: {
          client_types: string[]
          communication: Json
          company_id: string
          created_at: string
          expectations_from_shipper: string | null
          flexibility: string
          frequent_routes: string[]
          id: string
          order_preference: string
          preferred_tour_types: string[]
          problem_handling: string | null
          specialization: string | null
          start_date_transport: Json
          team_size: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          client_types?: string[]
          communication?: Json
          company_id: string
          created_at?: string
          expectations_from_shipper?: string | null
          flexibility?: string
          frequent_routes?: string[]
          id?: string
          order_preference?: string
          preferred_tour_types?: string[]
          problem_handling?: string | null
          specialization?: string | null
          start_date_transport?: Json
          team_size?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          client_types?: string[]
          communication?: Json
          company_id?: string
          created_at?: string
          expectations_from_shipper?: string | null
          flexibility?: string
          frequent_routes?: string[]
          id?: string
          order_preference?: string
          preferred_tour_types?: string[]
          problem_handling?: string | null
          specialization?: string | null
          start_date_transport?: Json
          team_size?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_preferences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractor_prequalifications: {
        Row: {
          adr_1000_points: boolean
          adr_1000_points_document: string | null
          adr_certificate: boolean
          adr_certificate_document: string | null
          bna_registration: boolean
          bna_registration_document: string | null
          company_id: string
          created_at: string
          eu_license: boolean
          eu_license_document: string | null
          id: string
          other_qualification: boolean
          other_qualification_document: string | null
          other_qualification_name: string | null
          pq_kep: boolean
          pq_kep_document: string | null
          updated_at: string
        }
        Insert: {
          adr_1000_points?: boolean
          adr_1000_points_document?: string | null
          adr_certificate?: boolean
          adr_certificate_document?: string | null
          bna_registration?: boolean
          bna_registration_document?: string | null
          company_id: string
          created_at?: string
          eu_license?: boolean
          eu_license_document?: string | null
          id?: string
          other_qualification?: boolean
          other_qualification_document?: string | null
          other_qualification_name?: string | null
          pq_kep?: boolean
          pq_kep_document?: string | null
          updated_at?: string
        }
        Update: {
          adr_1000_points?: boolean
          adr_1000_points_document?: string | null
          adr_certificate?: boolean
          adr_certificate_document?: string | null
          bna_registration?: boolean
          bna_registration_document?: string | null
          company_id?: string
          created_at?: string
          eu_license?: boolean
          eu_license_document?: string | null
          id?: string
          other_qualification?: boolean
          other_qualification_document?: string | null
          other_qualification_name?: string | null
          pq_kep?: boolean
          pq_kep_document?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_prequalifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractor_references: {
        Row: {
          allow_publication: boolean
          anonymize: boolean
          category: string
          company_id: string | null
          created_at: string
          customer_feedback_url: string | null
          customer_name: string | null
          end_date: string | null
          id: string
          industry: string
          start_date: string
          until_today: boolean
          updated_at: string
        }
        Insert: {
          allow_publication?: boolean
          anonymize?: boolean
          category: string
          company_id?: string | null
          created_at?: string
          customer_feedback_url?: string | null
          customer_name?: string | null
          end_date?: string | null
          id?: string
          industry: string
          start_date: string
          until_today?: boolean
          updated_at?: string
        }
        Update: {
          allow_publication?: boolean
          anonymize?: boolean
          category?: string
          company_id?: string | null
          created_at?: string
          customer_feedback_url?: string | null
          customer_name?: string | null
          end_date?: string | null
          id?: string
          industry?: string
          start_date?: string
          until_today?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcontractor_references_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_employees: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          tour_id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          tour_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_employees_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_schedules: {
        Row: {
          created_at: string
          day_of_week: number
          id: string
          is_active: boolean
          loading_time: number | null
          start_time: string | null
          tour_id: string
          updated_at: string
          working_time: number | null
        }
        Insert: {
          created_at?: string
          day_of_week: number
          id?: string
          is_active?: boolean
          loading_time?: number | null
          start_time?: string | null
          tour_id: string
          updated_at?: string
          working_time?: number | null
        }
        Update: {
          created_at?: string
          day_of_week?: number
          id?: string
          is_active?: boolean
          loading_time?: number | null
          start_time?: string | null
          tour_id?: string
          updated_at?: string
          working_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_schedules_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_stops: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string
          location_lat: number | null
          location_lng: number | null
          stop_number: number
          tour_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location: string
          location_lat?: number | null
          location_lng?: number | null
          stop_number: number
          tour_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          location_lat?: number | null
          location_lng?: number | null
          stop_number?: number
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_stops_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_vehicles: {
        Row: {
          created_at: string
          id: string
          tour_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tour_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tour_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_vehicles_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          body_type: Database["public"]["Enums"]["vehicle_body_type"]
          cargo_description: string | null
          cargo_volume: number | null
          cargo_weight: number
          company_id: string
          created_at: string
          end_date: string
          end_location: string | null
          end_location_lat: number | null
          end_location_lng: number | null
          id: string
          is_hazardous: boolean | null
          is_palletized: boolean | null
          pallet_exchange: boolean | null
          start_date: string
          start_location: string
          start_location_lat: number | null
          start_location_lng: number | null
          status: Database["public"]["Enums"]["tour_status"]
          temperature_sensitive: boolean | null
          title: string
          total_distance: number
          updated_at: string
          user_id: string
          vehicle_type: string
        }
        Insert: {
          body_type: Database["public"]["Enums"]["vehicle_body_type"]
          cargo_description?: string | null
          cargo_volume?: number | null
          cargo_weight: number
          company_id: string
          created_at?: string
          end_date: string
          end_location?: string | null
          end_location_lat?: number | null
          end_location_lng?: number | null
          id?: string
          is_hazardous?: boolean | null
          is_palletized?: boolean | null
          pallet_exchange?: boolean | null
          start_date: string
          start_location: string
          start_location_lat?: number | null
          start_location_lng?: number | null
          status?: Database["public"]["Enums"]["tour_status"]
          temperature_sensitive?: boolean | null
          title: string
          total_distance: number
          updated_at?: string
          user_id: string
          vehicle_type: string
        }
        Update: {
          body_type?: Database["public"]["Enums"]["vehicle_body_type"]
          cargo_description?: string | null
          cargo_volume?: number | null
          cargo_weight?: number
          company_id?: string
          created_at?: string
          end_date?: string
          end_location?: string | null
          end_location_lat?: number | null
          end_location_lng?: number | null
          id?: string
          is_hazardous?: boolean | null
          is_palletized?: boolean | null
          pallet_exchange?: boolean | null
          start_date?: string
          start_location?: string
          start_location_lat?: number | null
          start_location_lng?: number | null
          status?: Database["public"]["Enums"]["tour_status"]
          temperature_sensitive?: boolean | null
          title?: string
          total_distance?: number
          updated_at?: string
          user_id?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          additional_info: string | null
          additional_tech_info: string | null
          availability_schedule: Json | null
          body_type_id: string | null
          brand: string
          company_id: string
          created_at: string | null
          driver_id: string | null
          engine_power: number | null
          engine_power_unit: string | null
          fin: string | null
          financing_details: Json | null
          financing_type_id: string | null
          fuel_consumption: number | null
          height: number | null
          id: string
          inspection_report_url: string | null
          last_inspection: string | null
          length: number | null
          license_plate: string
          load_volume: number | null
          location: string | null
          maintenance_interval: number | null
          model: string
          operational_costs: Json | null
          total_weight: number | null
          updated_at: string | null
          user_id: string
          vehicle_type_id: string | null
          width: number | null
          year: number
        }
        Insert: {
          additional_info?: string | null
          additional_tech_info?: string | null
          availability_schedule?: Json | null
          body_type_id?: string | null
          brand: string
          company_id: string
          created_at?: string | null
          driver_id?: string | null
          engine_power?: number | null
          engine_power_unit?: string | null
          fin?: string | null
          financing_details?: Json | null
          financing_type_id?: string | null
          fuel_consumption?: number | null
          height?: number | null
          id?: string
          inspection_report_url?: string | null
          last_inspection?: string | null
          length?: number | null
          license_plate: string
          load_volume?: number | null
          location?: string | null
          maintenance_interval?: number | null
          model: string
          operational_costs?: Json | null
          total_weight?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_type_id?: string | null
          width?: number | null
          year: number
        }
        Update: {
          additional_info?: string | null
          additional_tech_info?: string | null
          availability_schedule?: Json | null
          body_type_id?: string | null
          brand?: string
          company_id?: string
          created_at?: string | null
          driver_id?: string | null
          engine_power?: number | null
          engine_power_unit?: string | null
          fin?: string | null
          financing_details?: Json | null
          financing_type_id?: string | null
          fuel_consumption?: number | null
          height?: number | null
          id?: string
          inspection_report_url?: string | null
          last_inspection?: string | null
          length?: number | null
          license_plate?: string
          load_volume?: number | null
          location?: string | null
          maintenance_interval?: number | null
          model?: string
          operational_costs?: Json | null
          total_weight?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_type_id?: string | null
          width?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_body_type_id_fkey"
            columns: ["body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_financing_type_id_fkey"
            columns: ["financing_type_id"]
            isOneToOne: false
            referencedRelation: "financing_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_employee_tour_count: {
        Args: { employee_id: string }
        Returns: number
      }
      get_employee_vehicle_count: {
        Args: { employee_id: string }
        Returns: number
      }
      get_user_emails: {
        Args: { user_ids: string[] }
        Returns: {
          user_id: string
          email: string
        }[]
      }
      is_company_admin: {
        Args: { company_id: string }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          _company_id: string
          _role: Database["public"]["Enums"]["company_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      company_role:
        | "company_admin"
        | "logistics_manager"
        | "finance_manager"
        | "employee"
        | "driver"
      employee_type: "employed" | "contractor"
      license_type: "B" | "BE" | "C1" | "C1E" | "C" | "CE"
      payment_type: "salary" | "invoice" | "credit"
      tour_status: "pending" | "in_progress" | "completed"
      vehicle_body_type:
        | "box"
        | "curtain"
        | "refrigerated"
        | "tanker"
        | "flatbed"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      company_role: [
        "company_admin",
        "logistics_manager",
        "finance_manager",
        "employee",
        "driver",
      ],
      employee_type: ["employed", "contractor"],
      license_type: ["B", "BE", "C1", "C1E", "C", "CE"],
      payment_type: ["salary", "invoice", "credit"],
      tour_status: ["pending", "in_progress", "completed"],
      vehicle_body_type: [
        "box",
        "curtain",
        "refrigerated",
        "tanker",
        "flatbed",
        "other",
      ],
    },
  },
} as const
