"use server";

import prisma from "@repo/db/client";
import { PostListType, PostStatus } from "./post-types";

const splitAndCapitalize = (item: string) => {
  const [firstWord] = item.split("-");
  return firstWord.toUpperCase();
};

export async function fetchAllPosts(postOption: string, tagOption: string) {
  if (postOption === "all-posts") {
    const posts = await prisma.post.findMany({
      //   where: {
      //     tags: {
      //       some: {
      //         tagId: tagOption,
      //       },
      //     },
      //   },
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
        tags: {
          some: {
            tagId: tagOption,
          },
        },
      },
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
        tags: {
          some: {
            tagId: tagOption,
          },
        },
      },
      include: {
        tags: true,
        author: true,
      },
    });

    return posts as PostListType[];
  } else {
    const posts = await prisma.post.findMany({
      where: {
        status: splitAndCapitalize(postOption) as PostStatus,
        tags: {
          some: {
            tagId: tagOption,
          },
        },
      },
      include: {
        tags: true,
        author: true,
      },
    });

    return posts as PostListType[];
  }
}

export async function fetchPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
      author: true,
    },
  });

  return post;
}