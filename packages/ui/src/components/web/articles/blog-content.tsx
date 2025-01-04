"use client";

import { format } from "date-fns";
import Image from "next/image";

import {
  fetchPostByPostUrl,
  fetchTagsFromTagOnPost,
  PostListType,
  Tags,
} from "@repo/actions";
import BlockNoteRenderer from "./blocknote-render";
import { Base } from "../posts/base-static";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import PostSkeleton from "./skeleton-post";

const LIGHT_COLORS = ["yellow", "pink", "turquoise", "lime", "teal", "cyan"];

const DARK_COLORS = [
  "blue",
  "green",
  "purple",
  "orange",
  "red",
  "fuchsia",
  "violet",
];

type ColorType = (typeof LIGHT_COLORS | typeof DARK_COLORS)[number];

export function BlogContent({ params }: { params: { postUrl: string } }) {
  const [post, setPost] = useState<PostListType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tagline, setTagline] = useState("");

  const [tags, setTags] = useState<Tags[]>([]);
  const [primaryColor, setPrimaryColor] = useState<ColorType>("yellow");
  const [secondaryColor, setSecondaryColor] = useState<ColorType>("pink");

  const getRandomColor = (colors: ColorType[]) => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const generateRandomColors = () => {
    const primary = getRandomColor(LIGHT_COLORS); // Choose from light colors
    const secondary = getRandomColor(DARK_COLORS); // Choose from dark colors

    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  };

  const pageConfig = {
    tagline: tagline,
    primaryColor,
    secondaryColor,
  };

  const capitalizeFirstLetter = (item: string) => {
    return item
      .split("-")
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word.toLowerCase(),
      )
      .join(" ");
  };

  const getPost = async () => {
    const postData = await fetchPostByPostUrl(params.postUrl);
    setPost(postData as PostListType);
    if (postData?.id) {
      const tagList = await fetchTagsFromTagOnPost({ postId: postData.id });
      setTags(
        tagList.map(({ tag }) => ({
          id: tag.id,
          slug: tag.slug,
          description: tag.description ?? "",
          imageUrl: tag.imageUrl ?? "",
          posts: tag.posts,
        })),
      );
    }
    setTagline(postData?.title || "Failures. Guides. Paths.");
    generateRandomColors();
    setIsLoading(false);
  };
  useEffect(() => {
    getPost();
  }, []);

  if (!post) {
    return null;
  }
  return (
    <>
      {isLoading ? (
        <div className="flex flex-row mt-10 items-center justify-center h-screen">
          {/* <Loader2 className="size-16 animate-spin" /> */}
          <PostSkeleton />
        </div>
      ) : (
        <Base
          title={`${post?.title} // Shaswat Deep`}
          description={""}
          tagline={tagline}
          primaryColor={pageConfig.primaryColor}
          secondaryColor={pageConfig.secondaryColor}
        >
          <div className="w-full px-1 sm:px-4 md:px-8">
            {post?.featureImage && (
              <Image
                src={post?.featureImage || ""}
                alt={post?.title || ""}
                className="mb-5 h-60 md:h-full w-full rounded-3xl object-cover "
                height={720}
                width={1024}
              />
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-between mb-2 sm:mb-4">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2 sm:my-4">
                  {tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-2 py-1 text-xs font-medium bg-neutral-200 text-neutral-800 rounded-md"
                    >
                      {capitalizeFirstLetter(tag.slug)}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-y-2 sm:gap-y-0 ">
              <div className="flex flex-row items-center ">
                <Image
                  src={post?.author?.imageUrl || ""}
                  alt={post?.author?.name || ""}
                  className="h-5 w-5 rounded-full"
                  height={20}
                  width={20}
                />
                <p className="pl-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {post?.author?.name || ""}
                </p>
              </div>
              <div className="hidden sm:block mx-2 h-1 w-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <p className="pl-0 sm:pl-1 text-sm text-neutral-600 dark:text-neutral-400">
                {post?.publishDate
                  ? format(new Date(post?.publishDate), "MMMM dd, yyyy")
                  : ""}
              </p>
            </div>

            <div className="mt-10 ">
              <BlockNoteRenderer content={post.content} />
            </div>
          </div>
        </Base>
      )}
    </>
  );
}
