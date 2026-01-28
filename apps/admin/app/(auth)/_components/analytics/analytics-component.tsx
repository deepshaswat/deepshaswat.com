"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchAnalyticsData, type AnalyticsData } from "@repo/actions";
import { StatsOverview } from "./stats-overview";
import { MemberGrowthChart } from "./member-growth";
import { TopPosts } from "./top-posts";

export function AnalyticsComponent(): JSX.Element {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async (): Promise<void> => {
      try {
        const analyticsData = await fetchAnalyticsData();
        setData(analyticsData);
      } catch {
        // Failed to load analytics
      } finally {
        setLoading(false);
      }
    };

    void loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your content and subscriber metrics
        </p>
      </div>

      <StatsOverview
        activeMembers={data.activeMembers}
        postsByStatus={data.postsByStatus}
        totalMembers={data.totalMembers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemberGrowthChart data={data.membersByMonth} />
        <TopPosts posts={data.topPosts} />
      </div>
    </div>
  );
}
