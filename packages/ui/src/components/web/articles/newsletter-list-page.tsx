"use client";

import { useState, useEffect } from "react";
import type { PostListType } from "@repo/actions";
import {
  fetchPublishedPosts,
  fetchPublishedPostsCount,
  getNewslettersCount,
  setNewslettersCount,
  getNewslettersPosts,
  setNewslettersPosts,
} from "@repo/actions";
import { cacheService } from "../index-db";
import { Base } from "../posts/base-static";
import { NewsletterWithSearch } from "./all-newletter-list";
import NewsletterListingSkeleton from "./skeleton-newletter-listing";

const pageConfig = {
  tagline: "Knock Knock. Who's there?",
  primaryColor: "pink" as const,
  secondaryColor: "orange" as const,
};

export function NewsletterListPage() {
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsCount, setPostsCount] = useState(0);

  const fetchPostsCount = async () => {
    try {
      const cachedCount = await cacheService.getCachedCount("newsletters");

      if (cachedCount !== null) {
        setPostsCount(cachedCount);
        return;
      }

      // Check Redis cache
      const redisCachedCount = await getNewslettersCount();

      if (redisCachedCount !== null) {
        setPostsCount(redisCachedCount);
        await cacheService.setCachedCount("newsletters", redisCachedCount);
        return;
      }

      const freshCount = await fetchPublishedPostsCount("newsletters");

      if (typeof freshCount === "number" && freshCount >= 0) {
        setPostsCount(freshCount);
        await setNewslettersCount(freshCount);
        await cacheService.setCachedCount("newsletters", freshCount);
      }
    } catch (_error) {
      // Count fetch failed - will show 0 posts
    }
  };

  const fetchPosts = async () => {
    try {
      const cachedPosts = await cacheService.getCachedItems("newsletters");

      if (cachedPosts && cachedPosts.length > 0) {
        setPosts(cachedPosts);
        return;
      }

      // Check Redis cache
      const redisCachedPosts = await getNewslettersPosts();

      if (redisCachedPosts !== null) {
        setPosts(redisCachedPosts);
        await cacheService.setCachedItems("newsletters", redisCachedPosts);
        return;
      }

      const freshPosts = await fetchPublishedPosts("newsletters");

      if (Array.isArray(freshPosts)) {
        setPosts(freshPosts);
        await setNewslettersPosts(freshPosts);
        await cacheService.setCachedItems("newsletters", freshPosts);
      }
    } catch (_error) {
      // Post fetch failed - posts will remain empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPostsCount();
    void fetchPosts();
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
        <div className="flex flex-row mt-10 items-center justify-center">
          <NewsletterListingSkeleton />
        </div>
      )}
      {!loading && postsCount > 0 && (
        <>
          <p className="text-neutral-500">
            Here you can find all the{" "}
            <span className="text-neutral-200">{postsCount} newsletters</span> I
            send out. I usually write about my entrepreneurship journey,
            personal finance, tech career, and more in English.
          </p>
          <NewsletterWithSearch blogs={posts} />
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
