'use client';
import type { Opportunity, OpportunityStatus } from '@/lib/types';
import { mockOpportunities } from '@/lib/mock-data';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OpportunityContextType {
  opportunities: Opportunity[];
  getOpportunityById: (id: string) => Opportunity | undefined;
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'status'>) => void;
  updateOpportunityStatus: (id: string, status: OpportunityStatus) => void;
  updateOpportunity: (id: string, updatedOpportunity: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export const OpportunityProvider = ({ children }: { children: ReactNode }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);

  const getOpportunityById = (id: string) => {
    return opportunities.find(opp => opp.id === id);
  };

  const addOpportunity = (opportunityData: Omit<Opportunity, 'id' | 'status'>) => {
    const newOpportunity: Opportunity = {
      ...opportunityData,
      id: `opp-${Date.now()}`,
      status: 'pending',
    };
    setOpportunities(prev => [newOpportunity, ...prev]);
  };
  
  const updateOpportunity = (id: string, updatedData: Partial<Opportunity>) => {
    setOpportunities(prev =>
      prev.map(opp => (opp.id === id ? { ...opp, ...updatedData, status: 'pending' } : opp))
    );
  };

  const updateOpportunityStatus = (id:string, status: OpportunityStatus) => {
    setOpportunities(prev => 
      prev.map(opp => opp.id === id ? {...opp, status} : opp)
    );
  }

  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  return (
    <OpportunityContext.Provider value={{ opportunities, getOpportunityById, addOpportunity, updateOpportunityStatus, updateOpportunity, deleteOpportunity }}>
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
