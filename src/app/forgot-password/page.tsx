'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { AuthFormContainer } from '@/components/AuthFormContainer';
import { ForceDarkTheme } from '@/components/ForceDarkTheme';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    const success = await sendPasswordReset(values.email);
    if (success) {
      setIsSubmitted(true);
    }
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <>
      <ForceDarkTheme />
       <AuthFormContainer
        title="Check Your Email"
        description={`We've sent a password reset link to ${form.getValues('email')}.`}
        footerText="Didn't get an email?"
        footerLink="/forgot-password"
        footerLinkText="Try again"
       >
        <p className='text-center text-sm text-muted-foreground'>Please check your spam folder if you don't see it in your inbox.</p>
      </AuthFormContainer>
      </>
    )
  }

  return (
    <>
    <ForceDarkTheme />
    <AuthFormContainer
      title="Forgot Your Password?"
      description="No problem. Enter your email and we'll send you a reset link."
      footerText="Remembered your password?"
      footerLink="/login"
      footerLinkText="Login"
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>
    </AuthFormContainer>
    </>
  );
}
