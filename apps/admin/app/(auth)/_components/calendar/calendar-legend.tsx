"use client";

export function CalendarLegend(): JSX.Element {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-yellow-500" />
        <span className="text-muted-foreground">Scheduled</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-green-500" />
        <span className="text-muted-foreground">Published</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-purple-500" />
        <span className="text-muted-foreground">Newsletter</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-blue-500" />
        <span className="text-muted-foreground">Idea</span>
      </div>
    </div>
  );
}
