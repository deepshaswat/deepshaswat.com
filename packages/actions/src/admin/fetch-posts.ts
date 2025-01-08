"use server";

import prisma from "@repo/db/client";
import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { PostListType, PostStatus } from "../common/types";

const splitAndCapitalize = (item: string) => {
  const [firstWord] = item.split("-");
  return firstWord.toUpperCase();
};

// async function authenticateUser() {
//   const sign = await SignedIn;
//   if (!sign) {
//     redirect("/sign-in");
//   }
// }

export async function fetchAllPostsCount(
  postOption: string,
  tagOption: string
) {
  // await authenticateUser();
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
  } else if (postOption === "articles") {
    const posts = await prisma.post.count({
      where: {
        status: "PUBLISHED",
        isNewsletter: false,
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

export async function fetchPublishedPostsCount(postOption: string) {
  // await authenticateUser();
  // modify for based on postOption and tagOption
  if (postOption === "all-posts") {
    const posts = await prisma.post.count();
    return posts;
  } else if (postOption === "featured-posts") {
    const posts = await prisma.post.count({
      where: {
        featured: true,
        status: "PUBLISHED",
      },
    });
    return posts;
  } else if (postOption === "newsletters") {
    const posts = await prisma.post.count({
      where: {
        isNewsletter: true,
        status: "PUBLISHED",
      },
    });
    return posts;
  } else if (postOption === "articles") {
    const posts = await prisma.post.count({
      where: {
        status: "PUBLISHED",
        isNewsletter: false,
      },
    });
    return posts;
  }
  return 0;
}

export async function fetchAllPosts(
  postOption: string,
  tagOption: string,
  pageNumber: number
) {
  //  await authenticateUser();
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
      orderBy: {
        publishDate: "desc",
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
      orderBy: {
        publishDate: "desc",
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
      orderBy: {
        publishDate: "desc",
      },
    });

    return posts as PostListType[];
  } else if (postOption === "articles") {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        isNewsletter: false,
      },
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });
    return posts as PostListType[];
  } else {
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
      orderBy: {
        publishDate: "desc",
      },
    });

    return posts as PostListType[];
  }
}

export async function fetchPublishedPosts(postOption: string) {
  // await authenticateUser();

  if (postOption === "featured-posts") {
    const posts = await prisma.post.findMany({
      where: {
        featured: true,
        status: "PUBLISHED",
        isNewsletter: false,
      },
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });

    return posts as PostListType[];
  } else if (postOption === "newsletters") {
    const posts = await prisma.post.findMany({
      where: {
        isNewsletter: true,
        status: "PUBLISHED",
      },
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });

    return posts as PostListType[];
  } else if (postOption === "articles") {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        isNewsletter: false,
      },
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });
    return posts as PostListType[];
  }
  return [];
}
export async function fetchPublishedPostsPaginated(
  postOption: string,
  pageNumber: number
) {
  // await authenticateUser();
  const pageSize = 10;
  const offset = pageNumber * pageSize;

  if (postOption === "featured-posts") {
    const posts = await prisma.post.findMany({
      where: {
        featured: true,
        status: "PUBLISHED",
      },
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });

    return posts as PostListType[];
  } else if (postOption === "newsletters") {
    const posts = await prisma.post.findMany({
      where: {
        isNewsletter: true,
        status: "PUBLISHED",
      },
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });

    return posts as PostListType[];
  } else if (postOption === "articles") {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        isNewsletter: false,
      },
      skip: offset,
      take: pageSize,
      include: {
        tags: true,
        author: true,
      },
      orderBy: {
        publishDate: "desc",
      },
    });
    return posts as PostListType[];
  }
  return [];
}

export async function fetchPostById(id: string) {
  // await authenticateUser();
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
      author: true,
    },
  });

  return post;
}

export async function fetchPostByPostUrl(postUrl: string) {
  // await authenticateUser();
  const post = await prisma.post.findUnique({
    where: { postUrl },
    include: {
      tags: true,
      author: true,
    },
  });

  return post;
}
