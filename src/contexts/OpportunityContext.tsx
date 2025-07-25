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
  orderBy
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface OpportunityContextType {
  opportunities: Opportunity[];
  getOpportunityById: (id: string) => Opportunity | undefined;
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'status' | 'createdAt' | 'submittedBy' | 'summary' | 'ageRange'>) => Promise<void>;
  updateOpportunityStatus: (id: string, status: OpportunityStatus) => Promise<void>;
  updateOpportunity: (id: string, updatedOpportunity: Partial<Omit<Opportunity, 'id' | 'status' | 'createdAt' | 'summary' | 'ageRange'>>) => Promise<void>;
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

  const addOpportunity = async (opportunityData: Omit<Opportunity, 'id' | 'status' | 'createdAt' | 'submittedBy' | 'summary' | 'ageRange'>) => {
    if (!user) throw new Error("User not authenticated");
    
    await addDoc(collection(db, 'opportunities'), {
      ...opportunityData,
      grades: opportunityData.grades.map(Number),
      status: user.role === 'admin' ? 'approved' : 'pending',
      submittedBy: user.id,
      createdAt: serverTimestamp()
    });
  };
  
  const updateOpportunity = async (id: string, updatedData: Partial<Omit<Opportunity, 'id' | 'status' | 'createdAt' | 'summary' | 'ageRange'>>) => {
    if (!user) throw new Error("User not authenticated");
    const oppDocRef = doc(db, 'opportunities', id);
    
    const dataToUpdate: any = { ...updatedData };

    if (updatedData.grades) {
        dataToUpdate.grades = updatedData.grades.map(Number);
    }
    
    // Only reset status to pending if a non-admin is editing
    if (user.role !== 'admin') {
      dataToUpdate.status = 'pending';
    }

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
