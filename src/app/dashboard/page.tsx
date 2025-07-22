'use client';
import { useState, useMemo } from 'react';
import { useOpportunities } from '@/contexts/OpportunityContext';
import { FilterSidebar, Filters } from '@/components/dashboard/FilterSidebar';
import { OpportunityCard } from '@/components/dashboard/OpportunityCard';
import { Button } from '@/components/ui/button';
import { FilePlus, Bookmark } from 'lucide-react';
import { SubmitOpportunityDialog } from '@/components/dashboard/SubmitOpportunityDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Opportunity } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { opportunities } = useOpportunities();
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    types: [],
    subject: 'all',
    price: 'all',
    audience: 'all',
    format: 'all',
    age: 30,
    deadline: 'all',
  });

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => opp.status === 'approved')
      .filter(opp => {
        const searchMatch = opp.title.toLowerCase().includes(filters.search.toLowerCase());
        const typeMatch = filters.types.length === 0 || filters.types.includes(opp.type);
        const subjectMatch = filters.subject === 'all' || opp.subject === filters.subject;
        const priceMatch = filters.price === 'all' || opp.price === filters.price;
        const audienceMatch = filters.audience === 'all' || opp.audience === filters.audience;
        const formatMatch = filters.format === 'all' || opp.format === filters.format;
        const ageMatch = filters.age >= opp.ageRange[0] && filters.age <= opp.ageRange[1];
        
        return searchMatch && typeMatch && subjectMatch && priceMatch && audienceMatch && formatMatch && ageMatch;
      });
  }, [opportunities, filters]);

  const bookmarkedOpportunities = useMemo(() => {
    if (!user) return [];
    return opportunities.filter(opp => user.bookmarkedOpportunities.includes(opp.id));
  }, [opportunities, user]);

  return (
    <div className="flex flex-1">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <main className="flex-1 p-4 md:p-8">
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
             <TabsList>
              <TabsTrigger value="all">All Opportunities</TabsTrigger>
              <TabsTrigger value="bookmarked">
                <Bookmark className="mr-2 h-4 w-4" />
                Saved
              </TabsTrigger>
            </TabsList>
            <SubmitOpportunityDialog 
              trigger={<Button><FilePlus className="mr-2 h-4 w-4" /> Submit New Opportunity</Button>}
            />
          </div>
          <TabsContent value="all">
             <OpportunityGrid opportunities={filteredOpportunities} />
          </TabsContent>
          <TabsContent value="bookmarked">
             <OpportunityGrid opportunities={bookmarkedOpportunities} emptyMessage="You haven't saved any opportunities yet. Click the bookmark icon to save one." />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function OpportunityGrid({ opportunities, emptyMessage }: { opportunities: Opportunity[], emptyMessage?: string }) {
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold">
          {emptyMessage || 'No opportunities match your current filters.'}
        </h3>
        <p className="text-muted-foreground mt-2">
          {emptyMessage ? 'Start exploring and save your favorites!' : 'Try adjusting your search or filter criteria.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {opportunities.map(opp => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
    </div>
  );
}
