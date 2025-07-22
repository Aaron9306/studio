'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '../ui/scroll-area';

export interface Filters {
  search: string;
  types: string[];
  subject: string;
  price: string;
  audience: string;
  format: string;
  age: number;
  deadline: string;
}

interface FilterSidebarProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const opportunityTypes = ['MUN', 'Internship', 'Volunteering', 'Competition', 'Summer Camp', 'Hackathon'];
const subjects = ['Technology', 'Business', 'Arts & Culture', 'Science', 'Politics', 'Social Work'];

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const isMobile = useIsMobile();
  
  const handleTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      types: [],
      subject: 'all',
      price: 'all',
      audience: 'all',
      format: 'all',
      age: 30,
      deadline: 'all'
    });
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-headline font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset <X className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search by Title</Label>
            <Input 
              id="search" 
              placeholder="e.g., Hackathon" 
              value={filters.search}
              onChange={e => setFilters(prev => ({...prev, search: e.target.value}))}
            />
          </div>

          {/* Type */}
          <div>
            <Label>Type</Label>
            <div className="space-y-2 mt-2">
              {opportunityTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={type} 
                    checked={filters.types.includes(type)}
                    onCheckedChange={() => handleTypeChange(type)}
                  />
                  <Label htmlFor={type} className="font-normal">{type}</Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {/* Subject/Field */}
          <div>
            <Label htmlFor="subject">Subject/Field</Label>
            <Select value={filters.subject} onValueChange={value => setFilters(prev => ({...prev, subject: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          {/* Price */}
          <div>
            <Label>Price</Label>
             <RadioGroup value={filters.price} onValueChange={value => setFilters(prev => ({...prev, price: value}))} className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="price-all" />
                    <Label htmlFor="price-all" className="font-normal">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Free" id="price-free" />
                    <Label htmlFor="price-free" className="font-normal">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Paid" id="price-paid" />
                    <Label htmlFor="price-paid" className="font-normal">Paid</Label>
                </div>
            </RadioGroup>
          </div>
          <Separator />
          {/* Audience */}
          <div>
            <Label>Audience</Label>
            <RadioGroup value={filters.audience} onValueChange={value => setFilters(prev => ({...prev, audience: value}))} className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="audience-all" />
                    <Label htmlFor="audience-all" className="font-normal">All Nationalities</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Emiratis Only" id="audience-emirati" />
                    <Label htmlFor="audience-emirati" className="font-normal">Emiratis Only</Label>
                </div>
            </RadioGroup>
          </div>
          <Separator />
          {/* Format */}
          <div>
            <Label>Format</Label>
            <RadioGroup value={filters.format} onValueChange={value => setFilters(prev => ({...prev, format: value}))} className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="format-all" />
                    <Label htmlFor="format-all" className="font-normal">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Online" id="format-online" />
                    <Label htmlFor="format-online" className="font-normal">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Offline" id="format-offline" />
                    <Label htmlFor="format-offline" className="font-normal">Offline</Label>
                </div>
            </RadioGroup>
          </div>
          <Separator />
           {/* Deadline */}
          <div>
            <Label>Deadline</Label>
            <RadioGroup value={filters.deadline} onValueChange={value => setFilters(prev => ({...prev, deadline: value}))} className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="deadline-all" />
                    <Label htmlFor="deadline-all" className="font-normal">Anytime</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="week" id="deadline-week" />
                    <Label htmlFor="deadline-week" className="font-normal">Closing this week</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="month" id="deadline-month" />
                    <Label htmlFor="deadline-month" className="font-normal">Closing this month</Label>
                </div>
            </RadioGroup>
          </div>
          <Separator />
          {/* Age */}
          <div>
            <Label htmlFor="age">Age (up to {filters.age})</Label>
            <Slider 
              id="age"
              min={13} 
              max={30} 
              step={1} 
              value={[filters.age]}
              onValueChange={value => setFilters(prev => ({...prev, age: value[0]}))}
              className="mt-4"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="fixed bottom-4 right-4 z-40 shadow-lg rounded-full h-14 w-14">
            <Filter className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[300px]">
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="w-80 border-r bg-card h-full sticky top-16 hidden lg:block">
      {content}
    </aside>
  );
}
