"use server";

import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prisma from "@repo/db/client";
import { PostListType, PostType } from "./post-types";
import { sendNewsletter } from "../mail";

async function authenticateUser() {
  const sign = await SignedIn;
  if (!sign) {
    redirect("/sign-in");
  }
}

async function createPost(data: PostType) {
  await authenticateUser();
  try {
    const existingPost = await prisma.post.findUnique({
      where: { postUrl: data.postUrl },
    });

    if (existingPost) {
      console.log("Post URL already exists");
      return { error: "Post URL already exists" };
    }

    // console.log("Creating post:", data);
    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        postUrl: data.postUrl,
        publishDate: data.publishDate || undefined,
        excerpt: data.excerpt,
        featured: data.featured,
        featureImage: data.featureImage,
        author: {
          connect: { id: data.authorId },
        },
        metadataTitle: data.metaData.title,
        metadataDescription: data.metaData.description,
        metadataImageUrl: data.metaData.imageUrl,
        metadataKeywords: data.metaData.keywords,
        metadataAuthorName: data.metaData.authorName,
        metadataCanonicalUrl: data.metaData.canonicalUrl,
        metadataOgTitle: data.metaData.ogTitle,
        metadataOgDescription: data.metaData.ogDescription,
        metadataOgImage: data.metaData.ogImage,
        metadataTwitterCard: data.metaData.twitterCard,
        metadataTwitterTitle: data.metaData.twitterTitle,
        metadataTwitterDescription: data.metaData.twitterDescription,
        metadataTwitterImage: data.metaData.twitterImage,
      },
    });

    // 2. Insert tag connections if there are any tags
    if (data.tags && data.tags.length > 0) {
      await prisma.tagOnPost.createMany({
        data: data.tags.map((tag) => ({
          postId: newPost.id,
          tagId: tag.id,
        })),
      });
    }

    // 3. Fetch the TagOnPost records to get their generated IDs
    // const createdTagConnections =
    await prisma.tagOnPost.findMany({
      where: {
        postId: newPost.id,
        tagId: { in: data.tags.map((tag) => tag.id) },
      },
    });

    // Optionally fetch the updated post with tags included, if needed:
    const updatedPost = await prisma.post.findUnique({
      where: { id: newPost.id },
      include: { tags: true },
    });

    // console.log("Created post with tags:", updatedPost);
    return { post: updatedPost, success: true };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Error creating post" };
  }
}

async function updatePost(data: PostType, postId: string) {
  await authenticateUser();
  // Construct the post object
  const post: PostType = {
    title: data.title,
    content: data.content,
    postUrl: data.postUrl,
    publishDate: data.publishDate
      ? new Date(data.publishDate.toString())
      : null,
    excerpt: data.excerpt,
    featured: data.featured,
    featureImage: data.featureImage,
    // Initially, we just store the incoming tag IDs
    tags: data.tags,
    authorId: data.authorId,
    metaData: {
      title: data.metaData.title,
      description: data.metaData.description,
      imageUrl: data.metaData.imageUrl,
      keywords: data.metaData.keywords,
      authorName: data.metaData.authorName,
      canonicalUrl: data.metaData.canonicalUrl,
      ogTitle: data.metaData.ogTitle,
      ogDescription: data.metaData.ogDescription,
      ogImage: data.metaData.ogImage,
      twitterCard: data.metaData.twitterCard,
      twitterTitle: data.metaData.twitterTitle,
      twitterDescription: data.metaData.twitterDescription,
      twitterImage: data.metaData.twitterImage,
    },
  };

  try {
    const existingPost = await prisma.post.findUnique({
      where: {
        postUrl: post.postUrl,
        NOT: {
          id: postId,
        },
      },
    });

    if (existingPost) {
      console.log("Post URL already exists");
      return { error: "Post URL already exists" };
    }
    // 1. Delete existing tag connections
    await prisma.tagOnPost.deleteMany({
      where: { postId },
    });

    // 2. Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: post.title,
        content: post.content,
        postUrl: post.postUrl,
        publishDate: post.publishDate || undefined,
        excerpt: post.excerpt,
        featured: post.featured,
        featureImage: post.featureImage,
        author: {
          connect: { id: post.authorId },
        },
        metadataTitle: post.metaData.title,
        metadataDescription: post.metaData.description,
        metadataImageUrl: post.metaData.imageUrl,
        metadataKeywords: post.metaData.keywords,
        metadataAuthorName: post.metaData.authorName,
        metadataCanonicalUrl: post.metaData.canonicalUrl,
        metadataOgTitle: post.metaData.ogTitle,
        metadataOgDescription: post.metaData.ogDescription,
        metadataOgImage: post.metaData.ogImage,
        metadataTwitterCard: post.metaData.twitterCard,
        metadataTwitterTitle: post.metaData.twitterTitle,
        metadataTwitterDescription: post.metaData.twitterDescription,
        metadataTwitterImage: post.metaData.twitterImage,
      },
    });

    // 3. Insert new tag connections
    if (post.tags && post.tags.length > 0) {
      await prisma.tagOnPost.createMany({
        data: post.tags.map((tag) => ({
          postId: updatedPost.id,
          tagId: tag.id,
        })),
      });
    }

    // 4. Fetch the newly created TagOnPost records to get their IDs
    // const createdTagConnections =
    await prisma.tagOnPost.findMany({
      where: {
        postId: updatedPost.id,
        tagId: { in: post.tags.map((tag) => tag.id) },
      },
    });

    const finalUpdatedPost = await prisma.post.findUnique({
      where: { id: updatedPost.id },
      include: { tags: true },
    });

    // console.log("Updated post with tags:", finalUpdatedPost);
    return { post: finalUpdatedPost, success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "Error updating post" };
  }
}

async function publishPost(
  postId: string,
  publishDate: Date,
  scheduleType: string,
  publishType: string,
  post: PostListType,
  markdown: string,
) {
  await authenticateUser();

  let data = {};
  if (publishType === "newsletter" && scheduleType === "now") {
    data = {
      status: "PUBLISHED",
      isNewsletter: true,
      publishDate: new Date(),
    };
  } else if (publishType === "newsletter" && scheduleType === "later") {
    data = {
      status: "SCHEDULED",
      publishDate: publishDate,
      isNewsletter: true,
    };
  } else if (publishType === "blog" && scheduleType === "now") {
    data = {
      status: "PUBLISHED",
      publishDate: new Date(),
    };
  } else if (publishType === "blog" && scheduleType === "later") {
    data = {
      status: "SCHEDULED",
      publishDate: publishDate,
    };
  }

  console.log("Data:", data);

  try {
    await prisma.post.update({
      where: { id: postId },
      data: data,
    });
    if (publishType === "newsletter") {
      await sendNewsletter({ post, sendData: data, markdown });
    }
    return { success: true };
  } catch (error) {
    console.error("Error publishing post:", error);
    return { error: "Error publishing post" };
  }
}

export { createPost, updatePost, publishPost };
