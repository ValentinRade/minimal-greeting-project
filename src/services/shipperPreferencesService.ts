
import { supabase } from "@/integrations/supabase/client";
import { ShipperPreferences, ShipperPreferencesFormData } from "@/types/shipperPreference";

export const getShipperPreferences = async (): Promise<ShipperPreferences | null> => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('shipper_preferences')
    .select('*')
    .eq('user_id', user.data.user.id)
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
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("User not authenticated");
  }

  const { data: userData } = user;
  
  // Get company_id from user metadata
  const company_id = userData.user.user_metadata?.company_id;
  
  if (!company_id) {
    throw new Error("Company information missing");
  }

  const preferenceData = {
    user_id: userData.user.id,
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
