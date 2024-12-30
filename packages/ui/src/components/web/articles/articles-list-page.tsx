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

const pageConfig = {
  tagline: "Failures. Guides. Paths.",
  primaryColor: "cyan" as const,
  secondaryColor: "lime" as const,
};

export const ArticlesListPage = () => {
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useRecoilState(pageNumberState);
  const resetPageNumber = useResetRecoilState(pageNumberState);
  const [postsCount, setPostsCount] = useState(0);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsCount = async () => {
    try {
      setLoading(true);
      const fetchedPostsCount = await fetchPublishedPostsCount("articles");
      setPostsCount(fetchedPostsCount);
    } catch (error) {
      console.error("Error fetching posts count:", error);
    }
  };

  // ToDo: Enable pagination when a lot of blogs are added and algolia search is added
  //   useEffect(() => {
  //     fetchPosts({ option: "articles", setPosts: setPosts });
  //   }, [currentPage]);

  useEffect(() => {
    fetchPostsCount();
    fetchPosts({ option: "articles", setPosts: setPosts });
    fetchPosts({ option: "featured-posts", setPosts: setFeaturedPosts });
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
        <div className="flex flex-row mt-10 items-center justify-center h-screen">
          <Loader2 className="size-16 animate-spin" />
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
