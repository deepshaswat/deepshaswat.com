"use client";

import { Base } from "@repo/ui/web";
import { useState } from "react";
import { useEffect } from "react";
import { pageNumberState } from "@repo/store";
import {
  fetchPublishedPosts,
  fetchPublishedPostsCount,
  PostListType,
} from "@repo/actions";
import { useRecoilState, useResetRecoilState } from "recoil";
import { PaginationBar } from "@repo/ui";
import { BlogWithSearch } from "./all-blogs-list";
import { SimpleBlogWithGrid } from "./featured-blogs-grid";
import { Loader2 } from "lucide-react";
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

  //Caching variables
  const CACHE_KEY = "postsCountCache";
  const CACHE_EXPIRATION_1_DAY = 1000 * 60 * 60 * 24; // 24 hours
  const CACHE_EXPIRATION_1_WEEK = 1000 * 60 * 60 * 24 * 7; // 7 days

  //   useEffect(() => {
  //     resetPageNumber();
  //   }, [resetPageNumber]);

  const fetchPosts = async ({
    option,
    setPosts,
  }: {
    option: string;
    setPosts: (posts: PostListType[]) => void;
  }) => {
    try {
      // const fetchedPosts = await fetchPublishedPostsPaginated(option, currentPage);
      const fetchedPosts = await fetchPublishedPosts(option);
      setPosts(fetchedPosts as PostListType[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchPostsCount = async () => {
    try {
      // Check for cached data
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { count, timestamp } = JSON.parse(cachedData);

        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_EXPIRATION_1_DAY) {
          console.log("Using cached post count");
          setPostsCount(count);
          return;
        } else {
          console.log("Cached post count expired");
        }
      }

      // Fetch fresh data if no valid cache
      console.log("Fetching fresh post count...");
      const fetchedPostsCount = await fetchPublishedPostsCount("articles");
      console.log("Fetched posts count:", fetchedPostsCount);

      // Update the state
      setPostsCount(fetchedPostsCount);

      // Store the data in the cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          count: fetchedPostsCount,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error("Error fetching posts count:", error);
    }
  };

  // ToDo: Enable pagination when a lot of blogs are added and algolia search is added
  //   useEffect(() => {
  //     fetchPosts({ option: "articles", setPosts: setPosts });
  //   }, [currentPage]);

  const fetchAllPosts = async () => {
    setLoading(true);
    await fetchPostsCount();
    await fetchPosts({ option: "articles", setPosts: setPosts });
    await fetchPosts({ option: "featured-posts", setPosts: setFeaturedPosts });
    setLoading(false);
  };

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
