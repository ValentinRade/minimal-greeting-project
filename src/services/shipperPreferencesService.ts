
import { supabase } from "@/integrations/supabase/client";
import { ShipperPreferences, ShipperPreferencesFormData } from "@/types/shipperPreference";

export const getShipperPreferences = async (): Promise<ShipperPreferences | null> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
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
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Get company_id from user metadata
  const company_id = user.user_metadata?.company_id;
  
  if (!company_id) {
    console.error("Company information missing", user);
    throw new Error("Company information missing. Bitte stellen Sie sicher, dass Sie ein Unternehmen erstellt haben und angemeldet sind.");
  }

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
};

export const updateShipperPreferences = async (id: string, preferences: ShipperPreferencesFormData): Promise<ShipperPreferences> => {
  // Überprüfen, ob der Benutzer angemeldet ist
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
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
