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
  title: z.string().min(5),
  type: z.enum(['MUN', 'Internship', 'Volunteering', 'Competition', 'Bootcamp', 'Hackathon', 'Workshop']),
  description: z.string().min(20),
  subject: z.string().min(2),
  grades: z.array(z.string()).min(1),
  price: z.enum(['Free', 'Paid']),
  audience: z.enum(['All Nationalities', 'Emiratis Only']),
  format: z.enum(['Online', 'Offline']),
  deadline: z.date(),
  emirate: z.enum(["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain", "All Emirates"]),
  registrationLink: z.string().url().optional().or(z.literal('')),
  detailsLink: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
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

const prepareDataForFirestore = (formData: OpportunityFormData) => {
  return {
    ...formData,
    deadline: Timestamp.fromDate(formData.deadline),
    grades: formData.grades.map(Number).sort((a,b) => a - b),
    summary: formData.description.substring(0, 100) + '...'
  };
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
        status: user.role === 'admin' ? existingOpp.status : 'pending',
    };

    await updateDoc(oppDocRef, dataToUpdate as any);
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
