"use client";

import { useState, useEffect } from "react";
import type { PostListType } from "@repo/actions";
import {
  fetchPublishedPosts,
  fetchPublishedPostsCount,
  getArticlesCount,
  setArticlesCount,
  getArticlesPosts,
  setArticlesPosts,
} from "@repo/actions";
import { cacheService } from "../index-db";
import { Base } from "../posts/base-static";
import { BlogWithSearch } from "./all-blogs-list";
import { SimpleBlogWithGrid } from "./featured-blogs-grid";
import ArticlesListingSkeleton from "./skeleton-blog-listing";

const pageConfig = {
  tagline: "Failures. Guides. Paths.",
  primaryColor: "cyan" as const,
  secondaryColor: "lime" as const,
};

export function ArticlesListPage() {
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsCount, setPostsCount] = useState(0);

  const fetchPostsCount = async () => {
    try {
      const cachedCount = await cacheService.getCachedCount("articles");

      if (cachedCount !== null) {
        setPostsCount(cachedCount);
        return;
      }

      // Check Redis cache
      const redisCachedCount = await getArticlesCount();

      if (redisCachedCount !== null) {
        setPostsCount(redisCachedCount);
        await cacheService.setCachedCount("articles", redisCachedCount);
        return;
      }

      const freshCount = await fetchPublishedPostsCount("articles");

      if (typeof freshCount === "number" && freshCount >= 0) {
        setPostsCount(freshCount);
        await setArticlesCount(freshCount);
        await cacheService.setCachedCount("articles", freshCount);
      }
    } catch (_error) {
      // Post count fetch failed - will show 0 posts
    }
  };

  const fetchPosts = async ({
    option,
    setPosts: updatePosts,
  }: {
    option: string;
    setPosts: (posts: PostListType[]) => void;
  }) => {
    try {
      const cachedPosts = await cacheService.getCachedItems(
        option as "articles" | "featured-posts",
      );

      if (cachedPosts && cachedPosts.length > 0) {
        updatePosts(cachedPosts);
        return;
      }

      // Check Redis cache
      const redisCachedPosts = await getArticlesPosts(option);

      if (redisCachedPosts !== null) {
        updatePosts(redisCachedPosts);
        await cacheService.setCachedItems(
          option as "articles" | "featured-posts",
          redisCachedPosts,
        );
        return;
      }

      const freshPosts = await fetchPublishedPosts(option);

      if (Array.isArray(freshPosts) && freshPosts.length > 0) {
        updatePosts(freshPosts);
        await setArticlesPosts(option, freshPosts);
        await cacheService.setCachedItems(
          option as "articles" | "featured-posts",
          freshPosts,
        );
      }
    } catch (_error) {
      // Post fetch failed - posts will remain empty
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true);

    try {
      await fetchPostsCount();

      await fetchPosts({ option: "articles", setPosts });
      await fetchPosts({
        option: "featured-posts",
        setPosts: setFeaturedPosts,
      });
    } catch (_error) {
      // fetchAllPosts failed - loading state will be cleared
    } finally {
      setLoading(false);
    }
  };

  // Ensure the effect only runs once
  useEffect(() => {
    void fetchAllPosts();
  }, []);

  return (
    <Base
      description=""
      primaryColor={pageConfig.primaryColor}
      secondaryColor={pageConfig.secondaryColor}
      tagline={pageConfig.tagline}
      title="Articles // Shaswat Deep"
    >
      {loading && (
        <div className="flex flex-row mt-10 items-center justify-center ">
          <ArticlesListingSkeleton />
        </div>
      )}
      {!loading && postsCount > 0 && (
        <>
          <p className="text-neutral-500">
            Here you can find all the{" "}
            <span className="text-neutral-200">
              {postsCount} articles and poems
            </span>{" "}
            I wrote. You can read about web development, tech career, personal
            finance, and more in English.
          </p>
          <SimpleBlogWithGrid blogs={featuredPosts} />
          <BlogWithSearch blogs={posts} />
        </>
      )}
      {!loading && postsCount <= 0 && (
        <div className="flex flex-row mt-10 items-start justify-center h-screen-1/2">
          <p className="text-3xl text-red-700">No posts found</p>
        </div>
      )}
    </Base>
  );
}
