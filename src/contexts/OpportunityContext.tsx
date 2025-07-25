'use client';
import type { Opportunity, OpportunityStatus } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import * as z from 'zod';

const opportunityFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  type: z.enum(['MUN', 'Internship', 'Volunteering', 'Competition', 'Bootcamp', 'Hackathon', 'Workshop']),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  subject: z.string().min(2, 'Subject is required.'),
  grades: z.array(z.string()).min(1, 'At least one grade must be selected.'),
  price: z.enum(['Free', 'Paid']),
  audience: z.enum(['All Nationalities', 'Emiratis Only']),
  format: z.enum(['Online', 'Offline']),
  deadline: z.date(),
  emirate: z.enum(["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain", "All Emirates"]),
  registrationLink: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  detailsLink: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});
type OpportunityFormData = z.infer<typeof opportunityFormSchema>;

interface OpportunityContextType {
  opportunities: Opportunity[];
  getOpportunityById: (id: string) => Opportunity | undefined;
  addOpportunity: (data: OpportunityFormData) => Promise<void>;
  updateOpportunityStatus: (id: string, status: OpportunityStatus) => Promise<void>;
  updateOpportunity: (id: string, data: OpportunityFormData) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  loading: boolean;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

// Helper function to prepare data for Firestore
const prepareDataForFirestore = (data: OpportunityFormData) => {
  const preparedData: any = { ...data };

  // Convert deadline to Firestore Timestamp
  if (data.deadline instanceof Date) {
    preparedData.deadline = Timestamp.fromDate(data.deadline);
  }

  // Convert grades from string array to number array
  if (data.grades) {
    preparedData.grades = data.grades.map(Number).filter(n => !isNaN(n));
  }

  // Generate a simple summary
  preparedData.summary = data.description ? data.description.substring(0, 100) + '...' : '';
  
  return preparedData;
};

export const OpportunityProvider = ({ children }: { children: ReactNode }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const opportunitiesData: Opportunity[] = [];
      querySnapshot.forEach((doc) => {
        opportunitiesData.push({ id: doc.id, ...doc.data() } as Opportunity);
      });
      setOpportunities(opportunitiesData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching opportunities:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getOpportunityById = (id: string) => {
    return opportunities.find(opp => opp.id === id);
  };

  const addOpportunity = async (formData: OpportunityFormData) => {
    if (!user) throw new Error("User not authenticated");

    const dataToSave = {
      ...prepareDataForFirestore(formData),
      status: user.role === 'admin' ? 'approved' : 'pending',
      submittedBy: user.id,
      createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(db, 'opportunities'), dataToSave);
  };
  
  const updateOpportunity = async (id: string, formData: OpportunityFormData) => {
    if (!user) throw new Error("User not authenticated");
    const oppDocRef = doc(db, 'opportunities', id);
    
    const existingOpp = getOpportunityById(id);
    if (!existingOpp) throw new Error("Opportunity not found");

    const dataToUpdate = {
        ...prepareDataForFirestore(formData),
        // Preserve original status if admin is editing, otherwise reset to pending
        status: user.role === 'admin' ? existingOpp.status : 'pending',
    };

    await updateDoc(oppDocRef, dataToUpdate);
  };

  const updateOpportunityStatus = async (id:string, status: OpportunityStatus) => {
    const oppDocRef = doc(db, 'opportunities', id);
    await updateDoc(oppDocRef, { status });
  }

  const deleteOpportunity = async (id: string) => {
    const oppDocRef = doc(db, 'opportunities', id);
    await deleteDoc(oppDocRef);
  };

  return (
    <OpportunityContext.Provider value={{ opportunities, getOpportunityById, addOpportunity, updateOpportunityStatus, updateOpportunity, deleteOpportunity, loading }}>
      {children}
    </OpportunityContext.Provider>
  );
};

export const useOpportunities = () => {
  const context = useContext(OpportunityContext);
  if (context === undefined) {
    throw new Error('useOpportunities must be used within an OpportunityProvider');
  }
  return context;
};
