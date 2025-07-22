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
    if (!selectedGrades.includes(gradeNumber)) {
      onGradesChange([...selectedGrades, gradeNumber].sort((a,b) => a-b));
    }
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

  return (
    <Select onValueChange={handleSelect} value="">
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
         <SelectItem value="all" onSelect={handleSelectAll}>
            <div className='flex items-center'>
                 <div className='w-4 mr-2'>
                    {selectedGrades.length === gradeOptions.length && <Check className="h-4 w-4" />}
                 </div>
                 All Grades
            </div>
        </SelectItem>
        {gradeOptions.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
             <div className='flex items-center'>
                 <div className='w-4 mr-2'>
                    {selectedGrades.includes(option.value) && <Check className="h-4 w-4" />}
                 </div>
                 {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
