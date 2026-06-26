'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "../ui/card";
import { Opportunity } from "@/lib/types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { format as formatDate } from "date-fns";
import { Check, Edit, Trash, X } from "lucide-react";
import { SubmitOpportunityDialog } from "../dashboard/SubmitOpportunityDialog";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTransition } from "react";
import { deleteOpportunity, updateOpportunityStatus } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  type: 'pending' | 'approved';
}

export function OpportunitiesTable({ opportunities, type }: OpportunitiesTableProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          No {type === 'pending' ? 'pending' : 'live'} opportunities at the moment.
        </CardContent>
      </Card>
    );
  }

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    startTransition(async () => {
        try {
            if (status === 'rejected') {
                await deleteOpportunity(id);
                toast({ title: "Opportunity Rejected", description: "The submission has been deleted." });
            } else {
                await updateOpportunityStatus(id, status);
                toast({ title: "Opportunity Approved", description: "The opportunity is now live." });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "Could not update the opportunity status." });
        }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
        try {
            await deleteOpportunity(id);
            toast({ title: "Opportunity Deleted", description: "The opportunity has been permanently removed." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "Could not delete the opportunity." });
        }
    });
  }

  return (
    <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">
                    <Link href={`/opportunity/${opp.id}`} className="hover:underline" target="_blank">
                        {opp.title}
                    </Link>
                  </TableCell>
                  <TableCell><Badge variant="outline">{opp.type}</Badge></TableCell>
                  {/* Updated date formatting: parse ISO string directly */}
                  <TableCell>{formatDate(new Date(opp.deadline), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {type === 'pending' && (
                        <>
                        <Button variant="outline" size="icon" className="text-green-600" onClick={() => handleStatusChange(opp.id, 'approved')} disabled={isPending}>
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-600" onClick={() => handleStatusChange(opp.id, 'rejected')} disabled={isPending}>
                            <X className="h-4 w-4" />
                        </Button>
                        </>
                    )}
                     <SubmitOpportunityDialog
                        opportunityToEdit={opp}
                        trigger={
                            <Button variant="outline" size="icon" disabled={isPending}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        }
                     />
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="icon" disabled={isPending}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the opportunity.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(opp.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
    </Card>
  );
}
