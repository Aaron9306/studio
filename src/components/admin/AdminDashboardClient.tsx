'use client';

import { useOpportunities } from "@/contexts/OpportunityContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunitiesTable } from "./OpportunitiesTable";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FilePlus } from "lucide-react";
import { SubmitOpportunityDialog } from "../dashboard/SubmitOpportunityDialog";
import { Skeleton } from "../ui/skeleton";

export default function AdminDashboardClient() {
  const { opportunities, loading } = useOpportunities();

  const pendingOpportunities = opportunities.filter(o => o.status === 'pending');
  const approvedOpportunities = opportunities.filter(o => o.status === 'approved');

  if (loading) {
      return (
          <div>
              <div className="flex justify-end mb-4">
                  <Skeleton className="h-10 w-48" />
              </div>
              <Skeleton className="h-10 w-full mb-2" />
              <Card>
                  <CardContent className="p-10 text-center text-muted-foreground">
                      <Skeleton className="h-40 w-full" />
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div>
       <div className="flex justify-end mb-4">
         <SubmitOpportunityDialog 
            trigger={
                <Button>
                    <FilePlus className="mr-2 h-4 w-4" /> Add New Opportunity
                </Button>
            }
         />
        </div>
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending Review 
            <Badge variant="secondary" className="ml-2">{pendingOpportunities.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Live Opportunities
             <Badge variant="secondary" className="ml-2">{approvedOpportunities.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <OpportunitiesTable 
            opportunities={pendingOpportunities} 
            type="pending"
          />
        </TabsContent>
        <TabsContent value="approved">
           <OpportunitiesTable 
            opportunities={approvedOpportunities} 
            type="approved"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
