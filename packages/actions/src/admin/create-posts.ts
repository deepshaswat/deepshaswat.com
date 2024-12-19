"use server";

import prisma from "@repo/db/client";
import { PostType } from "./post-types";

async function createPost(data: PostType) {
  try {
    // 1. Create the new post along with its metadata
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
        metaData: {
          create: {
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
        },
      },
    });

    // 2. Insert tag connections if there are any tags
    if (data.tags && data.tags.length > 0) {
      await prisma.tagOnPost.createMany({
        data: data.tags.map((tagId) => ({
          postId: newPost.id,
          tagId: tagId,
        })),
      });
    }

    // 3. Fetch the TagOnPost records to get their generated IDs
    // const createdTagConnections =
    await prisma.tagOnPost.findMany({
      where: {
        postId: newPost.id,
        tagId: { in: data.tags },
      },
    });

    // Optionally fetch the updated post with tags included, if needed:
    const updatedPost = await prisma.post.findUnique({
      where: { id: newPost.id },
      include: { tags: true, metaData: true },
    });

    // console.log("Created post with tags:", updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Error creating post" };
  }
}

async function updatePost(data: PostType, postId: string) {
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
        metaData: {
          update: {
            title: post.metaData.title,
            description: post.metaData.description,
            imageUrl: post.metaData.imageUrl,
            keywords: post.metaData.keywords,
            authorName: post.metaData.authorName,
            canonicalUrl: post.metaData.canonicalUrl,
            ogTitle: post.metaData.ogTitle,
            ogDescription: post.metaData.ogDescription,
            ogImage: post.metaData.ogImage,
            twitterCard: post.metaData.twitterCard,
            twitterTitle: post.metaData.twitterTitle,
            twitterDescription: post.metaData.twitterDescription,
            twitterImage: post.metaData.twitterImage,
          },
        },
      },
    });

    // 3. Insert new tag connections
    if (post.tags && post.tags.length > 0) {
      await prisma.tagOnPost.createMany({
        data: post.tags.map((tagId) => ({
          postId: updatedPost.id,
          tagId: tagId,
        })),
      });
    }

    // 4. Fetch the newly created TagOnPost records to get their IDs
    // const createdTagConnections =
    await prisma.tagOnPost.findMany({
      where: {
        postId: updatedPost.id,
        tagId: { in: post.tags },
      },
    });

    const finalUpdatedPost = await prisma.post.findUnique({
      where: { id: updatedPost.id },
      include: { tags: true, metaData: true },
    });

    // console.log("Updated post with tags:", finalUpdatedPost);
    return finalUpdatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "Error updating post" };
  }
}
export { createPost, updatePost };
