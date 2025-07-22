'use client';

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useOpportunities } from "@/contexts/OpportunityContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, Globe, Tag, Users, Wallet, Clock, User, ExternalLink, Edit } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { SubmitOpportunityDialog } from "@/components/dashboard/SubmitOpportunityDialog";
import { Card, CardContent } from "@/components/ui/card";

export default function OpportunityDetailPage() {
  const params = useParams();
  const { getOpportunityById } = useOpportunities();
  const { user, toggleBookmark, loading } = useAuth();

  const opportunity = getOpportunityById(params.id as string);

  if (!opportunity) {
    return (
      <ProtectedRoute allowedRoles={['student', 'admin']}>
         <Header />
        <div className="flex-grow flex items-center justify-center">
          <p>Opportunity not found.</p>
        </div>
      </ProtectedRoute>
    );
  }
  
  if (opportunity.status !== 'approved' && user?.role !== 'admin') {
     return (
       <ProtectedRoute allowedRoles={['student', 'admin']}>
         <Header />
         <div className="flex-grow flex items-center justify-center text-center p-4">
           <div>
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground mt-2">This opportunity is not available for public viewing yet.</p>
           </div>
         </div>
       </ProtectedRoute>
     );
  }

  const isBookmarked = user?.bookmarkedOpportunities.includes(opportunity.id);
  const details = [
    { icon: Tag, label: 'Type', value: opportunity.type },
    { icon: Globe, label: 'Audience', value: opportunity.audience },
    { icon: Users, label: 'Age Range', value: `${opportunity.ageRange[0]} - ${opportunity.ageRange[1]}` },
    { icon: Wallet, label: 'Price', value: opportunity.price },
    { icon: User, label: 'Format', value: opportunity.format },
    { icon: Clock, label: 'Deadline', value: format(opportunity.deadline, 'PPP') },
  ];

  return (
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
           <Image
            src={opportunity.imageUrl || 'https://placehold.co/1200x400.png'}
            alt={opportunity.title}
            fill
            className="object-cover"
            data-ai-hint="event cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-white">{opportunity.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-headline font-semibold mb-4">About this Opportunity</h2>
            <p className="text-muted-foreground leading-relaxed">{opportunity.description}</p>
          </div>
          <div className="space-y-6">
             <Card>
                <CardContent className="p-6 space-y-4">
                     {details.map(detail => (
                        <div key={detail.label} className="flex items-center text-sm">
                            <detail.icon className="h-5 w-5 text-primary mr-3" />
                            <span className="font-semibold mr-2">{detail.label}:</span>
                            <span className="text-muted-foreground">{detail.value}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex flex-col space-y-2">
                {opportunity.registrationLink && (
                    <Button asChild size="lg">
                        <Link href={opportunity.registrationLink} target="_blank">
                           Register Now <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
                 <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => toggleBookmark(opportunity.id)}
                    disabled={loading}
                  >
                    <Bookmark className={cn("mr-2 h-5 w-5", isBookmarked && 'text-primary fill-primary')} />
                    {isBookmarked ? 'Saved' : 'Save for Later'}
                </Button>
                {user?.role === 'admin' && (
                  <SubmitOpportunityDialog
                    opportunityToEdit={opportunity}
                    trigger={
                      <Button variant="secondary" size="lg">
                        <Edit className="mr-2 h-4 w-4" /> Edit Opportunity
                      </Button>
                    }
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
