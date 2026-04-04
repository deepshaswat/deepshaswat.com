"use client";

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FuzzySearch from "fuzzy-search";
import type { PostListType, Tags } from "@repo/actions";
import { fetchAllTagsFromTagOnPost } from "@repo/actions";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@repo/ui/utils";

export function NewsletterWithSearch({ blogs }: { blogs: PostListType[] }) {
  const [allTags, setAllTags] = useState<Partial<Record<string, Tags[]>>>({});

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const allTagsData = await fetchAllTagsFromTagOnPost();
        const tagsByPost: Record<string, Tags[]> = {};

        allTagsData.forEach((tagOnPost) => {
          const existing: Tags[] = tagsByPost[tagOnPost.postId] ?? [];
          existing.push({
            id: tagOnPost.tag.id,
            slug: tagOnPost.tag.slug,
            description: tagOnPost.tag.description ?? "",
            imageUrl: tagOnPost.tag.imageUrl ?? "",
            posts: [],
          });
          tagsByPost[tagOnPost.postId] = existing;
        });

        setAllTags(tagsByPost);
      } catch (_error) {
        // Tag fetching failed silently - tags will remain empty
      }
    };

    void fetchAllTags();
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between pb-20">
        <div className="relative py-10 ">
          <h1 className="mt-4 text-xl font-bold md:text-3xl lg:text-5xl text-black dark:text-white tracking-tight">
            Most Recent
          </h1>
        </div>

        {blogs.slice(0, 1).map((blog, index) => (
          <NewsletterCard
            blog={blog}
            key={blog.title + index}
            tags={allTags[blog.id] ?? []}
          />
        ))}
        <NewsletterPostRows allTags={allTags} blogs={blogs} />
      </div>
    </div>
  );
}

export function NewsletterPostRows({
  blogs,
  allTags,
}: {
  blogs: PostListType[];
  allTags: Partial<Record<string, Tags[]>>;
}) {
  const [search, setSearch] = useState("");

  const searcher = new FuzzySearch(blogs, ["title", "excerpt", "keywords"], {
    caseSensitive: false,
  });

  const [results, setResults] = useState(blogs);
  useEffect(() => {
    const searchResults = searcher.search(search);
    setResults(searchResults);
  }, [search]);
  return (
    <div className="w-full py-20">
      <div className="flex md:flex-row flex-col justify-between gap-4 md:items-center mb-4">
        <p className="text-3xl font-bold md:w-2/5">More Newsletters</p>
        <input
          className="text-sm w-full md:w-3/5 border dark:border-transparent border-yellow-200 p-2 rounded-md dark:bg-neutral-800 bg-white shadow-sm focus:border-yellow-400 focus:ring-0 focus:outline-none outline-none text-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-400 placeholder:neutral-700"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search newsletters"
          type="text"
          value={search}
        />
      </div>

      <div className="">
        {results.length <= 1 ? (
          <p className="text-neutral-400 text-center p-4">No results found</p>
        ) : (
          results
            .slice(1)
            .map((blog, index) => (
              <NewsletterPostRow
                blog={blog}
                key={blog.postUrl + index}
                tags={allTags[blog.id] ?? []}
              />
            ))
        )}
      </div>
    </div>
  );
}

export function NewsletterPostRow({
  blog,
  tags,
}: {
  blog: PostListType;
  tags: Tags[];
}) {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <Link
      className="relative block"
      href={`/${blog.postUrl}`}
      key={blog.postUrl}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <AnimatePresence>
        {isHovered ? (
          <motion.span
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-lg"
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
            initial={{ opacity: 0 }}
            layoutId="hoverBackground"
          />
        ) : null}
      </AnimatePresence>
      <div className="flex md:flex-row flex-col items-start justify-between md:items-center group/blog-row py-4 px-4 relative ">
        <div>
          <p className="text-neutral-100 text-lg font-medium transition duration-200">
            {blog.title}
          </p>
          {blog.excerpt ? (
            <p className="text-neutral-400 text-sm mt-2 max-w-xl transition duration-200">
              {truncate(blog.excerpt, 100)}
            </p>
          ) : null}

          <div className="flex flex-col sm:flex-row-reverse gap-2 justify-between">
            <div className="flex flex-wrap gap-2 my-2 sm:my-4">
              {tags.map((tag) => (
                <span
                  className="px-2 py-1 text-xs font-medium bg-neutral-200 text-neutral-800 rounded-md"
                  key={tag.id}
                >
                  {capitalizeFirstLetter(tag.slug)}
                </span>
              ))}
            </div>

            <div className="flex gap-2 items-center my-2 sm:my-4">
              <p className="text-neutral-400 text-xs max-w-xl transition duration-200">
                {blog.publishDate
                  ? format(new Date(blog.publishDate), "MMMM dd, yyyy")
                  : ""}
              </p>
            </div>
          </div>
        </div>
        <Image
          alt={blog.author.name}
          className="rounded-full md:h-10 md:w-10 h-6 w-6 mt-2 md:mt-0 object-cover"
          height={40}
          src={blog.author.imageUrl}
          width={40}
        />
      </div>
    </Link>
  );
}

function Logo() {
  return (
    <Link
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative "
      href="/"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm" />
      <span className="font-medium text-black dark:text-white">
        Shaswat Deep
      </span>
    </Link>
  );
}

export function NewsletterCard({
  blog,
  tags,
}: {
  blog: PostListType;
  tags: Tags[];
}) {
  const truncate = (text: string, length: number) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
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

  return (
    <Link
      className="shadow-derek grid grid-cols-1 md:grid-cols-2  rounded-3xl group/blog border border-transparent dark:hover:border-neutral-800 w-full dark:hover:bg-neutral-900 hover:border-neutral-200 hover:bg-neutral-100  overflow-hidden  hover:scale-[1.02] transition duration-200"
      href={`/${blog.postUrl}`}
    >
      <div className="">
        {blog.featureImage ? (
          <BlurImage
            alt={blog.title}
            className="h-full max-h-96 object-cover object-top w-full rounded-3xl"
            height="800"
            src={blog.featureImage || ""}
            width="800"
          />
        ) : (
          <div className="h-full flex items-center justify-center dark:group-hover/blog:bg-neutral-900 group-hover/blog:bg-neutral-100">
            <Logo />
          </div>
        )}
      </div>
      <div className="p-4 md:p-8 dark:group-hover/blog:bg-neutral-900 group-hover/blog:bg-neutral-100 flex flex-col justify-between">
        <div>
          <p className="text-lg md:text-4xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
            {blog.title}
          </p>
          <p className="text-left text-base md:text-xl mt-2 text-neutral-600 dark:text-neutral-400">
            {truncate(blog.excerpt, 500)}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                className="px-2 py-1 text-xs font-medium bg-neutral-200 text-neutral-800 rounded-md"
                key={tag.id}
              >
                {capitalizeFirstLetter(tag.slug)}
              </span>
            ))}
          </div>
        </div>
        <div className="flex space-x-2 items-center mt-6">
          <Image
            alt={blog.author.name}
            className="rounded-full h-5 w-5"
            height={20}
            src={blog.author.imageUrl}
            width={20}
          />
          <p className="text-sm font-normal text-black dark:text-white">
            {blog.author.name}
          </p>
          <div className="h-1 w-1 bg-neutral-300 rounded-full" />
          <p className="text-neutral-600 dark:text-neutral-300 text-sm max-w-xl transition duration-200">
            {blog.publishDate
              ? format(new Date(blog.publishDate), "MMMM dd, yyyy")
              : ""}
          </p>
        </div>
      </div>
    </Link>
  );
}

interface BlurImageProps {
  height?: string | number;
  width?: string | number;
  src?: string;
  className?: string;
  alt?: string;
  [x: string]: unknown;
}

export function BlurImage({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      alt={alt ?? "Avatar"}
      blurDataURL={src}
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      decoding="async"
      height={typeof height === "number" ? height : Number(height)}
      loading="lazy"
      onLoad={() => {
        setLoading(false);
      }}
      src={src ?? ""}
      width={typeof width === "number" ? width : Number(width)}
      {...rest}
    />
  );
}

export const truncate = (text: string, length: number) => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};
