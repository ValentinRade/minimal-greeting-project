
import { supabase } from "@/integrations/supabase/client";
import { ShipperPreferences, ShipperPreferencesFormData } from "@/types/shipperPreference";

export const getShipperPreferences = async (): Promise<ShipperPreferences | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      throw new Error("User not authenticated");
    }

    // Log the user information for debugging
    console.log("Authenticated user:", user.id);

    const { data, error } = await supabase
      .from('shipper_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching shipper preferences:", error);
      throw error;
    }

    return data as ShipperPreferences;
  } catch (error) {
    console.error("Error in getShipperPreferences:", error);
    throw error;
  }
};

export const createShipperPreferences = async (preferences: ShipperPreferencesFormData): Promise<ShipperPreferences> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      throw new Error("User not authenticated");
    }

    // Get company_id from user metadata
    const company_id = user.user_metadata?.company_id;
    
    if (!company_id) {
      console.error("Company information missing from user metadata:", user);
      throw new Error("Company information missing. Please ensure you have created a company and are properly logged in.");
    }

    const preferenceData = {
      user_id: user.id,
      company_id,
      ...preferences,
    };

    console.log("Creating preferences with:", preferenceData);

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
  } catch (error) {
    console.error("Error in createShipperPreferences:", error);
    throw error;
  }
};

export const updateShipperPreferences = async (id: string, preferences: ShipperPreferencesFormData): Promise<ShipperPreferences> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      throw new Error("User not authenticated");
    }

    console.log("Updating preferences with ID:", id, "Data:", preferences);

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
  } catch (error) {
    console.error("Error in updateShipperPreferences:", error);
    throw error;
  }
};
