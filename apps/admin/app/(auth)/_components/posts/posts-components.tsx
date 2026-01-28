"use client";

import type { PostListType } from "@repo/actions";
import {
  fetchAllPosts,
  fetchAllPostsCount,
  fetchAllTagsWithPostCount,
} from "@repo/actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Button, Separator, PaginationBar } from "@repo/ui";
import { pageNumberState } from "@repo/store";
import PostFilterNavbar from "./post-filter-navbar";
import PostsTableRender from "./posts-table-render";

interface PostsComponentProps {
  defaultFilter?: string;
}

function PostsComponent({
  defaultFilter = "all-posts",
}: PostsComponentProps): JSX.Element {
  const [postOption, setPostOption] = useState(defaultFilter);
  const [tagOption, setTagOption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useRecoilState(pageNumberState);
  const resetPageNumber = useResetRecoilState(pageNumberState);

  useEffect(() => {
    resetPageNumber();
  }, [resetPageNumber, postOption, tagOption]);

  const allPosts = [
    "all-posts",
    "draft-posts",
    "published-posts",
    "scheduled-posts",
    "featured-posts",
    "newsletters",
    "archived-posts",
    "deleted-posts",
  ];

  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    const fetchTags = async (): Promise<void> => {
      const fetchedTags = await fetchAllTagsWithPostCount();
      setTags(fetchedTags.map((tag) => tag.slug));
    };

    void fetchTags();
  }, []);

  const fetchPosts = useCallback(
    async (postOpt: string, tagOpt: string): Promise<void> => {
      try {
        const fetchedPosts = await fetchAllPosts(postOpt, tagOpt, currentPage);

        setPosts(fetchedPosts);
      } catch {
        // Error fetching posts
      } finally {
        setLoading(false);
      }
    },
    [currentPage],
  );

  const fetchPostsCount = useCallback(
    async (postOpt: string, tagOpt: string): Promise<void> => {
      try {
        setLoading(true);
        const fetchedPostsCount = await fetchAllPostsCount(postOpt, tagOpt);
        setPostsCount(fetchedPostsCount);
      } catch {
        // Error fetching posts count
      }
    },
    [],
  );

  useEffect(() => {
    void fetchPostsCount(postOption, tagOption);
    void fetchPosts(postOption, tagOption);
  }, [postOption, tagOption, currentPage, fetchPosts, fetchPostsCount]);

  const handleSelectPostOption = (item: string): void => {
    setPostOption(item);
  };

  const handleSelectTagOption = (item: string): void => {
    setTagOption(item);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <div className="m-8 ml-10 lg:ml-[80px] lg:mr-[80px]">
      <div className="flex items-center justify-between w-full mb-4">
        {/* Filters on the left */}
        <div className="flex flex-row items-center space-x-4 text-foreground font-light text-[11px] md:text-[12px]">
          <PostFilterNavbar
            onSelectPostOption={handleSelectPostOption}
            onSelectTagOption={handleSelectTagOption}
            postFilter={allPosts}
            postOption={postOption}
            tagOption={tagOption}
            tags={tags}
          />
        </div>

        {/* New post button on the right */}
        <Link className="items-center" href="/new-post">
          <Button
            className="rounded-sm items-center"
            size="sm"
            variant="default"
          >
            New post
          </Button>
        </Link>
      </div>

      <Separator className="bg-border h-[1px] mb-4" />
      {loading ? (
        <div className="flex flex-row items-center justify-center h-screen-1/2">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <PostsTableRender posts={posts} />
      )}
      {loading ? <> </> : null}
      {!loading && postsCount > 0 ? (
        <PaginationBar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={Math.ceil(postsCount / 10)}
        />
      ) : null}
      {!loading && postsCount === 0 ? (
        <div className="flex flex-row mt-10 items-start justify-center h-screen-1/2">
          <p className="text-3xl text-red-700">No posts found</p>
        </div>
      ) : null}
    </div>
  );
}

export default PostsComponent;
