
import { TenderDetails } from "@/types/tender";
import { v4 as uuidv4 } from 'uuid';

// This is a simple in-memory store for now
// In a real app, this would use Supabase or another backend
let tenders: TenderDetails[] = [];

export const createTender = (tenderData: Omit<TenderDetails, 'id' | 'createdAt' | 'status' | 'toursCount'>): TenderDetails => {
  const newTender: TenderDetails = {
    ...tenderData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: 'active',
    toursCount: 0
  };
  
  tenders = [newTender, ...tenders];
  
  // In a real app, this would save to a database
  // For now, we'll just log
  console.log('Created tender:', newTender);
  
  return newTender;
};

export const getTenders = (): TenderDetails[] => {
  return tenders;
};

export const getTenderById = (id: string): TenderDetails | undefined => {
  return tenders.find(tender => tender.id === id);
};

export const updateTender = (id: string, updates: Partial<TenderDetails>): TenderDetails | undefined => {
  const index = tenders.findIndex(tender => tender.id === id);
  
  if (index === -1) return undefined;
  
  const updatedTender = { ...tenders[index], ...updates };
  tenders[index] = updatedTender;
  
  return updatedTender;
};

export const deleteTender = (id: string): boolean => {
  const initialLength = tenders.length;
  tenders = tenders.filter(tender => tender.id !== id);
  
  return tenders.length !== initialLength;
};

export { TenderDetails } from "@/types/tender";
