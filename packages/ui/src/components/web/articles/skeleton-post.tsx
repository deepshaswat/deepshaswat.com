import React from "react";
import { Skeleton } from "../../ui/skeleton";
import { Card, CardContent } from "../../ui/card";

const PostSkeleton = () => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4 bg-background min-h-screen">
      {/* Title skeleton */}
      <Skeleton className="h-8 sm:h-12 w-full sm:w-3/4 bg-neutral-800/50" />

      {/* Image skeleton */}
      <Card className="w-full bg-neutral-900 border-none">
        <CardContent className="p-0">
          <Skeleton className="h-48 sm:h-56 md:h-64 w-full rounded-lg bg-neutral-800/50" />
        </CardContent>
      </Card>

      {/* Tags skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-5 sm:h-6 w-14 sm:w-16 bg-neutral-800/50" />
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 bg-neutral-800/50" />
      </div>

      {/* Author and date skeleton */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-neutral-800/50" />
        <div className="space-y-1 sm:space-y-2">
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 bg-neutral-800/50" />
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-neutral-800/50" />
        </div>
      </div>

      {/* Poem content skeleton */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1 sm:space-y-2">
          <Skeleton className="h-3 sm:h-4 w-[85%] sm:w-3/4 bg-neutral-800/50" />
          <Skeleton className="h-3 sm:h-4 w-[75%] sm:w-2/3 bg-neutral-800/50" />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Skeleton className="h-3 sm:h-4 w-[80%] sm:w-3/4 bg-neutral-800/50" />
          <Skeleton className="h-3 sm:h-4 w-[70%] sm:w-2/3 bg-neutral-800/50" />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Skeleton className="h-3 sm:h-4 w-[82%] sm:w-3/4 bg-neutral-800/50" />
          <Skeleton className="h-3 sm:h-4 w-[72%] sm:w-2/3 bg-neutral-800/50" />
        </div>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <Skeleton className="h-3 sm:h-4 w-[85%] sm:w-3/4 bg-neutral-800/50" />
        <Skeleton className="h-3 sm:h-4 w-[75%] sm:w-2/3 bg-neutral-800/50" />
      </div>

      <div className="space-y-1 sm:space-y-2">
        <Skeleton className="h-3 sm:h-4 w-[80%] sm:w-3/4 bg-neutral-800/50" />
        <Skeleton className="h-3 sm:h-4 w-[70%] sm:w-2/3 bg-neutral-800/50" />
      </div>

      <div className="space-y-1 sm:space-y-2">
        <Skeleton className="h-3 sm:h-4 w-[82%] sm:w-3/4 bg-neutral-800/50" />
        <Skeleton className="h-3 sm:h-4 w-[72%] sm:w-2/3 bg-neutral-800/50" />
      </div>
    </div>
  );
};

export default PostSkeleton;
