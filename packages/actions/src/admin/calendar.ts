"use server";

import prisma from "@repo/db/client";

export type CalendarEventType =
  | "scheduled"
  | "published"
  | "idea"
  | "newsletter";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: CalendarEventType;
  status: string;
  postUrl?: string;
}

export async function fetchCalendarEvents(
  startDate: Date,
  endDate: Date,
): Promise<CalendarEvent[]> {
  const [scheduledPosts, publishedPosts, ideas] = await Promise.all([
    // Scheduled posts
    prisma.post.findMany({
      where: {
        status: "SCHEDULED",
        publishDate: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        title: true,
        publishDate: true,
        status: true,
        postUrl: true,
        isNewsletter: true,
      },
    }),
    // Published posts
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishDate: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        title: true,
        publishDate: true,
        status: true,
        postUrl: true,
        isNewsletter: true,
      },
    }),
    // Ideas with target dates
    prisma.idea.findMany({
      where: {
        targetDate: { gte: startDate, lte: endDate },
        status: { not: "ARCHIVED" },
      },
      select: {
        id: true,
        title: true,
        targetDate: true,
        status: true,
      },
    }),
  ]);

  const events: CalendarEvent[] = [
    ...scheduledPosts.map((p) => ({
      id: p.id,
      title: p.title,
      date: p.publishDate!,
      type: (p.isNewsletter ? "newsletter" : "scheduled") as CalendarEventType,
      status: p.status,
      postUrl: p.postUrl,
    })),
    ...publishedPosts.map((p) => ({
      id: p.id,
      title: p.title,
      date: p.publishDate!,
      type: (p.isNewsletter ? "newsletter" : "published") as CalendarEventType,
      status: p.status,
      postUrl: p.postUrl,
    })),
    ...ideas.map((i) => ({
      id: i.id,
      title: i.title,
      date: i.targetDate!,
      type: "idea" as CalendarEventType,
      status: i.status,
    })),
  ];

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function updateIdeaTargetDate(
  ideaId: string,
  targetDate: Date | null,
): Promise<void> {
  await prisma.idea.update({
    where: { id: ideaId },
    data: { targetDate },
  });
}

export async function fetchIdeasWithTargetDates(): Promise<
  Array<{
    id: string;
    title: string;
    targetDate: Date | null;
    status: string;
  }>
> {
  const ideas = await prisma.idea.findMany({
    where: {
      status: { not: "ARCHIVED" },
    },
    select: {
      id: true,
      title: true,
      targetDate: true,
      status: true,
    },
    orderBy: { targetDate: "asc" },
  });

  return ideas;
}
