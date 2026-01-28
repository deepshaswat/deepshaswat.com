"use client";

import { format, isSameMonth, isToday } from "date-fns";
import { cn } from "@repo/ui/utils";
import type { CalendarEvent } from "@repo/actions";

interface CalendarCellProps {
  day: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  isSelected: boolean;
  onClick: (date: Date) => void;
  viewMode: "month" | "week";
}

const typeColors: Record<string, string> = {
  scheduled:
    "bg-yellow-500/20 border-l-yellow-500 text-yellow-700 dark:text-yellow-300",
  published:
    "bg-green-500/20 border-l-green-500 text-green-700 dark:text-green-300",
  newsletter:
    "bg-purple-500/20 border-l-purple-500 text-purple-700 dark:text-purple-300",
  idea: "bg-blue-500/20 border-l-blue-500 text-blue-700 dark:text-blue-300",
};

export function CalendarCell({
  day,
  currentMonth,
  events,
  isSelected,
  onClick,
  viewMode,
}: CalendarCellProps): JSX.Element {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isCurrentDay = isToday(day);
  const maxVisibleEvents = viewMode === "week" ? 5 : 3;

  const handleClick = (): void => {
    onClick(day);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(day);
    }
  };

  return (
    <div
      className={cn(
        "bg-background p-1 cursor-pointer transition-colors hover:bg-muted/50",
        viewMode === "month" ? "min-h-[100px]" : "min-h-[200px]",
        !isCurrentMonth && "opacity-50",
        isSelected && "ring-2 ring-primary ring-inset",
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "inline-flex items-center justify-center text-sm w-7 h-7 rounded-full",
            isCurrentDay && "bg-primary text-primary-foreground font-semibold",
            !isCurrentDay && !isCurrentMonth && "text-muted-foreground",
          )}
        >
          {format(day, "d")}
        </span>
        {events.length > 0 && (
          <span className="text-xs text-muted-foreground">{events.length}</span>
        )}
      </div>
      <div className="space-y-1 mt-1">
        {events.slice(0, maxVisibleEvents).map((event) => (
          <div
            className={cn(
              "text-xs p-1 rounded border-l-2 truncate",
              typeColors[event.type],
            )}
            key={event.id}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {events.length > maxVisibleEvents && (
          <span className="text-xs text-muted-foreground pl-1">
            +{events.length - maxVisibleEvents} more
          </span>
        )}
      </div>
    </div>
  );
}
