"use server";

import prisma from "@repo/db/client";
import { currentUser } from "@clerk/nextjs/server";

import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function authenticateUser() {
  const sign = await SignedIn;
  if (!sign) {
    redirect("/sign-in");
  }
}

export async function createAuthor() {
  await authenticateUser();
  const user = await currentUser();

  // add author to db under try catch
  try {
    const existingAuthor = await prisma.author.findUnique({
      where: { clerkId: user?.id },
    });

    if (!existingAuthor) {
      await prisma.author.create({
        data: {
          clerkId: user?.id ?? "",
          name: user?.firstName + " " + user?.lastName ?? "",
          email: user?.emailAddresses[0].emailAddress ?? "",
          imageUrl: user?.imageUrl ?? "",
          role: "ADMIN",
        },
      });
    }
    // Return a plain object
    return {
      id: existingAuthor?.id ?? "",
      name: existingAuthor?.name ?? "",
      email: existingAuthor?.email ?? "",
      imageUrl: existingAuthor?.imageUrl ?? "",
      role: existingAuthor?.role ?? "",
    };
  } catch (error) {
    console.error("Error creating author:", error);
    return { error: "Error creating author" };
  }
}
