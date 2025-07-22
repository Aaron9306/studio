'use client';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  adminLogin: (email: string) => boolean;
  signup: (name: string, email: string) => boolean;
  logout: () => void;
  loading: boolean;
  toggleBookmark: (opportunityId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetUser = (user: User | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };

  const login = (email: string) => {
    const foundUser = mockUsers.find(u => u.email === email && u.role === 'student');
    if (foundUser) {
      handleSetUser(foundUser);
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const adminLogin = (email: string) => {
    const foundUser = mockUsers.find(u => u.email === email && u.role === 'admin');
    if (foundUser) {
      handleSetUser(foundUser);
      router.push('/admin/dashboard');
      return true;
    }
    return false;
  };
  
  const signup = (name: string, email: string) => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'student',
      bookmarkedOpportunities: [],
    };
    // In a real app, this would be saved to the backend.
    // Here we just add it to the mock data for the session.
    mockUsers.push(newUser);
    handleSetUser(newUser);
    router.push('/dashboard');
    return true;
  };

  const logout = () => {
    handleSetUser(null);
    router.push('/login');
  };

  const toggleBookmark = (opportunityId: string) => {
    if (!user) return;

    const isBookmarked = user.bookmarkedOpportunities.includes(opportunityId);
    const updatedBookmarks = isBookmarked
      ? user.bookmarkedOpportunities.filter(id => id !== opportunityId)
      : [...user.bookmarkedOpportunities, opportunityId];
    
    const updatedUser = { ...user, bookmarkedOpportunities: updatedBookmarks };
    handleSetUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, signup, logout, loading, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
