"use server";

import { SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import prisma from "@repo/db/client";
import { PostListType, PostType } from "../common/types";
import { sendBroadcastNewsletter, sendNewsletter } from "../common/resend";
import { cacheService } from "@repo/ui/web";
import {
  invalidatePostCache,
  invalidateBlogContentCache,
} from "../web/redis-client";

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

    if (data.tags && data.tags.length > 0) {
      await prisma.tagOnPost.createMany({
        data: data.tags.map((tag) => ({
          postId: newPost.id,
          tagId: tag.id,
        })),
      });
    }

    await prisma.tagOnPost.findMany({
      where: {
        postId: newPost.id,
        tagId: { in: data.tags.map((tag) => tag.id) },
      },
    });

    const updatedPost = await prisma.post.findUnique({
      where: { id: newPost.id },
      include: { tags: true },
    });

    if (updatedPost?.status === "PUBLISHED") {
      if (updatedPost.isNewsletter) {
        revalidatePath("/newsletter");
        await cacheService.clearNewslettersCache();
        await invalidatePostCache("newsletters");
      } else {
        revalidatePath("/articles");
        await cacheService.clearArticlesCache();
        await invalidatePostCache("articles");
      }
      await invalidateBlogContentCache(updatedPost.postUrl);
    }

    return { post: updatedPost, success: true };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Error creating post" };
  }
}

async function updatePost(data: PostType, postId: string) {
  await authenticateUser();
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

    await prisma.tagOnPost.deleteMany({
      where: { postId },
    });

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

    if (post.tags && post.tags.length > 0) {
      await prisma.tagOnPost.createMany({
        data: post.tags.map((tag) => ({
          postId: updatedPost.id,
          tagId: tag.id,
        })),
      });
    }

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

    if (finalUpdatedPost?.status === "PUBLISHED") {
      if (finalUpdatedPost.isNewsletter) {
        revalidatePath("/newsletter");
        await cacheService.clearNewslettersCache();
        await invalidatePostCache("newsletters");
      } else {
        revalidatePath("/articles");
        await cacheService.clearArticlesCache();
        await invalidatePostCache("articles");
      }
      revalidatePath(`/${finalUpdatedPost.postUrl}`);
      await invalidateBlogContentCache(finalUpdatedPost.postUrl);
    }

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

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: data,
    });

    if (publishType === "newsletter") {
      await sendBroadcastNewsletter({ post, sendData: data, markdown });
    }

    if (updatedPost.status === "PUBLISHED") {
      if (publishType === "newsletter") {
        revalidatePath("/newsletter");
        await cacheService.clearNewslettersCache();
        await invalidatePostCache("newsletters");
      } else {
        revalidatePath("/articles");
        await cacheService.clearArticlesCache();
        await invalidatePostCache("articles");
      }
      revalidatePath(`/${updatedPost.postUrl}`);
      await invalidateBlogContentCache(updatedPost.postUrl);
    }

    return { success: true };
  } catch (error) {
    console.error("Error publishing post:", error);
    return { error: "Error publishing post" };
  }
}

export { createPost, updatePost, publishPost };
