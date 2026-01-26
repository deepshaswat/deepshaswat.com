"use client";

import type { Tags } from "@repo/actions";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Button,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";

function getPostsLabel(count: number): string {
  return count === 1 ? "post" : "posts";
}

function capitalizeFirstLetter(item: string): string {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase(),
    )
    .join(" ");
}

interface TagListInterface {
  tags: Tags[];
}

function TagComponentRendering({ tags }: TagListInterface): JSX.Element {
  const router = useRouter();

  return (
    <div className="m-8 lg:ml-[156px] lg:mr-[156px]">
      <div className="flex flex-row items-center justify-between w-full lg:w-auto mb-4 lg:mb-0">
        <Label className="text-3xl font-semibold" htmlFor="tags">
          Tags
        </Label>

        <div className="flex gap-2">
          <Link className="items-center" href="/tags/new-tag">
            <Button className="rounded-sm items-center" variant="default">
              New tag
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 lg:mt-16">
        <Table className="table-auto w-full ">
          <TableHeader>
            <TableRow className="hover:bg-transparent text-neutral-200 font-light border-b-neutral-600">
              <TableHead className="w-[400px] lg:w-[1000px] text-neutral-200 font-light ">
                TAG
              </TableHead>
              <TableHead className="text-neutral-200 font-light  ">
                SLUG
              </TableHead>
              <TableHead className="text-neutral-200 font-light ">
                NO. OF POSTS
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow
                className="hover:bg-neutral-800 cursor-pointer font-light border-b-neutral-600"
                key={tag.slug}
                onClick={() => {
                  router.push(`/tags/${tag.slug}`);
                }}
              >
                <TableCell className="font-medium">
                  {capitalizeFirstLetter(tag.slug)}
                </TableCell>
                <TableCell className="text-neutral-200">{tag.slug}</TableCell>
                <TableCell className=" text-neutral-500">
                  {tag.posts.length !== 0 ? (
                    <Link href={`/posts?tags=${tag.slug}`}>
                      <Button
                        className="rounded-sm font-light text-neutral-200 hover:text-green-500 hover:no-underline"
                        variant="link"
                      >
                        {tag.posts.length}{" "}
                        {tag.posts.length === 1 ? "post" : "posts"}
                      </Button>
                    </Link>
                  ) : (
                    <span className="ml-4">
                      {tag.posts.length} {getPostsLabel(tag.posts.length)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {/* <Link href={`/tags/${tag.slug}`}> */}
                  <Button
                    className="rounded-sm text-neutral-600"
                    variant="link"
                  >
                    <ChevronRight />
                  </Button>
                  {/* </Link> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TagComponentRendering;
