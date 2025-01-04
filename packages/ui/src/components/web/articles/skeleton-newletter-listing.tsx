import React from "react";
import { Skeleton } from "@repo/ui";
import { Card, CardContent } from "@repo/ui";

const NewsletterListingSkeleton = () => {
  return (
    <div className='w-full  max-w-4xl mx-auto space-y-8 sm:space-y-12 p-2 sm:p-4 bg-background '>
      {/* Header */}
      <div className='space-y-2'>
        <div className='text-neutral-500'>
          <span>Here you can find all the </span>
          <Skeleton className='inline-block h-4 w-12 bg-neutral-200/50' />
          <span> newsletters</span>
        </div>
        <span className='text-neutral-500'>
          {" "}
          I usually write about my entrepreneurship journey, personal finance,
          tech career, and more in English.
        </span>
      </div>

      {/* Featured Articles Section */}
      <section className='space-y-4'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-semibold items-center justify-center flex'>
          Most Recent
        </h1>
        <Card className='w-full overflow-hidden bg-neutral-900/50 border-none'>
          <CardContent className='p-0'>
            <div className='flex flex-col sm:flex-row'>
              {/* Left side image */}
              <div className='w-full sm:w-[45%] relative rounded-md'>
                <Skeleton className='aspect-square sm:aspect-[4/3] w-full h-full bg-neutral-800/50' />
              </div>

              {/* Right side content */}
              <div className='flex-1 p-4 sm:p-6 space-y-4'>
                {/* Title */}
                <div className='space-y-2'>
                  <Skeleton className='h-6 sm:h-8 w-4/5 bg-neutral-800/50' />
                  <Skeleton className='h-6 sm:h-8 w-2/3 bg-neutral-800/50' />
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full bg-neutral-800/50' />
                  <Skeleton className='h-4 w-[90%] bg-neutral-800/50' />
                  <Skeleton className='h-4 w-[85%] bg-neutral-800/50' />
                </div>

                {/* Author and date */}
                <div className='flex items-center space-x-3 pt-2'>
                  <Skeleton className='h-8 w-8 rounded-full bg-neutral-800/50' />
                  <Skeleton className='h-4 w-24 bg-neutral-800/50' />
                  <Skeleton className='h-4 w-32 bg-neutral-800/50' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* All Articles Section */}
      <section className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-semibold'>More Newsletters</h2>
          <Skeleton className='h-10 w-64 bg-neutral-800/50 rounded-md' />
        </div>

        {/* Article List */}
        <div className='space-y-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-lg hover:bg-neutral-800/20'
            >
              <div className='space-y-2 flex-1'>
                <Skeleton className='h-6 w-3/4 bg-neutral-800/50' />
                <Skeleton className='h-4 w-full bg-neutral-800/50' />
                <div className='flex items-center space-x-4 pt-2'>
                  <Skeleton className='h-4 w-24 bg-neutral-800/50' />
                  <div className='flex space-x-2'>
                    <Skeleton className='h-6 w-16 bg-neutral-800/50 rounded-full' />
                    <Skeleton className='h-6 w-20 bg-neutral-800/50 rounded-full' />
                  </div>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Skeleton className='h-8 w-8 rounded-full bg-neutral-800/50' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewsletterListingSkeleton;
