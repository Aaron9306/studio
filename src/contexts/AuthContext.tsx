'use client';
import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  toggleBookmark: (opportunityId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() } as User);
        } else {
          // This case might happen if a user is created in Auth but not in Firestore
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().role !== 'admin') {
        router.push('/dashboard');
        return true;
      }
      // If role is admin or user doc doesn't exist, sign out
      await signOut(auth);
      toast({ variant: 'destructive', title: 'Login Failed', description: 'No student account found for this email.' });
      return false;
    } catch (error) {
      // This will catch wrong password, user not found etc.
      return false;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        router.push('/admin/dashboard');
        return true;
      }
      // If role is not admin or user doc does not exist, sign them out.
       await signOut(auth);
       toast({ variant: 'destructive', title: 'Access Denied', description: 'You do not have administrator privileges.' });
      return false;
    } catch (error) {
      // This will catch invalid credentials (wrong email/password)
      return false;
    }
  };
  
  const signup = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        name,
        email,
        role: 'student',
        bookmarkedOpportunities: [],
      };
      await setDoc(doc(db, 'users', newUser.id), newUser);
      router.push('/dashboard');
      return true;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
         toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: 'An account with this email already exists.',
        });
        // Return false here to indicate the specific error to the form
        return false;
      }
      // For any other error, show a generic message
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
      // Throw the error so it can be caught by the calling function if needed, but not for form state
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const toggleBookmark = async (opportunityId: string) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.id);
    const isBookmarked = user.bookmarkedOpportunities.includes(opportunityId);

    try {
      await updateDoc(userDocRef, {
        bookmarkedOpportunities: isBookmarked 
          ? arrayRemove(opportunityId) 
          : arrayUnion(opportunityId)
      });

      // Optimistically update local state
      const updatedBookmarks = isBookmarked
        ? user.bookmarkedOpportunities.filter(id => id !== opportunityId)
        : [...user.bookmarkedOpportunities, opportunityId];
      setUser({ ...user, bookmarkedOpportunities: updatedBookmarks });

    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({variant: 'destructive', title: 'Error', description: 'Could not update bookmark.'});
    }
  };

  const value = { user, firebaseUser, login, adminLogin, signup, logout, loading, toggleBookmark };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
