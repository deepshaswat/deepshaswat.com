"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@repo/ui";
import {
  Calendar,
  FileText,
  Lightbulb,
  Mail,
  ExternalLink,
  Clock,
} from "lucide-react";
import type { CalendarEvent, CalendarEventType } from "@repo/actions";
import { cn } from "@repo/ui/utils";

interface EventListSidebarProps {
  selectedDate: Date | null;
  events: CalendarEvent[];
  onRefresh: () => void;
}

const typeConfig: Record<
  CalendarEventType,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
  }
> = {
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  published: {
    icon: FileText,
    label: "Published",
    color: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  newsletter: {
    icon: Mail,
    label: "Newsletter",
    color: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  idea: {
    icon: Lightbulb,
    label: "Idea",
    color: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
};

function EmptyState(): JSX.Element {
  return (
    <p className="text-sm text-muted-foreground">
      Click on a date in the calendar to view events for that day.
    </p>
  );
}

function NoEventsState(): JSX.Element {
  return (
    <div className="text-center py-8">
      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">
        No events scheduled for this date.
      </p>
    </div>
  );
}

export function EventListSidebar({
  selectedDate,
  events,
  onRefresh: _onRefresh,
}: EventListSidebarProps): JSX.Element {
  const router = useRouter();

  const handleEventClick = (event: CalendarEvent): void => {
    if (event.type === "idea") {
      router.push(`/ideas/${event.id}`);
    } else if (event.postUrl) {
      router.push(`/editor/${event.id}`);
    }
  };

  const handleEventKeyDown = (
    e: React.KeyboardEvent,
    event: CalendarEvent,
  ): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEventClick(event);
    }
  };

  const renderContent = (): JSX.Element => {
    if (!selectedDate) {
      return <EmptyState />;
    }

    if (events.length === 0) {
      return <NoEventsState />;
    }

    return (
      <div className="space-y-3">
        {events.map((event) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              key={event.id}
              onClick={() => {
                handleEventClick(event);
              }}
              onKeyDown={(e) => {
                handleEventKeyDown(e, event);
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={cn("gap-1", config.color)}
                      variant="secondary"
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                  <h4
                    className="font-medium text-sm truncate"
                    title={event.title}
                  >
                    {event.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(event.date), "h:mm a")}
                  </p>
                </div>
                <Button className="flex-shrink-0" size="icon" variant="ghost">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {selectedDate
            ? format(selectedDate, "MMMM d, yyyy")
            : "Select a date"}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
