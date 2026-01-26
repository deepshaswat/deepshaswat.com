"use client";

import { Base } from "../posts/BaseStatic";
import { cacheService } from "../indexDB";
import { useState } from "react";
import { useEffect } from "react";
import { pageNumberState } from "@repo/store";
import {
  fetchPublishedPosts,
  fetchPublishedPostsCount,
  PostListType,
  getArticlesCount,
  setArticlesCount,
  getArticlesPosts,
  setArticlesPosts,
} from "@repo/actions";
import { useRecoilState, useResetRecoilState } from "recoil";
import { PaginationBar } from "../../common/pagination-bar";
import { BlogWithSearch } from "./all-blogs-list";
import { SimpleBlogWithGrid } from "./featured-blogs-grid";
import ArticlesListingSkeleton from "./skeleton-blog-listing";

const pageConfig = {
  tagline: "Failures. Guides. Paths.",
  primaryColor: "cyan" as const,
  secondaryColor: "lime" as const,
};

export const ArticlesListPage = () => {
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useRecoilState(pageNumberState);
  const resetPageNumber = useResetRecoilState(pageNumberState);
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
    } catch (error) {
      console.error("ArticlesListPage: Error in fetchPostsCount:", error);
    }
  };

  const fetchPosts = async ({
    option,
    setPosts,
  }: {
    option: string;
    setPosts: (posts: PostListType[]) => void;
  }) => {
    try {
      const cachedPosts = await cacheService.getCachedItems(
        option as "articles" | "featured-posts",
      );

      if (cachedPosts && cachedPosts.length > 0) {
        setPosts(cachedPosts);
        return;
      }

      // Check Redis cache
      const redisCachedPosts = await getArticlesPosts(option);

      if (redisCachedPosts !== null) {
        setPosts(redisCachedPosts);
        await cacheService.setCachedItems(
          option as "articles" | "featured-posts",
          redisCachedPosts,
        );
        return;
      }

      const freshPosts = await fetchPublishedPosts(option);

      if (Array.isArray(freshPosts) && freshPosts.length > 0) {
        setPosts(freshPosts);
        await setArticlesPosts(option, freshPosts);
        await cacheService.setCachedItems(
          option as "articles" | "featured-posts",
          freshPosts,
        );
      }
    } catch (error) {
      console.error(
        `ArticlesListPage: Error in fetchPosts for ${option}:`,
        error,
      );
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true);

    try {
      await fetchPostsCount();

      await fetchPosts({ option: "articles", setPosts: setPosts });
      await fetchPosts({
        option: "featured-posts",
        setPosts: setFeaturedPosts,
      });
    } catch (error) {
      console.error("Error in fetchAllPosts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure the effect only runs once
  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Base
      title="Articles // Shaswat Deep"
      description=""
      tagline={pageConfig.tagline}
      primaryColor={pageConfig.primaryColor}
      secondaryColor={pageConfig.secondaryColor}
    >
      {loading ? (
        <div className="flex flex-row mt-10 items-center justify-center ">
          {/* <Loader2 className="size-16 animate-spin" /> */}
          <ArticlesListingSkeleton />
        </div>
      ) : postsCount > 0 ? (
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
          {/* ToDo: Enable pagination when a lot of blogs are added and algolia search is added */}
          {/* <PaginationBar
            currentPage={currentPage}
            totalPages={Math.ceil(postsCount / 10)}
            onPageChange={handlePageChange}
          /> */}
        </>
      ) : (
        <div className="flex flex-row mt-10 items-start justify-center h-screen-1/2">
          <p className="text-3xl text-red-700">No posts found</p>
        </div>
      )}
    </Base>
  );
};
