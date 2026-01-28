"use client";

import { Button } from "@repo/ui";
import { cn } from "@repo/ui/utils";
import { Clock, FileText, Mail, Lightbulb } from "lucide-react";

interface CalendarFiltersProps {
  filters: {
    scheduled: boolean;
    published: boolean;
    newsletters: boolean;
    ideas: boolean;
  };
  onFilterChange: (
    key: "scheduled" | "published" | "newsletters" | "ideas",
  ) => void;
}

export function CalendarFilters({
  filters,
  onFilterChange,
}: CalendarFiltersProps): JSX.Element {
  const filterButtons = [
    {
      key: "scheduled" as const,
      label: "Scheduled",
      icon: Clock,
      activeColor:
        "bg-yellow-500/20 border-yellow-500 text-yellow-700 dark:text-yellow-300",
    },
    {
      key: "published" as const,
      label: "Published",
      icon: FileText,
      activeColor:
        "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300",
    },
    {
      key: "newsletters" as const,
      label: "Newsletters",
      icon: Mail,
      activeColor:
        "bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300",
    },
    {
      key: "ideas" as const,
      label: "Ideas",
      icon: Lightbulb,
      activeColor:
        "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filterButtons.map(({ key, label, icon: Icon, activeColor }) => (
        <Button
          className={cn(
            "gap-2 border",
            filters[key] ? activeColor : "opacity-50",
          )}
          key={key}
          onClick={() => {
            onFilterChange(key);
          }}
          size="sm"
          variant="outline"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
