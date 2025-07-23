
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@/components/ui/popover';

const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Grade ${i + 1}`,
}));

interface GradeSelectProps {
  selected: string[];
  setSelected: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function GradeSelect({ selected, setSelected, placeholder = 'Select grades...', className }: GradeSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (grade: string) => {
    setSelected(selected.filter((s) => s !== grade));
  };

  const handleSelect = (grade: string) => {
    if (!selected.includes(grade)) {
      setSelected([...selected, grade].sort((a,b) => parseInt(a, 10) - parseInt(b,10)));
    } else {
        handleUnselect(grade);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === gradeOptions.length) {
      setSelected([]);
    } else {
      setSelected(gradeOptions.map(g => g.value));
    }
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between h-auto', className)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              gradeOptions
                .filter((grade) => selected.includes(grade.value))
                .map((grade) => (
                  <Badge
                    variant="secondary"
                    key={grade.value}
                    className="mr-1 mb-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(grade.value);
                    }}
                  >
                    {grade.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search grades..." />
            <CommandEmpty>No grade found.</CommandEmpty>
            <CommandList>
                <CommandGroup>
                <CommandItem
                    onSelect={handleSelectAll}
                    className="cursor-pointer"
                >
                    <div
                        className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            selected.length === gradeOptions.length ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                        )}
                        >
                        <Check className={cn('h-4 w-4')} />
                    </div>
                    Select All
                </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                {gradeOptions.map((option) => (
                    <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                    >
                    <div
                        className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selected.includes(option.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
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
      </PopoverPortal>
    </Popover>
  );
}
