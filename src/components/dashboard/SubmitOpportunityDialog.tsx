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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Timestamp } from 'firebase/firestore';
import { Slider } from '../ui/slider';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Badge } from '../ui/badge';

const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Grade ${i + 1}`,
}));

const opportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  type: z.enum(['MUN', 'Internship', 'Volunteering', 'Competition', 'Summer Camp', 'Hackathon', 'Workshop']),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  subject: z.string().min(2, 'Subject is required.'),
  ageRange: z.tuple([z.number().min(1), z.number().max(30)]).refine(data => data[0] <= data[1], { message: "Minimum age cannot be greater than maximum age."}),
  grades: z.array(z.number()),
  price: z.enum(['Free', 'Paid']),
  audience: z.enum(['All Nationalities', 'Emiratis Only']),
  format: z.enum(['Online', 'Offline']),
  deadline: z.date(),
  emirate: z.enum(["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain", "All Emirates"]),
  registrationLink: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});

const opportunityTypes: OpportunityType[] = ['MUN', 'Internship', 'Volunteering', 'Competition', 'Summer Camp', 'Hackathon', 'Workshop'];
const subjects = ['Technology', 'Business', 'Arts & Culture', 'Science', 'Politics', 'Social Work', 'Engineering', 'Health & Medicine', 'Environment'];
const emirates: (Emirate | "All Emirates")[] = ["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain", "All Emirates"];


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

  const form = useForm<z.infer<typeof opportunitySchema>>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: '',
      type: 'Internship',
      description: '',
      subject: '',
      ageRange: [16, 25],
      grades: [],
      price: 'Free',
      audience: 'All Nationalities',
      format: 'Offline',
      deadline: new Date(),
      emirate: 'All Emirates',
      registrationLink: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (opportunityToEdit) {
        form.reset({
          ...opportunityToEdit,
          deadline: opportunityToEdit.deadline.toDate(),
          grades: opportunityToEdit.grades || [],
        });
      } else {
          form.reset({
              title: '',
              type: 'Internship',
              description: '',
              subject: '',
              ageRange: [16, 25],
              grades: [],
              price: 'Free',
              audience: 'All Nationalities',
              format: 'Offline',
              deadline: new Date(),
              emirate: 'All Emirates',
              registrationLink: '',
              imageUrl: '',
          });
      }
    }
  }, [opportunityToEdit, form, open]);


  const onSubmit = async (values: z.infer<typeof opportunitySchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }

    const submissionData = {
        ...values,
        deadline: Timestamp.fromDate(values.deadline),
    };

    try {
      if (opportunityToEdit) {
        await updateOpportunity(opportunityToEdit.id, submissionData);
        toast({ title: 'Opportunity Updated', description: 'Your changes have been submitted for review.' });
      } else {
        await addOpportunity(submissionData);
        toast({ title: 'Opportunity Submitted', description: 'Thank you! Your submission is pending review.' });
      }
      
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch(e) {
        console.error(e)
        toast({ variant: 'destructive', title: 'Submission failed', description: 'Could not save the opportunity. Please try again.'})
    }
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
                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                    <SelectContent>{opportunityTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description of the opportunity..." {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subject/Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                    <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="emirate" render={({ field }) => (
                <FormItem><FormLabel>Emirate</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                  </PopoverContent>
                </Popover><FormMessage /></FormItem>
              )}
            />
             <FormField control={form.control} name="ageRange" render={({ field }) => (
                <FormItem>
                    <FormLabel>Age Range: {field.value[0]} - {field.value[1]}</FormLabel>
                    <FormControl>
                        <Slider
                            min={1}
                            max={30}
                            step={1}
                            value={field.value}
                            onValueChange={field.onChange}
                            className="mt-4"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="grades" render={({ field }) => (
              <FormItem>
                <FormLabel>Grades</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className={cn("w-full justify-between h-auto", !field.value?.length && "text-muted-foreground")}>
                        <div className="flex gap-1 flex-wrap">
                          {field.value?.length > 0 ? (
                             field.value.length === gradeOptions.length ? "All Grades" :
                             field.value.sort((a,b) => a - b).map((grade) => (
                              <Badge variant="secondary" key={grade}>
                                Grade {grade}
                              </Badge>
                            ))
                          ) : (
                            "Select grades"
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search grades..." />
                      <CommandEmpty>No grades found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                           <CommandItem
                            onSelect={() => {
                              field.onChange(field.value?.length === gradeOptions.length ? [] : gradeOptions.map(o => o.value))
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", field.value?.length === gradeOptions.length ? "opacity-100" : "opacity-0")} />
                            All Grades
                          </CommandItem>
                          {gradeOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              onSelect={() => {
                                const selectedGrades = field.value || [];
                                const newGrades = selectedGrades.includes(option.value)
                                  ? selectedGrades.filter((g) => g !== option.value)
                                  : [...selectedGrades, option.value];
                                field.onChange(newGrades.sort((a,b) => a-b));
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", field.value?.includes(option.value) ? "opacity-100" : "opacity-0")} />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Free" id="price-free" /></FormControl><Label htmlFor="price-free" className="font-normal">Free</Label></FormItem>
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Paid" id="price-paid" /></FormControl><Label htmlFor="price-paid" className="font-normal">Paid</Label></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="format" render={({ field }) => (
                    <FormItem><FormLabel>Format</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Online" id="format-online" /></FormControl><Label htmlFor="format-online" className="font-normal">Online</Label></FormItem>
                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Offline" id="format-offline" /></FormControl><Label htmlFor="format-offline" className="font-normal">Offline</Label></FormItem>
                    </RadioGroup></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="audience" render={({ field }) => (
                <FormItem><FormLabel>Audience</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-2">
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="All Nationalities" id="aud-all" /></FormControl><Label htmlFor="aud-all" className="font-normal">All Nationalities</Label></FormItem>
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Emiratis Only" id="aud-emirati" /></FormControl><Label htmlFor="aud-emirati" className="font-normal">Emiratis Only</Label></FormItem>
                </RadioGroup></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="registrationLink" render={({ field }) => (
                <FormItem><FormLabel>Registration Link (Optional)</FormLabel><FormControl><Input placeholder="https://example.com/register" {...field} /></FormControl><FormMessage /></FormItem>
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
