
import { supabase } from "@/integrations/supabase/client";
import { ShipperPreferences, ShipperPreferencesFormData } from "@/types/shipperPreference";
import { toast } from "sonner";

export const getShipperPreferences = async (): Promise<ShipperPreferences | null> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Authentication error:", userError);
    throw new Error("Benutzer nicht angemeldet");
  }

  // Get user's company
  const { data: companyUsers, error: companyError } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single();
    
  if (companyError) {
    console.error("Company retrieval error:", companyError);
    if (companyError.code === 'PGRST116') { // No rows found
      throw new Error("Kein Unternehmen gefunden. Bitte erstellen Sie zuerst ein Unternehmen.");
    }
    throw companyError;
  }
  
  if (!companyUsers?.company_id) {
    console.error("No company_id found for user", user.id);
    throw new Error("Keine Unternehmensinformationen gefunden. Bitte erstellen Sie zuerst ein Unternehmen.");
  }

  const { data, error } = await supabase
    .from('shipper_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    console.error("Error fetching shipper preferences:", error);
    throw error;
  }

  return data as ShipperPreferences;
};

export const createShipperPreferences = async (preferences: ShipperPreferencesFormData): Promise<ShipperPreferences> => {
  try {
    // First check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error("Benutzer nicht angemeldet");
    }

    // Get company_id from company_users table
    const { data: companyUsers, error: companyError } = await supabase
      .from('company_users')
      .select('company_id')
      .eq('user_id', user.id)
      .single();
    
    if (companyError) {
      console.error("Company retrieval error:", companyError);
      if (companyError.code === 'PGRST116') { // No rows found
        throw new Error("Kein Unternehmen gefunden. Bitte erstellen Sie zuerst ein Unternehmen.");
      }
      throw companyError;
    }
    
    if (!companyUsers?.company_id) {
      console.error("No company_id found for user", user.id);
      throw new Error("Keine Unternehmensinformationen gefunden. Bitte erstellen Sie zuerst ein Unternehmen.");
    }
    
    const company_id = companyUsers.company_id;

    const preferenceData = {
      user_id: user.id,
      company_id,
      ...preferences,
    };

    const { data, error } = await supabase
      .from('shipper_preferences')
      .insert(preferenceData)
      .select()
      .single();

    if (error) {
      console.error("Error creating shipper preferences:", error);
      throw error;
    }

    return data as ShipperPreferences;
  } catch (error: any) {
    console.error("Failed to create shipper preferences:", error);
    throw error;
  }
};

export const updateShipperPreferences = async (id: string, preferences: ShipperPreferencesFormData): Promise<ShipperPreferences> => {
  // Überprüfen, ob der Benutzer angemeldet ist
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Authentication error:", userError);
    throw new Error("Benutzer nicht angemeldet");
  }

  const { data, error } = await supabase
    .from('shipper_preferences')
    .update(preferences)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating shipper preferences:", error);
    throw error;
  }

  return data as ShipperPreferences;
};
