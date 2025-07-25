'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthFormContainer } from '@/components/AuthFormContainer';
import { ForceBlueTheme } from '@/components/ForceDarkTheme';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function AdminLoginPage() {
  const { adminLogin, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);


  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const success = await adminLogin(values.email, values.password);
    if (success) {
      toast({
        title: 'Admin Login Successful',
        description: 'Redirecting to admin dashboard.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials or you do not have admin access.',
      });
       form.setError('password', { message: 'Invalid credentials' });
    }
  };

  return (
    <>
    <ForceBlueTheme />
    <AuthFormContainer
      title="Admin Login"
      description="Enter admin credentials to access the dashboard."
      footerText="This is a restricted area."
      footerLink="/"
      footerLinkText="Go to Homepage"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input placeholder="admin@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Logging in...' : 'Login as Admin'}
          </Button>
        </form>
      </Form>
    </AuthFormContainer>
    </>
  );
}
