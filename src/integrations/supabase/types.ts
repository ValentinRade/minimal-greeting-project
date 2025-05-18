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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    },
  },
} as const
