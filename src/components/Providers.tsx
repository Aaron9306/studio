'use client';
import { AuthProvider } from '@/contexts/AuthContext';
import { OpportunityProvider } from '@/contexts/OpportunityContext';
import React from 'react';
import { ThemeProvider } from 'next-themes';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <OpportunityProvider>{children}</OpportunityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
