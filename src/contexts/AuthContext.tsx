'use client';
import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  toggleBookmark: (opportunityId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Fetch profile logic here
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    
    // Check if user is not admin
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    if (profile?.role === 'student') {
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;

    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    if (profile?.role === 'admin') {
      router.push('/admin/dashboard');
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { name } } // Saves metadata in auth table
    });
    
    if (error) {
        toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
        return false;
    }

    // You would typically use a Database Trigger to create the row in 'users' table automatically
    router.push('/dashboard');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleBookmark = async (opportunityId: string) => {
    if (!user) return;
    
    // Logic: In Supabase, you usually update the user's bookmarks 
    // by either modifying a 'bookmarks' table or an array column in 'users'
    const currentBookmarks = user.bookmarkedOpportunities || [];
    const isBookmarked = currentBookmarks.includes(opportunityId);
    const newBookmarks = isBookmarked 
      ? currentBookmarks.filter(id => id !== opportunityId)
      : [...currentBookmarks, opportunityId];

    const { error } = await supabase
      .from('users')
      .update({ bookmarkedOpportunities: newBookmarks })
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, bookmarkedOpportunities: newBookmarks });
    }
  };

  const value = { user, login, adminLogin, signup, sendPasswordReset: async () => true, logout, loading, toggleBookmark };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext)!;
