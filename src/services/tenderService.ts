
import { TenderDetails } from "@/types/tender";
import { supabase } from "@/integrations/supabase/client";

export const createTender = async (tenderData: Omit<TenderDetails, 'id' | 'createdAt' | 'status' | 'toursCount'>) => {
  const user = supabase.auth.getUser();
  const { data: userData } = await user;
  
  if (!userData.user) {
    throw new Error("User not authenticated");
  }
  
  // Bereite die Daten für die Supabase-Tabelle vor
  const dbTenderData = {
    user_id: userData.user.id,
    title: tenderData.title,
    description: tenderData.description,
    tender_type: tenderData.tenderType,
    show_contact_info: tenderData.showContactInfo,
    prequalifications: tenderData.prequalifications,
    duration: tenderData.duration,
    commercial_calculation: tenderData.commercialCalculation === 'yes',
    service_provider_option: tenderData.serviceProviderOption,
    contractor_preferences: tenderData.contractorPreferences,
    status: 'active',
    company_id: userData.user.user_metadata?.company_id || null,
  };

  // Speichere in Supabase
  const { data, error } = await supabase
    .from('tenders')
    .insert(dbTenderData)
    .select()
    .single();

  if (error) {
    console.error("Error creating tender:", error);
    throw error;
  }

  // Speichere die Einladungen, falls vorhanden
  if (tenderData.inviteServiceProviders?.email) {
    const invitationData = {
      tender_id: data.id,
      email: tenderData.inviteServiceProviders.email,
      confirmed: tenderData.inviteServiceProviders.confirmed || false,
    };

    const { error: invitationError } = await supabase
      .from('tender_invitations')
      .insert(invitationData);

    if (invitationError) {
      console.error("Error creating tender invitation:", invitationError);
      // Wir werfen keinen Fehler, da das Hauptobjekt erfolgreich erstellt wurde
    }
  }

  // Konvertiere zurück zum TenderDetails-Format
  const newTender: TenderDetails = {
    id: data.id,
    title: data.title,
    description: data.description || '',
    tenderType: data.tender_type,
    showContactInfo: data.show_contact_info,
    prequalifications: data.prequalifications || [],
    duration: data.duration,
    commercialCalculation: data.commercial_calculation ? 'yes' : 'no',
    serviceProviderOption: data.service_provider_option,
    inviteServiceProviders: { 
      email: tenderData.inviteServiceProviders?.email || '',
      confirmed: tenderData.inviteServiceProviders?.confirmed || false 
    },
    contractorPreferences: data.contractor_preferences,
    createdAt: data.created_at,
    status: data.status,
    toursCount: 0
  };
  
  return newTender;
};

export const getTenders = async (): Promise<TenderDetails[]> => {
  const { data: tenders, error } = await supabase
    .from('tenders')
    .select(`
      id, 
      title, 
      description, 
      tender_type, 
      show_contact_info, 
      prequalifications, 
      duration, 
      commercial_calculation, 
      service_provider_option, 
      contractor_preferences,
      created_at,
      status
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tenders:", error);
    throw error;
  }

  // Zähle die zugehörigen Touren
  const tendersWithTourCount = await Promise.all(tenders.map(async (tender) => {
    const { count, error: countError } = await supabase
      .from('tender_tours')
      .select('*', { count: 'exact', head: true })
      .eq('tender_id', tender.id);

    if (countError) {
      console.error("Error counting tours for tender:", countError);
    }

    return {
      id: tender.id,
      title: tender.title,
      description: tender.description || '',
      tenderType: tender.tender_type,
      showContactInfo: tender.show_contact_info,
      prequalifications: tender.prequalifications || [],
      duration: tender.duration,
      commercialCalculation: tender.commercial_calculation ? 'yes' : 'no',
      serviceProviderOption: tender.service_provider_option,
      inviteServiceProviders: { email: '', confirmed: false },
      contractorPreferences: tender.contractor_preferences,
      createdAt: tender.created_at,
      status: tender.status,
      toursCount: count || 0
    };
  }));

  return tendersWithTourCount;
};

export const getTenderById = async (id: string): Promise<TenderDetails | undefined> => {
  const { data: tender, error } = await supabase
    .from('tenders')
    .select(`
      id, 
      title, 
      description, 
      tender_type, 
      show_contact_info, 
      prequalifications, 
      duration, 
      commercial_calculation, 
      service_provider_option, 
      contractor_preferences,
      created_at,
      status
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching tender:", error);
    return undefined;
  }

  // Zähle die zugehörigen Touren
  const { count, error: countError } = await supabase
    .from('tender_tours')
    .select('*', { count: 'exact', head: true })
    .eq('tender_id', tender.id);

  if (countError) {
    console.error("Error counting tours for tender:", countError);
  }

  // Hole die zugehörige Einladung, falls vorhanden
  const { data: invitation, error: invitationError } = await supabase
    .from('tender_invitations')
    .select('email, confirmed')
    .eq('tender_id', tender.id)
    .maybeSingle();

  if (invitationError) {
    console.error("Error fetching invitation for tender:", invitationError);
  }

  return {
    id: tender.id,
    title: tender.title,
    description: tender.description || '',
    tenderType: tender.tender_type,
    showContactInfo: tender.show_contact_info,
    prequalifications: tender.prequalifications || [],
    duration: tender.duration,
    commercialCalculation: tender.commercial_calculation ? 'yes' : 'no',
    serviceProviderOption: tender.service_provider_option,
    inviteServiceProviders: invitation 
      ? { email: invitation.email, confirmed: invitation.confirmed || false }
      : { email: '', confirmed: false },
    contractorPreferences: tender.contractor_preferences,
    createdAt: tender.created_at,
    status: tender.status,
    toursCount: count || 0
  };
};

export const updateTender = async (id: string, updates: Partial<TenderDetails>): Promise<TenderDetails | undefined> => {
  // Bereite die Daten für die Supabase-Tabelle vor
  const dbUpdates: any = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.tenderType !== undefined) dbUpdates.tender_type = updates.tenderType;
  if (updates.showContactInfo !== undefined) dbUpdates.show_contact_info = updates.showContactInfo;
  if (updates.prequalifications !== undefined) dbUpdates.prequalifications = updates.prequalifications;
  if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
  if (updates.commercialCalculation !== undefined) 
    dbUpdates.commercial_calculation = updates.commercialCalculation === 'yes';
  if (updates.serviceProviderOption !== undefined) dbUpdates.service_provider_option = updates.serviceProviderOption;
  if (updates.contractorPreferences !== undefined) dbUpdates.contractor_preferences = updates.contractorPreferences;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  // Aktualisiere in Supabase
  const { data: updatedTender, error } = await supabase
    .from('tenders')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tender:", error);
    return undefined;
  }

  // Aktualisiere die Einladung, falls angegeben
  if (updates.inviteServiceProviders) {
    const { data: existingInvitation } = await supabase
      .from('tender_invitations')
      .select('id')
      .eq('tender_id', id)
      .maybeSingle();

    const invitationData = {
      tender_id: id,
      email: updates.inviteServiceProviders.email,
      confirmed: updates.inviteServiceProviders.confirmed || false,
    };

    // Aktualisiere oder erstelle die Einladung
    if (existingInvitation) {
      await supabase
        .from('tender_invitations')
        .update(invitationData)
        .eq('id', existingInvitation.id);
    } else if (updates.inviteServiceProviders.email) {
      await supabase
        .from('tender_invitations')
        .insert(invitationData);
    }
  }

  // Hole die aktualisierte Version mit allen Beziehungen
  return getTenderById(id);
};

export const deleteTender = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tenders')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting tender:", error);
    return false;
  }
  
  return true;
};

// Neue Funktion zum Verknüpfen einer Tour mit einer Ausschreibung
export const addTourToTender = async (tenderId: string, tourId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tender_tours')
    .insert({
      tender_id: tenderId,
      tour_id: tourId
    });

  if (error) {
    console.error("Error adding tour to tender:", error);
    return false;
  }

  return true;
};

// Neue Funktion zum Entfernen einer Tour aus einer Ausschreibung
export const removeTourFromTender = async (tenderId: string, tourId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tender_tours')
    .delete()
    .match({
      tender_id: tenderId,
      tour_id: tourId
    });

  if (error) {
    console.error("Error removing tour from tender:", error);
    return false;
  }

  return true;
};

// Neue Funktion zum Abrufen aller Touren einer Ausschreibung
export const getTenderTours = async (tenderId: string) => {
  const { data, error } = await supabase
    .from('tender_tours')
    .select(`
      tour_id,
      tours:tour_id(*)
    `)
    .eq('tender_id', tenderId);

  if (error) {
    console.error("Error fetching tours for tender:", error);
    return [];
  }

  return data.map((item: any) => item.tours);
};
