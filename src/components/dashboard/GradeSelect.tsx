'use client';

import * as React from 'react';
import { X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const handleSelect = (value: string) => {
    const gradeNumber = parseInt(value, 10);
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
  }

  // Prevents the dropdown from closing when an item is clicked
  const handleItemSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };


  return (
    <Select onValueChange={() => {}} value="">
      <SelectTrigger
        className={cn(
          'h-auto min-h-10 w-full justify-between',
          className
        )}
      >
        <SelectValue asChild>
          <div className="flex flex-wrap gap-1">
            {selectedGrades.length === 0 ? (
              <span className="text-muted-foreground">Select grades...</span>
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
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
         <div 
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={handleSelectAll}
            onMouseDown={handleItemSelect}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                 {selectedGrades.length === gradeOptions.length && <Check className="h-4 w-4" />}
            </span>
             All Grades
        </div>
        {gradeOptions.map((option) => (
          <div 
            key={option.value}
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => handleSelect(String(option.value))}
            onMouseDown={handleItemSelect}
          >
             <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {selectedGrades.includes(option.value) && <Check className="h-4 w-4" />}
             </span>
             {option.label}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
