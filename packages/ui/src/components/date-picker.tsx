"use client";

import * as React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { useRecoilState } from "recoil";

import { cn } from "@repo/ui/utils";
import { selectDate } from "@repo/store";

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  // const [date, setDate] = useRecoilState(selectDate);

  // Disable dates before today
  const disabledDays = {
    before: startOfDay(new Date()),
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="z-50">
        <Button
          variant={"date"}
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-neutral-700",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-neutral-800 text-neutral-200">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => {
            if (day && !isBefore(day, startOfDay(new Date()))) {
              setDate(day);
            }
          }}
          disabled={disabledDays}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
