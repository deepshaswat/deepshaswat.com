"use server";

import prisma from "@repo/db/client";
import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { PostListType, PostStatus } from "./post-types";

const splitAndCapitalize = (item: string) => {
  const [firstWord] = item.split("-");
  return firstWord.toUpperCase();
};

async function authenticateUser() {
  const sign = await SignedIn;
  if (!sign) {
    redirect("/sign-in");
  }
}

export async function fetchAllPostsCount(
  postOption: string,
  tagOption: string
) {
  await authenticateUser();
  // modify for based on postOption and tagOption
  if (postOption === "all-posts") {
    const posts = await prisma.post.count();
    return posts;
  } else if (postOption === "featured-posts") {
    const posts = await prisma.post.count({
      where: {
        featured: true,
      },
    });
    return posts;
  } else if (postOption === "newsletters") {
    const posts = await prisma.post.count({
      where: {
        isNewsletter: true,
      },
    });
    return posts;
  } else {
    const posts = await prisma.post.count({
      where: {
        status: splitAndCapitalize(postOption) as PostStatus,
      },
    });
    return posts;
  }
}

export async function fetchAllPosts(
  postOption: string,
  tagOption: string,
  pageNumber: number
) {
  await authenticateUser();
  const pageSize = 10;
  const offset = pageNumber * pageSize;

  if (postOption === "all-posts") {
    const posts = await prisma.post.findMany({
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
    });

    return posts as PostListType[];
  } else if (postOption === "featured-posts") {
    const posts = await prisma.post.findMany({
      where: {
        featured: true,
      },
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
    });

    return posts as PostListType[];
  } else if (postOption === "newsletters") {
    const posts = await prisma.post.findMany({
      where: {
        isNewsletter: true,
      },
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
    });

    return posts as PostListType[];
  } else {
    console.log("Fetching posts for", postOption, tagOption);
    const posts = await prisma.post.findMany({
      where: {
        status: splitAndCapitalize(postOption) as PostStatus,
      },
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
    });

    return posts as PostListType[];
  }
}

export async function fetchPostById(id: string) {
  await authenticateUser();
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
      author: true,
    },
  });

  return post;
}
