"use client";

import React from "react";

import {
  Home,
  Settings,
  Users2,
  SquarePen,
  PencilLine,
  CalendarCheck2,
  BookCheck,
  Plus,
  Newspaper,
  Tag,
  Kanban,
} from "lucide-react";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Navigation = () => {
  const { user } = useUser();

  return (
    <>
      <div className="grid h-screen pl-[116px] lg:pl-[156px]">
        <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r-[1px] border-neutral-700  ">
          <div className="border-b-[1px] border-neutral-700  p-2 items-center justify-center">
            <Link
              href="/"
              passHref
              className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
            >
              <Button variant="ghost" size="icon" aria-label="Home">
                <Home className="size-5" />
              </Button>
              <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                Home
              </span>
            </Link>
          </div>
          <nav className="grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Accordion type="single" collapsible className="mb-2 ">
                  <AccordionItem
                    value="item-1"
                    className="border-b-[1px] border-neutral-700 "
                  >
                    <AccordionTrigger className="flex flex-row !no-underline">
                      <Link
                        href="/posts"
                        passHref
                        className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 ml-2 p-2 pr-2 lg:pr-4 !no-underline"
                      >
                        <SquarePen className="size-5 lg:ml-2" />
                        <span className="max-w-0 lg:max-w-full overflow-hidden lg:ml-3 !no-underline">
                          Posts
                        </span>
                      </Link>
                    </AccordionTrigger>

                    <AccordionContent>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/new-post"
                            passHref
                            className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg active:bg-gray-200 "
                              aria-label="New Posts"
                            >
                              <Plus className="size-5" />
                            </Button>

                            <span className="max-w-0 lg:max-w-full overflow-hidden ml-2 active:bg-gray-200">
                              New Post
                            </span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={5}
                          className="block lg:invisible"
                        >
                          New Post
                        </TooltipContent>
                      </Tooltip>
                    </AccordionContent>
                    <AccordionContent>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/drafts"
                            passHref
                            className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg active:bg-gray-200"
                              aria-label="Drafts"
                            >
                              <PencilLine className="size-5" />
                            </Button>
                            <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                              Drafts
                            </span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={5}
                          className="block lg:invisible"
                        >
                          Drafts
                        </TooltipContent>
                      </Tooltip>
                    </AccordionContent>
                    <AccordionContent>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/scheduled-posts"
                            passHref
                            className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg active:bg-gray-200"
                              aria-label="Scheduled"
                            >
                              <CalendarCheck2 className="size-5" />
                            </Button>
                            <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                              Scheduled
                            </span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={5}
                          className="block lg:invisible"
                        >
                          Scheduled Posts
                        </TooltipContent>
                      </Tooltip>
                    </AccordionContent>
                    <AccordionContent>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/published"
                            passHref
                            className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg active:bg-gray-200"
                              aria-label="Published"
                            >
                              <BookCheck className="size-5" />
                            </Button>
                            <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                              Published
                            </span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={5}
                          className="block lg:invisible"
                        >
                          Published Posts
                        </TooltipContent>
                      </Tooltip>
                    </AccordionContent>
                    <AccordionContent>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/newsletters"
                            passHref
                            className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg active:bg-gray-200"
                              aria-label="Newsletters"
                            >
                              <Newspaper className="size-5" />
                            </Button>
                            <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                              Newsletters
                            </span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={5}
                          className="block lg:invisible"
                        >
                          Newsletters
                        </TooltipContent>
                      </Tooltip>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="block lg:invisible"
              >
                Posts
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/tags"
                  passHref
                  className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg"
                    aria-label="Tags"
                  >
                    <Tag className="size-5" />
                  </Button>
                  <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                    Tags
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="block lg:invisible"
              >
                Tags
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/analytics"
                  passHref
                  className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg"
                    aria-label="Analytics"
                  >
                    <Kanban className="size-5" />
                  </Button>
                  <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                    Analytics
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="block lg:invisible"
              >
                Analytics
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/members"
                  passHref
                  className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg"
                    aria-label="Members"
                  >
                    <Users2 className="size-5" />
                  </Button>
                  <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                    Members
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="block lg:invisible"
              >
                Members
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/#"
                  passHref
                  className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg"
                    aria-label="Settings"
                  >
                    <Settings className="size-5" />
                  </Button>
                  <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                    Settings
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="block lg:invisible"
              >
                Settings
              </TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/new-post"
                  passHref
                  className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-auto rounded-lg"
                    aria-label="Account"
                  >
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </Button>
                  <span className="max-w-0 lg:max-w-full overflow-hidden ml-4">
                    {user?.firstName || "Account"}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="block lg:invisible"
              >
                {user?.firstName || "Account"}
              </TooltipContent>
            </Tooltip>
          </nav>
        </aside>
      </div>
    </>
  );
};

export { Navigation };
