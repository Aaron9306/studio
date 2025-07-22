'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ('student' | 'admin')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Please log in to view this page.',
      });
      router.push('/login');
      return;
    }

    if (!allowedRoles.includes(user.role)) {
       toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: "You don't have permission to access this page.",
      });
      router.push('/dashboard');
    }
  }, [user, loading, router, allowedRoles, toast]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="space-y-4 w-full max-w-4xl p-8">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
