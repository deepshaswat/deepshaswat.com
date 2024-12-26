"use client";

import { useState } from "react";
import Link from "next/link";
import {
  fetchAllPosts,
  fetchAllPostsCount,
  fetchAllTagsWithPostCount,
  PostListType,
} from "@repo/actions";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button, Label, Separator } from "@repo/ui";

import PostFilterNavbar from "./post-filter-navbar";
import PostsTableRender from "./posts-table-render";
import { PaginationBar } from "./pagination-bar";
import { pageNumberState } from "@repo/store";
import { useRecoilState, useResetRecoilState } from "recoil";

const PostsComponent = () => {
  const [postOption, setPostOption] = useState("all-posts");
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
    const fetchTags = async () => {
      const fetchedTags = await fetchAllTagsWithPostCount();
      setTags(fetchedTags.map((tag) => tag.slug));
    };

    fetchTags();
  }, []);

  const fetchPosts = async (postOption: string, tagOption: string) => {
    try {
      const fetchedPosts = await fetchAllPosts(
        postOption,
        tagOption,
        currentPage
      );
      setPosts(fetchedPosts as PostListType[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsCount = async (postOption: string, tagOption: string) => {
    try {
      setLoading(true);
      const fetchedPostsCount = await fetchAllPostsCount(postOption, tagOption);
      setPostsCount(fetchedPostsCount);
    } catch (error) {
      console.error("Error fetching posts count:", error);
    }
  };

  useEffect(() => {
    fetchPostsCount(postOption, tagOption);
    fetchPosts(postOption, tagOption);
  }, [postOption, tagOption, currentPage]);

  const handleSelectPostOption = (item: string) => {
    setPostOption(item);
  };

  const handleSelectTagOption = (item: string) => {
    setTagOption(item);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='m-8 ml-10 lg:ml-[156px] lg:mr-[156px]'>
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center  '>
        <div className='flex items-center justify-between w-full mb-4 lg:mb-0 '>
          <Label
            htmlFor=''
            className='text-3xl lg:text-4xl font-semibold lg:ml-10'
          >
            Posts
          </Label>

          <div className='flex flex-row gap-20 justify-end items-center '>
            <div className='flex flex-row items-center space-x-8  ml-10 max-w-0 lg:max-w-full overflow-hidden text-neutral-200 font-light text-[10px] md:text-[12px] '>
              <PostFilterNavbar
                onSelectPostOption={handleSelectPostOption}
                postOption={postOption}
                postFilter={allPosts}
                tags={tags}
                onSelectTagOption={handleSelectTagOption}
                tagOption={tagOption}
              />
            </div>
            <Link href='/new-post' className='items-center'>
              <Button
                variant='default'
                className='rounded-sm items-center'
                size={"sm"}
              >
                New post
              </Button>
            </Link>
          </div>
        </div>

        <div className='mt-4 ml-0 md:ml-14 mr-4 flex flex-row items-center justify-end space-x-8 overflow-hidden max-w-full lg:invisible font-light text-[11px] md:text-[12px] text-neutral-200 '>
          <PostFilterNavbar
            onSelectPostOption={handleSelectPostOption}
            postOption={postOption}
            tags={tags}
            onSelectTagOption={handleSelectTagOption}
            tagOption={tagOption}
            postFilter={allPosts}
          />
        </div>
      </div>

      <Separator className='bg-neutral-600 h-[1px] mb-4' />
      {loading ? (
        <div className='flex flex-row items-center justify-center h-screen-1/2'>
          <Loader2 className='size-10 animate-spin' />
        </div>
      ) : (
        <PostsTableRender posts={posts} />
      )}
      {loading ? (
        <> </>
      ) : postsCount > 0 ? (
        <PaginationBar
          currentPage={currentPage}
          totalPages={Math.ceil(postsCount / 10)}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className='flex flex-row mt-10 items-start justify-center h-screen-1/2'>
          <p className='text-3xl text-red-700'>No posts found</p>
        </div>
      )}
    </div>
  );
};

export default PostsComponent;
