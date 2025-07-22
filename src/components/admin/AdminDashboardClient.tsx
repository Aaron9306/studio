'use client';

import { useOpportunities } from "@/contexts/OpportunityContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunitiesTable } from "./OpportunitiesTable";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FilePlus } from "lucide-react";
import { SubmitOpportunityDialog } from "../dashboard/SubmitOpportunityDialog";

export default function AdminDashboardClient() {
  const { opportunities, updateOpportunityStatus, deleteOpportunity } = useOpportunities();

  const pendingOpportunities = opportunities.filter(o => o.status === 'pending');
  const approvedOpportunities = opportunities.filter(o => o.status === 'approved');

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    if (status === 'rejected') {
      deleteOpportunity(id);
    } else {
      updateOpportunityStatus(id, status);
    }
  };

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
            onStatusChange={handleStatusChange}
            type="pending"
          />
        </TabsContent>
        <TabsContent value="approved">
           <OpportunitiesTable 
            opportunities={approvedOpportunities} 
            onStatusChange={handleStatusChange}
            type="approved"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
