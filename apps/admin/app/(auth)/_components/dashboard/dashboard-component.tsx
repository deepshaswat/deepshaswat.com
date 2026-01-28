"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchDashboardStats,
  fetchRecentPosts,
  type DashboardStats,
  type PostListType,
} from "@repo/actions";
import { StatsCards } from "./stats-cards";
import { RecentPosts } from "./recent-posts";
import { QuickActions } from "./quick-actions";

export function DashboardComponent(): JSX.Element {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async (): Promise<void> => {
      try {
        const [statsData, postsData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentPosts(5),
        ]);
        setStats(statsData);
        setRecentPosts(postsData);
      } catch {
        // Failed to load dashboard data
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your content management dashboard
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPosts posts={recentPosts} />
        <QuickActions />
      </div>
    </div>
  );
}
