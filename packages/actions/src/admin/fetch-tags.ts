"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@repo/db/client";
import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Import your validation schema
import { tagSchema, updateTagSchema } from "@repo/schema";

interface TagWithPostCount {
  id: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  postCount: string;
}

async function authenticateUser() {
  const sign = await SignedIn;
  if (!sign) {
    redirect("/sign-in");
  }
}

async function fetchAllTagsWithPostCount(): Promise<TagWithPostCount[]> {
  await authenticateUser();
  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true, // Include the ID field
        slug: true, // Include the slug field
        description: true, // Include the description field
        imageUrl: true, // Include the imageUrl field
        posts: {
          select: {
            id: true, // Select IDs of posts to calculate the post count
          },
        },
      },
    });

    return tags.map((tag) => ({
      id: tag.id,
      slug: tag.slug,
      description: tag.description ?? undefined,
      imageUrl: tag.imageUrl ?? undefined,
      postCount: tag.posts.length.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch tags with post count:", error);
    throw new Error("Failed to fetch tags");
  }
}

interface TagIterface {
  slug: string;
  description?: string;
  imageUrl?: string;
  posts?: any[];
}

async function fetchTagDetails(slug: string) {
  await authenticateUser();
  try {
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return existingTag;
    } else {
      console.log("Tag does not exist");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch tag:", error);

    return null;
  }
}

async function createTagAction(data: TagIterface) {
  await authenticateUser();
  const validatedData = tagSchema.safeParse(data);

  if (!validatedData.success) {
    console.log("Validation error:", validatedData.error.format());
    return {
      error: validatedData.error.format(),
    };
  }

  const { slug, description, imageUrl } = validatedData.data;
  try {
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      console.log("Tag already exists");
      return {
        error: { slug: "Slug already exists" },
      };
    }

    console.log("Data being passed to Prisma:", validatedData.data);

    console.time("DB Operation");
    const newTag = await prisma.tag.create({
      data: {
        slug,
        description,
        imageUrl,
      },
    });
    console.timeEnd("DB Operation");

    return { success: true, tag: newTag };
  } catch (error) {
    console.error("Failed to create tag:", error);
    return { error: "Failed to create tag." };
  }
}

interface UpdateTagInterface {
  id: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

async function updateTagAction(data: UpdateTagInterface) {
  await authenticateUser();
  // Validate the incoming data
  const validatedData = updateTagSchema.safeParse(data);

  if (!validatedData.success) {
    console.log("Validation error:", validatedData.error.format());
    return { error: validatedData.error.format() };
  }

  const { id, slug, description, imageUrl } = validatedData.data;

  try {
    // Check if the slug is unique
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag && existingTag.id !== id) {
      return { error: { slug: "Slug already exists" } };
    }

    // Update the tag in the database
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        slug,
        description,
        imageUrl,
      },
    });
    return updatedTag;
  } catch (error) {
    console.error("Failed to update tag:", error);
    return { error: "Failed to update tag." };
  }
}

async function deleteTagAction(slug: string) {
  await authenticateUser();
  try {
    await prisma.tag.delete({
      where: { slug },
    });

    return true;
  } catch (error) {
    console.error("Failed to delete tag:", error);
    throw new Error("Failed to delete tag");
  }
  return false;
}

export {
  fetchTagDetails,
  createTagAction,
  fetchAllTagsWithPostCount,
  updateTagAction,
  deleteTagAction,
};
