"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { PostListType } from "@repo/actions";
import { cn } from "@repo/ui/utils";

export function SimpleBlogWithGrid({ blogs }: { blogs: PostListType[] }) {
  return (
    <div className="relative overflow-hidden">
      <div className=" overflow-hidden relative ">
        <div className="relative sm:mt-20">
          <h1
            className={cn(
              "scroll-m-20 text-3xl font-bold text-left tracking-tight text-black dark:text-white mb-6",
            )}
          >
            Featured Articles
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between pb-10 max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full relative">
          {blogs.length > 0 ? (
            blogs
              .slice(0, 4)
              .map((blog, index) => (
                <BlogCard blog={blog} key={blog.postUrl + index} />
              ))
          ) : (
            <div className="flex flex-row items-center justify-center text-red-500">
              No Featured Articles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <Link
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative"
      href="/"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm" />
      <span className="font-medium text-black dark:text-white">
        Shaswat Deep
      </span>
    </Link>
  );
}

export function BlogCard({ blog }: { blog: PostListType }) {
  const truncate = (text: string, length: number) => {
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  return (
    <Link
      className="shadow-derek rounded-3xl border dark:border-neutral-800 w-full bg-white dark:bg-neutral-900  overflow-hidden  hover:scale-[1.02] transition duration-200"
      href={`/${blog.postUrl}`}
    >
      {blog.featureImage ? (
        <BlurImage
          alt={blog.title}
          className="h-52 object-cover object-top w-full"
          height="800"
          src={blog.featureImage || ""}
          width="800"
        />
      ) : (
        <div className="h-52 flex items-center justify-center bg-white dark:bg-neutral-900">
          <Logo />
        </div>
      )}
      <div className="p-4 md:p-8 bg-white dark:bg-neutral-900">
        <div className="flex space-x-2 items-center mb-2">
          <Image
            alt={blog.author.name}
            className="rounded-full h-5 w-5"
            height={20}
            src={blog.author.imageUrl || ""}
            width={20}
          />
          <p className="text-sm font-normal text-neutral-600 dark:text-neutral-400">
            {blog.author.name}
          </p>
        </div>
        <p className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-100">
          {blog.title}
        </p>
        <p className="text-left text-sm mt-2 text-neutral-600 dark:text-neutral-400">
          {truncate(blog.excerpt, 100)}
        </p>
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
        "transition duration-300 transform",
        isLoading ? "blur-sm scale-105" : "blur-0 scale-100",
        className,
      )}
      decoding="async"
      height={typeof height === "number" ? height : Number(height)}
      loading="lazy"
      src={src ?? ""}
      width={typeof width === "number" ? width : Number(width)}
      {...rest}
      onLoad={() => {
        setLoading(false);
      }}
    />
  );
}
