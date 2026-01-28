"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import type { MemberGrowth } from "@repo/actions";

interface MemberGrowthChartProps {
  data: MemberGrowth[];
}

export function MemberGrowthChart({
  data,
}: MemberGrowthChartProps): JSX.Element {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Growth (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No subscriber data for this period
          </p>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div className="flex items-center gap-4" key={item.month}>
                <div className="w-20 text-sm text-muted-foreground">
                  {item.month}
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-sm transition-all duration-300"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
