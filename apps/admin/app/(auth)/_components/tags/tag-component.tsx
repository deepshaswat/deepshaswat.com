"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Button,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui"; // Adjust the import path as needed

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

const TagComponent = () => {
  const router = useRouter();

  // ToDo: Add backend logic to fetch all tags
  const tags = [
    { slug: "articles", postCount: "3" },
    { slug: "book-notes", postCount: "5" },
    { slug: "connect", postCount: "0" },
    { slug: "download", postCount: "1" },
    { slug: "entrepreneurship", postCount: "9" },
    { slug: "finance", postCount: "13" },
    { slug: "getting-started", postCount: "0" },
    { slug: "links", postCount: "0" },
    { slug: "newsletter", postCount: "1" },
  ];

  return (
    <div className="m-8 lg:ml-[156px] lg:mr-[156px]">
      <div className="flex flex-row items-center justify-between w-full lg:w-auto mb-4 lg:mb-0">
        <Label htmlFor="tags" className="text-3xl font-semibold">
          Tags
        </Label>

        <div className="flex gap-2">
          <Link href="/tags/new-tag" className="items-center">
            <Button variant="secondary" className="rounded-sm items-center">
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
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow
                key={tag.slug}
                className="hover:bg-neutral-800 cursor-pointer font-light border-b-neutral-600"
                onClick={() => {
                  router.push(`/tags/${tag.slug}`);
                }}
              >
                <TableCell className="font-medium">
                  {capitalizeFirstLetter(tag.slug)}
                </TableCell>
                <TableCell className="text-neutral-200">{tag.slug}</TableCell>
                <TableCell className=" text-neutral-500">
                  {tag.postCount !== "0" ? (
                    <Link
                      href={`/posts?tags=${tag.slug}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="link"
                        className="rounded-sm font-light text-neutral-200 hover:text-green-500 hover:no-underline"
                      >
                        {tag.postCount}{" "}
                        {tag.postCount === "1" ? "post" : "posts"}
                      </Button>
                    </Link>
                  ) : (
                    <span className="ml-4">
                      {tag.postCount} {tag.postCount === "0" ? "post" : "posts"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/tags/${tag.slug}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="link"
                      className="rounded-sm text-neutral-600"
                    >
                      <ChevronRight />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TagComponent;
