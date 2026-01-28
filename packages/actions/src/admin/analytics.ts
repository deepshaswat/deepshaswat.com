"use server";

import prisma from "@repo/db/client";
import { PostListType } from "../common/types";

export interface PostsByStatus {
  status: string;
  count: number;
}

export interface MemberGrowth {
  month: string;
  count: number;
}

export interface AnalyticsData {
  postsByStatus: PostsByStatus[];
  membersByMonth: MemberGrowth[];
  topPosts: PostListType[];
  totalMembers: number;
  activeMembers: number;
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  const [
    postsByStatusRaw,
    membersByMonthData,
    topPosts,
    totalMembers,
    activeMembers,
  ] = await Promise.all([
    prisma.post.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    fetchMemberGrowth(),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      take: 10,
      orderBy: { publishDate: "desc" },
      include: {
        author: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.member.count(),
    prisma.member.count({ where: { unsubscribed: false } }),
  ]);

  const postsByStatus = postsByStatusRaw.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  return {
    postsByStatus,
    membersByMonth: membersByMonthData,
    topPosts: topPosts as PostListType[],
    totalMembers,
    activeMembers,
  };
}

async function fetchMemberGrowth(): Promise<MemberGrowth[]> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const members = await prisma.member.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const monthCounts: { [key: string]: number } = {};

  members.forEach((member) => {
    const monthKey = new Date(member.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthCounts).map(([month, count]) => ({
    month,
    count,
  }));
}

export async function fetchContentStats() {
  const [totalPosts, totalTags, totalNewsletters] = await Promise.all([
    prisma.post.count(),
    prisma.tag.count(),
    prisma.post.count({ where: { isNewsletter: true } }),
  ]);

  return { totalPosts, totalTags, totalNewsletters };
}
