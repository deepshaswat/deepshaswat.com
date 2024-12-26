"use client";

import { cn } from "@repo/ui/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FuzzySearch from "fuzzy-search";
import { fetchTagsFromTagOnPost, PostListType, Tags } from "@repo/actions";
import { AnimatePresence, motion } from "framer-motion";

export function BlogWithSearch({ blogs }: { blogs: PostListType[] }) {
  return (
    <div className='relative overflow-hidden'>
      <div className='max-w-7xl mx-auto flex flex-col items-center justify-between pb-20'>
        <BlogPostRows blogs={blogs} />
      </div>
    </div>
  );
}

export const BlogPostRows = ({ blogs }: { blogs: PostListType[] }) => {
  const [search, setSearch] = useState("");

  const searcher = new FuzzySearch(blogs, ["title", "excerpt"], {
    caseSensitive: false,
  });

  const [results, setResults] = useState(blogs);
  useEffect(() => {
    const results = searcher.search(search);
    setResults(results);
  }, [search]);
  return (
    <div className='w-full py-20'>
      {/* <p className='text-3xl font-bold mb-10'>All Articles</p> */}
      <div className='flex md:flex-row flex-col justify-between gap-4 md:items-center mb-4'>
        <p className='text-3xl font-bold sm:w-1/3'>All Articles</p>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search articles'
          className='text-sm w-full sm:min-w-96 border dark:border-transparent border-yellow-200 p-2 rounded-md dark:bg-neutral-800 bg-white shadow-sm focus:border-yellow-400 focus:ring-0 focus:outline-none outline-none text-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-400 placeholder:neutral-700'
        />
      </div>

      <div className=''>
        {results.length === 0 ? (
          <p className='text-neutral-400 text-center p-4'>No results found</p>
        ) : (
          results.map((blog, index) => (
            <BlogPostRow blog={blog} key={blog.postUrl + index} />
          ))
        )}
      </div>
    </div>
  );
};

export const BlogPostRow = ({ blog }: { blog: PostListType }) => {
  const [tags, setTags] = useState<Tags[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const capitalizeFirstLetter = (item: string) => {
    return item
      .split("-")
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word.toLowerCase()
      )
      .join(" ");
  };
  const fetchTags = async () => {
    const tagList = await fetchTagsFromTagOnPost({ postId: blog.id });
    setTags(
      tagList.map(({ tag }) => ({
        id: tag.id,
        slug: tag.slug,
        description: tag.description ?? "",
        imageUrl: tag.imageUrl ?? "",
        posts: tag.posts,
      }))
    );
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <Link
      href={`/${blog.postUrl}`}
      key={`${blog.postUrl}`}
      className='relative block'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className='absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-lg'
            layoutId='hoverBackground'
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <div className='flex md:flex-row flex-col items-start justify-between md:items-center group/blog-row py-4 px-4 relative z-10 '>
        <div>
          <p className='text-neutral-100 text-lg font-medium transition duration-200'>
            {blog.title}
          </p>
          {blog.excerpt && (
            <p className='text-neutral-400 text-sm mt-2 max-w-xl transition duration-200'>
              {truncate(blog.excerpt, 80)}
            </p>
          )}

          <div className='flex flex-col sm:flex-row-reverse gap-2 justify-between'>
            {
              <div className='flex flex-wrap gap-2 my-2 sm:my-4'>
                {tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className='px-2 py-1 text-xs font-medium bg-neutral-200 text-neutral-800 rounded-md'
                  >
                    {capitalizeFirstLetter(tag.slug)}
                  </span>
                ))}
              </div>
            }

            <div className='flex gap-2 items-center my-2 sm:my-4'>
              <p className='text-neutral-400 text-xs max-w-xl transition duration-200'>
                {blog.publishDate
                  ? format(new Date(blog.publishDate), "MMMM dd, yyyy")
                  : ""}
              </p>
            </div>
          </div>
        </div>
        <Image
          src={blog.author.imageUrl}
          alt={blog.author.name}
          width={40}
          height={40}
          className='rounded-full md:h-10 md:w-10 h-6 w-6 mt-2 md:mt-0 object-cover'
        />
      </div>
    </Link>
  );
};

export const truncate = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
