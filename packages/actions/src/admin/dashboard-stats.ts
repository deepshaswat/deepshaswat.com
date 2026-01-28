"use server";

import prisma from "@repo/db/client";
import { PostListType } from "../common/types";

export interface DashboardStats {
  totalPosts: number;
  drafts: number;
  published: number;
  scheduled: number;
  newsletters: number;
  members: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [totalPosts, drafts, published, scheduled, newsletters, members] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "SCHEDULED" } }),
      prisma.post.count({ where: { isNewsletter: true } }),
      prisma.member.count({ where: { unsubscribed: false } }),
    ]);

  return { totalPosts, drafts, published, scheduled, newsletters, members };
}

export async function fetchRecentPosts(
  limit: number = 5,
): Promise<PostListType[]> {
  const posts = await prisma.post.findMany({
    take: limit,
    orderBy: { updatedAt: "desc" },
    include: {
      author: true,
      tags: true,
    },
  });

  return posts as PostListType[];
}
