'use client';

import * as React from 'react';
import { X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Grade ${i + 1}`,
}));

interface GradeSelectProps {
  selectedGrades: number[];
  onGradesChange: (grades: number[]) => void;
  className?: string;
}

export function GradeSelect({ selectedGrades, onGradesChange, className }: GradeSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (gradeNumber: number) => {
    const newSelectedGrades = selectedGrades.includes(gradeNumber)
      ? selectedGrades.filter((g) => g !== gradeNumber)
      : [...selectedGrades, gradeNumber];
    onGradesChange(newSelectedGrades.sort((a, b) => a - b));
  };

  const handleRemove = (grade: number) => {
    onGradesChange(selectedGrades.filter((g) => g !== grade));
  };
  
  const handleSelectAll = () => {
    if (selectedGrades.length === gradeOptions.length) {
      onGradesChange([]);
    } else {
      onGradesChange(gradeOptions.map(g => g.value));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between h-auto min-h-10', className)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedGrades.length === 0 ? (
              <span className="text-muted-foreground font-normal">Select grades...</span>
            ) : (
              selectedGrades.map((grade) => (
                <Badge
                  key={grade}
                  variant="secondary"
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(grade);
                  }}
                >
                  Grade {grade}
                  <X className="h-3 w-3" />
                </Badge>
              ))
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search grades..." />
          <CommandList>
            <CommandEmpty>No grades found.</CommandEmpty>
            <CommandGroup>
               <CommandItem
                onSelect={handleSelectAll}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    selectedGrades.length === gradeOptions.length
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible'
                  )}
                >
                  <Check className={cn('h-4 w-4')} />
                </div>
                All Grades
              </CommandItem>
              {gradeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      selectedGrades.includes(option.value)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <Check className={cn('h-4 w-4')} />
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
