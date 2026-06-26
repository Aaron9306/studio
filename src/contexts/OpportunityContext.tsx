'use client';
import type { Opportunity } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Import your browser client

interface OpportunityContextType {
  opportunities: Opportunity[];
  getOpportunityById: (id: string) => Opportunity | undefined;
  loading: boolean;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export const OpportunityProvider = ({ children }: { children: ReactNode }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 1. Initial Fetch
    const fetchOpportunities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error("Error fetching opportunities:", error);
      else setOpportunities(data as Opportunity[]);
      setLoading(false);
    };

    fetchOpportunities();

    // 2. Real-time Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'opportunities' },
        (payload) => {
          // Re-fetch on any database change
          fetchOpportunities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const getOpportunityById = (id: string) => {
    return opportunities.find(opp => opp.id === id);
  };

  return (
    <OpportunityContext.Provider value={{ opportunities, getOpportunityById, loading }}>
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
