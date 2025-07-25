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

// Define a type for the data coming directly from the form
type OpportunityFormData = Omit<Opportunity, 'id' | 'status' | 'createdAt' | 'submittedBy' | 'deadline' | 'grades'> & {
  deadline: Date;
  grades: string[];
};


interface OpportunityContextType {
  opportunities: Opportunity[];
  getOpportunityById: (id: string) => Opportunity | undefined;
  addOpportunity: (opportunity: OpportunityFormData) => Promise<void>;
  updateOpportunityStatus: (id: string, status: OpportunityStatus) => Promise<void>;
  updateOpportunity: (id: string, updatedOpportunity: OpportunityFormData) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  loading: boolean;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

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
    });

    return () => unsubscribe();
  }, []);

  const getOpportunityById = (id: string) => {
    return opportunities.find(opp => opp.id === id);
  };

  const addOpportunity = async (opportunityData: OpportunityFormData) => {
    if (!user) throw new Error("User not authenticated");

    // All data processing happens here, before saving to Firestore
    const dataToSave = {
      ...opportunityData,
      deadline: Timestamp.fromDate(opportunityData.deadline),
      grades: opportunityData.grades.map(Number),
      status: user.role === 'admin' ? 'approved' : 'pending',
      submittedBy: user.id,
      createdAt: serverTimestamp()
    };
    
    await addDoc(collection(db, 'opportunities'), dataToSave);
  };
  
  const updateOpportunity = async (id: string, updatedData: OpportunityFormData) => {
    if (!user) throw new Error("User not authenticated");
    const oppDocRef = doc(db, 'opportunities', id);
    
    // Process data just before updating
    const dataToUpdate = {
        ...updatedData,
        deadline: Timestamp.fromDate(updatedData.deadline),
        grades: updatedData.grades.map(Number),
        // If a non-admin edits, status goes to pending. If admin edits, status is preserved.
        status: user.role === 'admin' ? getOpportunityById(id)?.status || 'approved' : 'pending'
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
