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
import { useEffect, useState } from 'react';
import { AuthFormContainer } from '@/components/AuthFormContainer';
import { ForceBlueTheme } from '@/components/ForceDarkTheme';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export default function SignupPage() {
  const { signup, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const success = await signup(values.name, values.email, values.password);
      if (success) {
        toast({
          title: 'Account Created',
          description: "We've created your account for you.",
        });
      }
    } catch (error: any) {
      // The signup function in AuthContext now throws an error for non-duplicate email issues.
      // We only want to set the form error if the email is already taken.
      if (error.code === 'auth/email-already-in-use') {
         toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: 'An account with this email already exists.',
        });
        form.setError('email', { message: 'This email is already taken.' });
      }
      // Other errors are already handled by a toast in the AuthContext, so we don't need to do anything here.
    }
    setIsSubmitting(false);
  };

  return (
    <>
    <ForceBlueTheme />
    <AuthFormContainer
      title="Create an Account"
      description="Join our community to find your next opportunity."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
    </AuthFormContainer>
    </>
  );
}
