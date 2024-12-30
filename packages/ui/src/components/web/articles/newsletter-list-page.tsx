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
import { NewsletterWithSearch } from "./all-newletter-list";

const pageConfig = {
  tagline: "Knock Knock. Who's there?",
  primaryColor: "pink" as const,
  secondaryColor: "orange" as const,
};

export const NewsletterListPage = () => {
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useRecoilState(pageNumberState);
  const resetPageNumber = useResetRecoilState(pageNumberState);
  const [postsCount, setPostsCount] = useState(0);

  //   useEffect(() => {
  //     resetPageNumber();
  //   }, [resetPageNumber]);

  const fetchPosts = async () => {
    try {
      // const fetchedPosts = await fetchPublishedPostsPaginated(option, currentPage);
      const fetchedPosts = await fetchPublishedPosts("newsletters");

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
      const fetchedPostsCount = await fetchPublishedPostsCount("newsletters");
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
    fetchPosts();
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
            <span className="text-neutral-200">{postsCount} newsletters</span> I
            send out. I usually write about my entrepreneurship journey,
            personal finance, tech career, and more in English.
          </p>
          {/* <SimpleBlogWithGrid blogs={featuredPosts} /> */}
          <NewsletterWithSearch blogs={posts} />
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
