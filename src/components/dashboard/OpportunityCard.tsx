'use client';
import { Opportunity } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { user, toggleBookmark } = useAuth();
  const isBookmarked = user?.bookmarkedOpportunities.includes(opportunity.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(opportunity.id);
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={opportunity.imageUrl || 'https://placehold.co/600x400.png'}
            alt={opportunity.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="event cover"
          />
          <Badge variant="secondary" className="absolute top-3 right-3">{opportunity.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-2 line-clamp-2">{opportunity.title}</CardTitle>
        <p className="text-muted-foreground line-clamp-3 text-sm">{opportunity.summary || opportunity.description}</p>
      </CardContent>
      <CardFooter className="p-6 bg-secondary/50 flex justify-between items-center">
        <Link href={`/opportunity/${opportunity.id}`} passHref>
          <Button variant="default">
            See More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBookmarkClick} 
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          className="rounded-full"
        >
          <Bookmark className={cn("h-5 w-5", isBookmarked ? 'text-primary fill-primary' : 'text-muted-foreground')} />
        </Button>
      </CardFooter>
    </Card>
  );
}
