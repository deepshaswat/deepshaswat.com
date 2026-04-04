"use client";

import * as React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@repo/ui/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: (date: Date) => void;
}) {
  // Disable dates before today
  const disabledDays = {
    before: startOfDay(new Date()),
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="z-50">
        <Button
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-neutral-700",
            !date && "text-muted-foreground",
          )}
          variant="date"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-neutral-800 text-neutral-200">
        <Calendar
          disabled={disabledDays}
          initialFocus
          mode="single"
          onSelect={(day) => {
            if (day && !isBefore(day, startOfDay(new Date()))) {
              setDate(day);
            }
          }}
          selected={date ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
