
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useOpportunities } from '@/contexts/OpportunityContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Opportunity, OpportunityType, Emirate } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '../ui/popover';
import { CalendarIcon, X as XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

const opportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  type: z.enum(['MUN', 'Internship', 'Volunteering', 'Competition', 'Bootcamp', 'Hackathon', 'Workshop']),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  subject: z.string().min(2, 'Subject is required.'),
  grades: z.array(z.string()).min(1, 'At least one grade must be selected.'),
  price: z.enum(['Free', 'Paid']),
  audience: z.enum(['All Nationalities', 'Emiratis Only']),
  format: z.enum(['Online', 'Offline']),
  deadline: z.date({ required_error: 'A deadline date is required.'}),
  emirate: z.enum(["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain", "All Emirates"]),
  registrationLink: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  detailsLink: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});

const opportunityTypes: OpportunityType[] = ['MUN', 'Internship', 'Volunteering', 'Competition', 'Bootcamp', 'Hackathon', 'Workshop'];
const subjects = ['Technology', 'Business', 'Arts & Culture', 'Science', 'Politics', 'Social Work', 'Engineering', 'Health & Medicine', 'Environment'];
const emirates: (Emirate | "All Emirates")[] = ["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain", "All Emirates"];
const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Grade ${i + 1}`,
}));

const defaultFormValues = {
  title: '',
  type: 'Internship' as OpportunityType,
  description: '',
  subject: '',
  grades: [],
  price: 'Free' as 'Free' | 'Paid',
  audience: 'All Nationalities' as 'All Nationalities' | 'Emiratis Only',
  format: 'Offline' as 'Online' | 'Offline',
  deadline: new Date(),
  emirate: 'All Emirates' as Emirate | 'All Emirates',
  registrationLink: '',
  detailsLink: '',
  imageUrl: '',
};

interface SubmitOpportunityDialogProps {
  opportunityToEdit?: Opportunity;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function SubmitOpportunityDialog({ opportunityToEdit, trigger, onSuccess }: SubmitOpportunityDialogProps) {
  const { addOpportunity, updateOpportunity } = useOpportunities();
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<string>('');

  const form = useForm<z.infer<typeof opportunitySchema>>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) {
      if (opportunityToEdit) {
        form.reset({
          ...opportunityToEdit,
          deadline: opportunityToEdit.deadline.toDate(),
          grades: opportunityToEdit.grades ? opportunityToEdit.grades.map(String) : [],
          registrationLink: opportunityToEdit.registrationLink || '',
          detailsLink: opportunityToEdit.detailsLink || '',
          imageUrl: opportunityToEdit.imageUrl || '',
        });
      } else {
          form.reset(defaultFormValues);
      }
    }
  }, [opportunityToEdit, form, open]);


  const onSubmit = async (values: z.infer<typeof opportunitySchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }

    try {
      if (opportunityToEdit) {
        await updateOpportunity(opportunityToEdit.id, values);
        toast({ title: 'Opportunity Updated', description: user.role === 'admin' ? 'The opportunity has been successfully updated.' : 'Your changes have been submitted for review.' });
      } else {
        await addOpportunity(values);
        toast({ title: 'Opportunity Submitted', description: user.role === 'admin' ? 'The opportunity has been added.' : 'Thank you! Your submission is pending review.' });
      }
      
      form.reset(defaultFormValues);
      setOpen(false);
      onSuccess?.();
    } catch(e) {
        console.error("Submission Failed:", e)
        toast({ variant: 'destructive', title: 'Submission failed', description: 'Could not save the opportunity. Please try again.'})
    }
  };

   const handleAddGrade = () => {
    if (currentGrade && !form.getValues('grades').includes(currentGrade)) {
      const currentGrades = form.getValues('grades');
      form.setValue('grades', [...currentGrades, currentGrade].sort((a,b) => parseInt(a,10) - parseInt(b,10)), { shouldValidate: true });
      setCurrentGrade('');
    }
  };

  const handleRemoveGrade = (gradeToRemove: string) => {
    const currentGrades = form.getValues('grades');
    form.setValue('grades', currentGrades.filter((g) => g !== gradeToRemove), { shouldValidate: true });
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{opportunityToEdit ? 'Edit Opportunity' : 'Submit New Opportunity'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., AI Hackathon 2024" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                    <SelectContent>{opportunityTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description of the opportunity..." {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subject/Category</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                    <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="emirate" render={({ field }) => (
                <FormItem><FormLabel>Emirate</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an Emirate" /></SelectTrigger></FormControl>
                    <SelectContent>{emirates.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="deadline" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? formatDate(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverPortal>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </PopoverPortal>
                </Popover><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grades"
              render={() => (
                <FormItem>
                  <FormLabel>Grades</FormLabel>
                   <div className="flex gap-2">
                     <Select value={currentGrade} onValueChange={setCurrentGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade to add" />
                        </SelectTrigger>
                        <SelectContent>
                           {gradeOptions
                            .filter(option => !form.getValues('grades').includes(option.value))
                            .map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={handleAddGrade} disabled={!currentGrade}>Add Grade</Button>
                   </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {form.getValues('grades').map(grade => (
                           <Badge key={grade} variant="secondary" className="flex items-center gap-1">
                                {gradeOptions.find(o => o.value === grade)?.label}
                                <button type="button" onClick={() => handleRemoveGrade(grade)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                    <XIcon className="h-3 w-3" />
                                </button>
                           </Badge>
                        ))}
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Free" id="price-free" /></FormControl><Label htmlFor="price-free" className="font-normal">Free</Label></FormItem>
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Paid" id="price-paid" /></FormControl><Label htmlFor="price-paid" className="font-normal">Paid</Label></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="format" render={({ field }) => (
                    <FormItem><FormLabel>Format</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Online" id="format-online" /></FormControl><Label htmlFor="format-online" className="font-normal">Online</Label></FormItem>
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Offline" id="format-offline" /></FormControl><Label htmlFor="format-offline" className="font-normal">Offline</Label></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="audience" render={({ field }) => (
                <FormItem><FormLabel>Audience</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4 pt-2">
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="All Nationalities" id="aud-all" /></FormControl><Label htmlFor="aud-all" className="font-normal">All Nationalities</Label></FormItem>
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Emiratis Only" id="aud-emirati" /></FormControl><Label htmlFor="aud-emirati" className="font-normal">Emiratis Only</Label></FormItem>
                </RadioGroup></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="registrationLink" render={({ field }) => (
                <FormItem><FormLabel>Registration Link (Optional)</FormLabel><FormControl><Input placeholder="https://example.com/register" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="detailsLink" render={({ field }) => (
                <FormItem><FormLabel>Details Link (Optional)</FormLabel><FormControl><Input placeholder="https://example.com/details" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <DialogFooter className="pt-4 pr-4">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Submitting...' : (opportunityToEdit ? 'Save Changes' : 'Submit for Review')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
