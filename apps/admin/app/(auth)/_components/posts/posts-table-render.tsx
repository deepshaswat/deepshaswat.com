"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import { Button, Table, TableBody, TableCell, TableRow } from "@repo/ui";
import { useRouter } from "next/navigation";
import { PostListType } from "@repo/actions";

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

interface PostsTableRenderProps {
  posts: PostListType[];
}

const PostsTableRender = ({ posts }: PostsTableRenderProps) => {
  const router = useRouter();

  const getStatusBadge = (status: string, post: PostListType) => {
    const baseClasses = "text-sm font-medium";
    if (post.isNewsletter && post.status === "PUBLISHED") {
      return (
        <div className="flex items-center gap-2">
          <span className={`${baseClasses} text-green-600`}>
            Published and Sent
          </span>
          <span className="text-[10px] text-neutral-400">
            at{" "}
            {post.publishDate
              ? new Date(post.publishDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </span>
          <div className="flex items-center text-xs text-neutral-400">
            {/* <span className='mr-4'>{post.openRate || "71"}% opened</span>
              <span>{post.clickRate || "4"}% clicked</span> */}
          </div>
        </div>
      );
    } else if (post.isNewsletter && post.status === "SCHEDULED") {
      return (
        <div className="flex items-center gap-2">
          <span className={`${baseClasses} text-blue-600`}>
            Scheduled to be sent
          </span>
          <span className="text-[10px] text-neutral-400">
            at{" "}
            {post.publishDate
              ? new Date(post.publishDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </span>
          <div className="flex items-center text-xs text-neutral-400">
            {/* <span className='mr-4'>{post.openRate || "71"}% opened</span>
              <span>{post.clickRate || "4"}% clicked</span> */}
          </div>
        </div>
      );
    }

    switch (status.toLowerCase()) {
      case "draft":
        return (
          <div className="flex flex-row gap-x-2">
            <span className={`${baseClasses} text-pink-600`}>Draft</span>
            <span className="text-[10px] text-neutral-400">
              {" "}
              - Last saved at{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        );
      case "newsletter":
        return (
          <div className="flex items-center gap-2">
            <span className={`${baseClasses} text-green-600`}>Sent</span>
            <span className="text-[10px] text-neutral-400">
              {" "}
              - Sent at{" "}
              {post.publishDate
                ? new Date(post.publishDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </span>
            <div className="flex items-center text-xs text-neutral-400">
              {/* <span className='mr-4'>{post.openRate || "71"}% opened</span>
              <span>{post.clickRate || "4"}% clicked</span> */}
            </div>
          </div>
        );
      case "published":
        return (
          <div className="flex flex-row gap-x-2">
            <span className={`${baseClasses} text-green-600`}>Published</span>
            <span className="text-[10px] text-neutral-400">
              {" "}
              at{" "}
              {post.publishDate
                ? new Date(post.publishDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
        );
      case "scheduled":
        return (
          <div className="flex flex-row gap-x-2">
            <span className={`${baseClasses} text-blue-600`}>Scheduled</span>
            <span className="text-[10px] text-neutral-400">
              {" "}
              at{" "}
              {post.publishDate
                ? new Date(post.publishDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
        );
      case "archived":
        return (
          <div className="flex flex-row gap-x-2">
            <span className={`${baseClasses} text-orange-600`}>Archived</span>
            <span className="text-[10px] text-neutral-400">
              {" "}
              - Archived at{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        );
      case "deleted":
        return (
          <div className="flex flex-row gap-x-2">
            <span className={`${baseClasses} text-red-600`}>Deleted</span>
            <span className="text-[10px] text-neutral-400">
              {" "}
              - Deleted at{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ml-16">
      <Table className="w-full">
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.id}
              className="hover:bg-neutral-700/50 cursor-pointer border-b border-neutral-600"
              onClick={() => router.push(`/editor/${post.id}`)}
            >
              <TableCell>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-y-2">
                    <div className="font-medium text-neutral-200">
                      {capitalizeFirstLetter(post.title)}
                    </div>
                    <div className="text-sm text-neutral-600 mt-2">
                      By {post.metadataAuthorName}
                    </div>
                    <div className="">{getStatusBadge(post.status, post)}</div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostsTableRender;
