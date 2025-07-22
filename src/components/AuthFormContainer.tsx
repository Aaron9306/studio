import React from 'react';
import Link from 'next/link';
import { Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormContainerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export function AuthFormContainer({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
}: AuthFormContainerProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary">
       <div className="absolute top-8 left-8">
         <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <Building className="h-6 w-6" />
            <span className="font-bold font-headline">Youth Opportunities Hub</span>
          </Link>
       </div>
      <Card className="mx-auto w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          <div className="mt-4 text-center text-sm">
            {footerText}{' '}
            <Link href={footerLink} className="underline text-primary font-medium">
              {footerLinkText}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
