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

export async function fetchMembers({
  pageNumber,
  pageSize,
  search,
  isSubscribed,
}: {
  pageNumber: number;
  pageSize: number;
  search: string;
  isSubscribed?: boolean;
}) {
  await authenticateUser();

  const offset = pageNumber * pageSize;
  try {
    const members = await prisma.member.findMany({
      skip: offset,
      take: pageSize,
      where: {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
        ],
        unsubscribed: isSubscribed,
      },
    });
    return members as Member[];
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
}

export async function fetchMemberDetails(id: string) {
  await authenticateUser();
  try {
    const member = await prisma.member.findUnique({
      where: { id },
    });
    return member as Member;
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
