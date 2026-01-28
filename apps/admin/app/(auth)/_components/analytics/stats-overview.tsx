"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Users, FileText, Send } from "lucide-react";
import type { PostsByStatus } from "@repo/actions";

interface StatsOverviewProps {
  postsByStatus: PostsByStatus[];
  totalMembers: number;
  activeMembers: number;
}

export function StatsOverview({
  postsByStatus,
  totalMembers,
  activeMembers,
}: StatsOverviewProps): JSX.Element {
  const getStatusCount = (status: string): number => {
    const found = postsByStatus.find((p) => p.status === status);
    return found?.count || 0;
  };

  const totalPosts = postsByStatus.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPosts}</div>
          <p className="text-xs text-muted-foreground">
            {getStatusCount("DRAFT")} drafts, {getStatusCount("PUBLISHED")}{" "}
            published
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <Send className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getStatusCount("PUBLISHED")}
          </div>
          <p className="text-xs text-muted-foreground">
            {getStatusCount("SCHEDULED")} scheduled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Subscribers
          </CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            {activeMembers} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
          <Users className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalMembers > 0
              ? Math.round((activeMembers / totalMembers) * 100)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            {totalMembers - activeMembers} unsubscribed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
