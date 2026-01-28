"use server";

import prisma from "@repo/db/client";
import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Member, MemberInput } from "../common/types";
import {
  addContactToAudience,
  deleteContactAudience,
  updateContactAudience,
} from "../common/resend";

async function authenticateUser() {
  const sign = await SignedIn;
  if (!sign) {
    redirect("/sign-in");
  }
}

export async function importMembers(members: MemberInput[]) {
  await authenticateUser();
  let count = 0;
  try {
    for (const member of members) {
      await createMember(member as Member);
      count++;
    }
    return {
      success: "Members imported successfully",
      count: count,
    };
  } catch (error) {
    console.error("Error importing members:", error);
    return {
      error: "Error importing members",
    };
  }
}

export async function totalMembers() {
  await authenticateUser();
  const members = await prisma.member.count();
  return members;
}

export async function createMember(member: Member) {
  // await authenticateUser();
  try {
    const existingMember = await prisma.member.findUnique({
      where: { email: member.email },
    });

    if (existingMember && existingMember.unsubscribed === false) {
      return existingMember;
    } else if (existingMember && existingMember.unsubscribed === true) {
      await prisma.member.update({
        where: { id: existingMember.id },
        data: { unsubscribed: false },
      });
      if (existingMember.resendContactId) {
        await updateContactAudience({
          id: existingMember.resendContactId,
          unsubscribed: false,
        });
      }
      return existingMember;
    }

    const newMember = await prisma.member.create({
      data: member,
    });

    const { data, error } = await addContactToAudience({
      email: member.email,
      firstName: member.firstName || "",
      lastName: member.lastName || "",
      unsubscribed: member.unsubscribed,
    });

    if (data?.id) {
      await prisma.member.update({
        where: { id: newMember.id },
        data: { resendContactId: data.id },
      });
    }

    return newMember;
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
}

export async function unsubscribeMember(email: string) {
  // await authenticateUser();
  try {
    const existingMember = await prisma.member.findUnique({
      where: { email },
    });

    if (existingMember && existingMember.unsubscribed === true) {
      return existingMember;
    } else if (existingMember && existingMember.unsubscribed === false) {
      await prisma.member.update({
        where: { id: existingMember.id },
        data: { unsubscribed: true },
      });
      if (existingMember.resendContactId) {
        await updateContactAudience({
          id: existingMember.resendContactId,
          unsubscribed: true,
        });
      }
      return existingMember;
    }
  } catch (error) {
    console.error("Error unsubscribing member:", error);
    return {
      error: "Error unsubscribing member",
    };
  }
}

export async function deleteMember(id: string) {
  await authenticateUser();
  try {
    const existingMember = await prisma.member.findUnique({
      where: { id },
    });
    if (existingMember) {
      if (existingMember.resendContactId) {
        const { error } = await deleteContactAudience(
          existingMember.resendContactId,
        );
        if (error) {
          throw new Error(error);
        }
      }
      await prisma.member.delete({
        where: { id },
      });
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
}

export interface MemberFilters {
  name?: { operator: string; value: string };
  email?: { operator: string; value: string };
  subscriptionStatus?: "subscribed" | "unsubscribed";
  location?: { operator: string; value: string };
  createdAt?: { operator: string; value: string };
}

// Helper to build text filter condition based on operator
function buildTextFilter(
  operator: string,
  value: string,
):
  | {
      contains?: string;
      startsWith?: string;
      endsWith?: string;
      equals?: string;
      not?: { contains: string };
    }
  | undefined {
  if (!value) return undefined;

  switch (operator) {
    case "contains":
      return { contains: value };
    case "does not contain":
      return { not: { contains: value } };
    case "starts with":
      return { startsWith: value };
    case "ends with":
      return { endsWith: value };
    case "is":
      return { equals: value };
    default:
      return { contains: value };
  }
}

// Helper to build date filter condition based on operator
function buildDateFilter(
  operator: string,
  value: string,
): { equals?: Date; lt?: Date; gt?: Date; lte?: Date; gte?: Date } | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (isNaN(date.getTime())) return undefined;

  // Set time to start of day for comparison
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  switch (operator) {
    case "is":
      return { gte: startOfDay, lte: endOfDay };
    case "is before":
      return { lt: startOfDay };
    case "is after":
      return { gt: endOfDay };
    case "is on or before":
      return { lte: endOfDay };
    case "is on or after":
      return { gte: startOfDay };
    default:
      return undefined;
  }
}

export async function fetchMembers({
  pageNumber,
  pageSize,
  search,
  filters,
}: {
  pageNumber: number;
  pageSize: number;
  search: string;
  filters?: MemberFilters;
}) {
  await authenticateUser();

  const offset = pageNumber * pageSize;

  try {
    // Build the where clause
    const whereConditions: Record<string, unknown>[] = [];

    // Search across name and email
    if (search) {
      whereConditions.push({
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // Apply filters if provided
    if (filters) {
      // Name filter (searches both firstName and lastName)
      if (filters.name?.value) {
        const textFilter = buildTextFilter(
          filters.name.operator,
          filters.name.value,
        );
        if (textFilter) {
          whereConditions.push({
            OR: [{ firstName: textFilter }, { lastName: textFilter }],
          });
        }
      }

      // Email filter
      if (filters.email?.value) {
        const textFilter = buildTextFilter(
          filters.email.operator,
          filters.email.value,
        );
        if (textFilter) {
          whereConditions.push({ email: textFilter });
        }
      }

      // Subscription status filter (boolean)
      if (filters.subscriptionStatus) {
        const isUnsubscribed = filters.subscriptionStatus === "unsubscribed";
        whereConditions.push({ unsubscribed: isUnsubscribed });
      }

      // Location filter
      if (filters.location?.value) {
        const textFilter = buildTextFilter(
          filters.location.operator,
          filters.location.value,
        );
        if (textFilter) {
          whereConditions.push({ location: textFilter });
        }
      }

      // Created date filter
      if (filters.createdAt?.value) {
        const dateFilter = buildDateFilter(
          filters.createdAt.operator,
          filters.createdAt.value,
        );
        if (dateFilter) {
          whereConditions.push({ createdAt: dateFilter });
        }
      }
    }

    const members = await prisma.member.findMany({
      skip: offset,
      take: pageSize,
      where: whereConditions.length > 0 ? { AND: whereConditions } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return members as Member[];
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
}

// Also add a count function that respects filters
export async function countFilteredMembers({
  search,
  filters,
}: {
  search: string;
  filters?: MemberFilters;
}): Promise<number> {
  await authenticateUser();

  try {
    const whereConditions: Record<string, unknown>[] = [];

    if (search) {
      whereConditions.push({
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (filters) {
      if (filters.name?.value) {
        const textFilter = buildTextFilter(
          filters.name.operator,
          filters.name.value,
        );
        if (textFilter) {
          whereConditions.push({
            OR: [{ firstName: textFilter }, { lastName: textFilter }],
          });
        }
      }

      if (filters.email?.value) {
        const textFilter = buildTextFilter(
          filters.email.operator,
          filters.email.value,
        );
        if (textFilter) {
          whereConditions.push({ email: textFilter });
        }
      }

      if (filters.subscriptionStatus) {
        const isUnsubscribed = filters.subscriptionStatus === "unsubscribed";
        whereConditions.push({ unsubscribed: isUnsubscribed });
      }

      if (filters.location?.value) {
        const textFilter = buildTextFilter(
          filters.location.operator,
          filters.location.value,
        );
        if (textFilter) {
          whereConditions.push({ location: textFilter });
        }
      }

      if (filters.createdAt?.value) {
        const dateFilter = buildDateFilter(
          filters.createdAt.operator,
          filters.createdAt.value,
        );
        if (dateFilter) {
          whereConditions.push({ createdAt: dateFilter });
        }
      }
    }

    const count = await prisma.member.count({
      where: whereConditions.length > 0 ? { AND: whereConditions } : undefined,
    });

    return count;
  } catch (error) {
    console.error("Error counting members:", error);
    throw error;
  }
}

export async function fetchMemberDetails(id: string): Promise<Member | null> {
  await authenticateUser();
  try {
    const member = await prisma.member.findUnique({
      where: { id },
    });
    if (!member) {
      return null;
    }
    return member as unknown as Member;
  } catch (error) {
    console.error("Error fetching member details:", error);
    throw error;
  }
}

export async function updateMember(id: string, member: Member) {
  await authenticateUser();
  try {
    await prisma.member.update({
      where: { id },
      data: {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        note: member.note,
        unsubscribed: member.unsubscribed,
      },
    });

    if (member.resendContactId) {
      await updateContactAudience({
        id: member.resendContactId,
        firstName: member.firstName,
        lastName: member.lastName,
        unsubscribed: member.unsubscribed,
      });
    }
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}
