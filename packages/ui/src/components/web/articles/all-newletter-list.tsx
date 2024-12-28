"use client";

import { cn } from "@repo/ui/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FuzzySearch from "fuzzy-search";
import { fetchTagsFromTagOnPost, PostListType, Tags } from "@repo/actions";
import { AnimatePresence, motion } from "framer-motion";

export function NewsletterWithSearch({ blogs }: { blogs: PostListType[] }) {
  return (
    <div className='relative overflow-hidden'>
      <div className='max-w-7xl mx-auto flex flex-col items-center justify-between pb-20'>
        <div className='relative z-20 py-10 '>
          <h1 className='mt-4 text-xl  font-bold md:text-3xl lg:text-5xl text-black dark:text-white tracking-tight'>
            Most Recent
          </h1>
        </div>

        {blogs.slice(0, 1).map((blog, index) => (
          <NewsletterCard blog={blog} key={blog.title + index} />
        ))}
        <NewsletterPostRows blogs={blogs} />
      </div>
    </div>
  );
}

export const NewsletterPostRows = ({ blogs }: { blogs: PostListType[] }) => {
  const [search, setSearch] = useState("");

  const searcher = new FuzzySearch(blogs, ["title", "excerpt", "keywords"], {
    caseSensitive: false,
  });

  const [results, setResults] = useState(blogs);
  useEffect(() => {
    const results = searcher.search(search);
    setResults(results);
  }, [search]);
  return (
    <div className='w-full py-20'>
      <div className='flex md:flex-row flex-col justify-between gap-4 md:items-center mb-4'>
        <p className='text-3xl font-bold md:w-2/5'>More Newsletters</p>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search newsletters'
          className='text-sm w-full md:w-3/5 border dark:border-transparent border-yellow-200 p-2 rounded-md dark:bg-neutral-800 bg-white shadow-sm focus:border-yellow-400 focus:ring-0 focus:outline-none outline-none text-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-400 placeholder:neutral-700'
        />
      </div>

      <div className=''>
        {results.length === 0 ? (
          <p className='text-neutral-400 text-center p-4'>No results found</p>
        ) : (
          results.map((blog, index) => (
            <NewsletterPostRow blog={blog} key={blog.postUrl + index} />
          ))
        )}
      </div>
    </div>
  );
};

export const NewsletterPostRow = ({ blog }: { blog: PostListType }) => {
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

const Logo = () => {
  return (
    <Link
      href='/'
      className='font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20'
    >
      <div className='h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm' />
      <span className='font-medium text-black dark:text-white'>
        Shaswat Deep
      </span>
    </Link>
  );
};

export const NewsletterCard = ({ blog }: { blog: PostListType }) => {
  return (
    <Link
      className='shadow-derek grid grid-cols-1 md:grid-cols-2  rounded-3xl group/blog border border-transparent dark:hover:border-neutral-800 w-full dark:hover:bg-neutral-900 hover:border-neutral-200 hover:bg-neutral-100  overflow-hidden  hover:scale-[1.02] transition duration-200'
      href={`/${blog.postUrl}`}
    >
      <div className=''>
        {blog.featureImage ? (
          <BlurImage
            src={blog.featureImage || ""}
            alt={blog.title}
            height='800'
            width='800'
            className='h-full max-h-96 object-cover object-top w-full rounded-3xl'
          />
        ) : (
          <div className='h-full flex items-center justify-center dark:group-hover/blog:bg-neutral-900 group-hover/blog:bg-neutral-100'>
            <Logo />
          </div>
        )}
      </div>
      <div className='p-4 md:p-8 dark:group-hover/blog:bg-neutral-900 group-hover/blog:bg-neutral-100 flex flex-col justify-between'>
        <div>
          <p className='text-lg md:text-4xl font-bold mb-4 text-neutral-800 dark:text-neutral-100'>
            {blog.title}
          </p>
          <p className='text-left text-base md:text-xl mt-2 text-neutral-600 dark:text-neutral-400'>
            {truncate(blog.excerpt, 500)}
          </p>
        </div>
        <div className='flex space-x-2 items-center  mt-6'>
          <Image
            src={blog.author.imageUrl}
            alt={blog.author.name}
            width={20}
            height={20}
            className='rounded-full h-5 w-5'
          />
          <p className='text-sm font-normal text-black dark:text-white'>
            {blog.author.name}
          </p>
          <div className='h-1 w-1 bg-neutral-300 rounded-full'></div>
          <p className='text-neutral-600 dark:text-neutral-300 text-sm  max-w-xl  transition duration-200'>
            {blog.publishDate
              ? format(new Date(blog.publishDate), "MMMM dd, yyyy")
              : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};

interface IBlurImage {
  height?: any;
  width?: any;
  src?: string | any;
  objectFit?: any;
  className?: string | any;
  alt?: string | undefined;
  layout?: any;
  [x: string]: any;
}

export const BlurImage = ({
  height,
  width,
  src,
  className,
  objectFit,
  alt,
  layout,
  ...rest
}: IBlurImage) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading='lazy'
      decoding='async'
      blurDataURL={src}
      layout={layout}
      alt={alt ? alt : "Avatar"}
      {...rest}
    />
  );
};

export const truncate = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
