"use client";

import { useState } from "react";
import Link from "next/link";
import {
  fetchAllPosts,
  fetchAllTagsWithPostCount,
  PostListType,
  TagOnPost,
} from "@repo/actions";
import { useEffect } from "react";

import { Button, Label, Separator } from "@repo/ui";

import PostFilterNavbar from "./post-filter-navbar";
import PostsTableRender from "./posts-table-render";

const PostsComponent = () => {
  const [postOption, setPostOption] = useState("all-posts");
  const [tagOption, setTagOption] = useState("");

  const [tags, setTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await fetchAllTagsWithPostCount();
      setTags(fetchedTags.map((tag) => tag.slug));
    };

    fetchTags();
  }, []);

  const fetchPosts = async (postOption: string, tagOption: string) => {
    try {
      setLoading(true);
      const fetchedPosts = await fetchAllPosts(postOption, tagOption);
      console.log(fetchedPosts);
      setPosts(fetchedPosts as PostListType[]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(postOption, tagOption);
  }, [postOption, tagOption]);

  const handleSelectPostOption = (item: string) => {
    setPostOption(item);
  };

  const handleSelectTagOption = (item: string) => {
    setTagOption(item);
  };

  return (
    <div className="m-8 ml-0 lg:ml-[156px] lg:mr-[156px] ">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center ">
        <div className="flex flex-row items-center justify-between w-full lg:w-auto mb-4 lg:mb-0 ">
          <Label htmlFor="" className="text-3xl font-semibold">
            Posts
          </Label>
          <div className="flex flex-row gap-20  justify-start ">
            <div className="flex flex-row items-center space-x-8  ml-10 max-w-0 lg:max-w-full overflow-hidden text-neutral-200 font-light text-[10px] md:text-[12px]">
              <PostFilterNavbar
                onSelectPostOption={handleSelectPostOption}
                postOption={postOption}
                postFilter={allPosts}
                tags={tags}
                onSelectTagOption={handleSelectTagOption}
                tagOption={tagOption}
              />
            </div>
            <Link href="/new-post" className="items-center">
              <Button
                variant="secondary"
                className="rounded-sm items-center"
                size={"sm"}
              >
                New post
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-4 ml-0 md:ml-14 mr-4 flex flex-row items-center justify-end space-x-8 overflow-hidden max-w-full lg:invisible font-light text-[11px] md:text-[12px] text-neutral-200">
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

      <Separator className="bg-neutral-600 h-[1px]" />
      <PostsTableRender posts={posts} />
    </div>
  );
};

export default PostsComponent;
