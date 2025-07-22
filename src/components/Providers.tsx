'use client';
import { AuthProvider } from '@/contexts/AuthContext';
import { OpportunityProvider } from '@/contexts/OpportunityContext';
import React from 'react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OpportunityProvider>{children}</OpportunityProvider>
    </AuthProvider>
  );
}
