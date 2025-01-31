"use server";

import { getRedisClient } from "@repo/db/redis";
import { PostListType } from "../common/types";

// Articles and Featured Posts
export async function getArticlesCount(): Promise<number | null> {
  try {
    const redis = getRedisClient();
    const count = await redis.get("articles_count");
    return count ? parseInt(count) : null;
  } catch (error) {
    console.error("Error getting articles count from Redis:", error);
    return null;
  }
}

export async function setArticlesCount(count: number): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.set("articles_count", count.toString());
  } catch (error) {
    console.error("Error setting articles count in Redis:", error);
  }
}

export async function getArticlesPosts(
  option: string
): Promise<PostListType[] | null> {
  try {
    const redis = getRedisClient();
    const posts = await redis.get(`${option}_posts`);
    return posts ? JSON.parse(posts) : null;
  } catch (error) {
    console.error(`Error getting ${option} posts from Redis:`, error);
    return null;
  }
}

export async function setArticlesPosts(
  option: string,
  posts: PostListType[]
): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.set(`${option}_posts`, JSON.stringify(posts));
  } catch (error) {
    console.error(`Error setting ${option} posts in Redis:`, error);
  }
}

// Blog Content
export async function getBlogContent(
  postUrl: string
): Promise<PostListType | null> {
  try {
    const redis = getRedisClient();
    const post = await redis.get(`blog_content_${postUrl}`);
    return post ? JSON.parse(post) : null;
  } catch (error) {
    console.error("Error getting blog content from Redis:", error);
    return null;
  }
}

export async function setBlogContent(
  postUrl: string,
  post: PostListType
): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.set(`blog_content_${postUrl}`, JSON.stringify(post));
  } catch (error) {
    console.error("Error setting blog content in Redis:", error);
  }
}

// Newsletters
export async function getNewslettersCount(): Promise<number | null> {
  try {
    const redis = getRedisClient();
    const count = await redis.get("newsletters_count");
    return count ? parseInt(count) : null;
  } catch (error) {
    console.error("Error getting newsletters count from Redis:", error);
    return null;
  }
}

export async function setNewslettersCount(count: number): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.set("newsletters_count", count.toString());
  } catch (error) {
    console.error("Error setting newsletters count in Redis:", error);
  }
}

export async function getNewslettersPosts(): Promise<PostListType[] | null> {
  try {
    const redis = getRedisClient();
    const posts = await redis.get("newsletters_posts");
    return posts ? JSON.parse(posts) : null;
  } catch (error) {
    console.error("Error getting newsletter posts from Redis:", error);
    return null;
  }
}

export async function setNewslettersPosts(
  posts: PostListType[]
): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.set("newsletters_posts", JSON.stringify(posts));
  } catch (error) {
    console.error("Error setting newsletter posts in Redis:", error);
  }
}

// Cache Invalidation
export async function invalidatePostCache(postType: string): Promise<void> {
  try {
    const redis = getRedisClient();

    // Invalidate counts
    await redis.del(`${postType}_count`);

    // Invalidate posts list
    await redis.del(`${postType}_posts`);

    // If it's an article, also invalidate featured posts
    if (postType === "articles") {
      await redis.del("featured-posts_posts");
    }
  } catch (error) {
    console.error(`Error invalidating ${postType} cache:`, error);
  }
}

export async function invalidateBlogContentCache(
  postUrl: string
): Promise<void> {
  try {
    const redis = getRedisClient();
    await redis.del(`blog_content_${postUrl}`);
  } catch (error) {
    console.error("Error invalidating blog content cache:", error);
  }
}
