"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
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
import Link from "next/link";
import React, { useRef } from "react";
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

function Navigation(): JSX.Element {
  const { user } = useUser();
  const userButtonRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const buttonElement =
      userButtonRef.current?.querySelector<HTMLButtonElement>("button");
    if (buttonElement) {
      buttonElement.click();
    }
  };

  return (
    <div className="grid h-screen pl-[116px] lg:pl-[156px]">
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r-[1px] border-neutral-700  ">
        <div className="border-b-[1px] border-neutral-700  p-2 items-center justify-center">
          <Link
            className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
            href="/"
            passHref
          >
            <Button aria-label="Home" size="icon" variant="ghost">
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
              <Accordion className="mb-2 " collapsible type="single">
                <AccordionItem
                  className="border-b-[1px] border-neutral-700 "
                  value="item-1"
                >
                  <AccordionTrigger className="flex flex-row !no-underline">
                    <Link
                      className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 ml-2 p-2 pr-2 lg:pr-4 !no-underline"
                      href="/posts"
                      passHref
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
                          className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          href="/new-post"
                          passHref
                        >
                          <Button
                            aria-label="New Posts"
                            className="rounded-lg active:bg-gray-200 "
                            size="icon"
                            variant="ghost"
                          >
                            <Plus className="size-5" />
                          </Button>

                          <span className="max-w-0 lg:max-w-full overflow-hidden ml-2 active:bg-gray-200">
                            New Post
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        className="block lg:invisible"
                        side="right"
                        sideOffset={5}
                      >
                        New Post
                      </TooltipContent>
                    </Tooltip>
                  </AccordionContent>
                  <AccordionContent>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          href="/drafts"
                          passHref
                        >
                          <Button
                            aria-label="Drafts"
                            className="rounded-lg active:bg-gray-200"
                            size="icon"
                            variant="ghost"
                          >
                            <PencilLine className="size-5" />
                          </Button>
                          <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                            Drafts
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        className="block lg:invisible"
                        side="right"
                        sideOffset={5}
                      >
                        Drafts
                      </TooltipContent>
                    </Tooltip>
                  </AccordionContent>
                  <AccordionContent>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          href="/scheduled-posts"
                          passHref
                        >
                          <Button
                            aria-label="Scheduled"
                            className="rounded-lg active:bg-gray-200"
                            size="icon"
                            variant="ghost"
                          >
                            <CalendarCheck2 className="size-5" />
                          </Button>
                          <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                            Scheduled
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        className="block lg:invisible"
                        side="right"
                        sideOffset={5}
                      >
                        Scheduled Posts
                      </TooltipContent>
                    </Tooltip>
                  </AccordionContent>
                  <AccordionContent>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          href="/published"
                          passHref
                        >
                          <Button
                            aria-label="Published"
                            className="rounded-lg active:bg-gray-200"
                            size="icon"
                            variant="ghost"
                          >
                            <BookCheck className="size-5" />
                          </Button>
                          <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                            Published
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        className="block lg:invisible"
                        side="right"
                        sideOffset={5}
                      >
                        Published Posts
                      </TooltipContent>
                    </Tooltip>
                  </AccordionContent>
                  <AccordionContent>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                          href="/newsletters"
                          passHref
                        >
                          <Button
                            aria-label="Newsletters"
                            className="rounded-lg active:bg-gray-200"
                            size="icon"
                            variant="ghost"
                          >
                            <Newspaper className="size-5" />
                          </Button>
                          <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                            Newsletters
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        className="block lg:invisible"
                        side="right"
                        sideOffset={5}
                      >
                        Newsletters
                      </TooltipContent>
                    </Tooltip>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TooltipTrigger>
            <TooltipContent
              className="block lg:invisible"
              side="right"
              sideOffset={5}
            >
              Posts
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                href="/tags"
                passHref
              >
                <Button
                  aria-label="Tags"
                  className="rounded-lg"
                  size="icon"
                  variant="ghost"
                >
                  <Tag className="size-5" />
                </Button>
                <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                  Tags
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="block lg:invisible"
              side="right"
              sideOffset={5}
            >
              Tags
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                href="/analytics"
                passHref
              >
                <Button
                  aria-label="Analytics"
                  className="rounded-lg"
                  size="icon"
                  variant="ghost"
                >
                  <Kanban className="size-5" />
                </Button>
                <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                  Analytics
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="block lg:invisible"
              side="right"
              sideOffset={5}
            >
              Analytics
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                href="/members"
                passHref
              >
                <Button
                  aria-label="Members"
                  className="rounded-lg"
                  size="icon"
                  variant="ghost"
                >
                  <Users2 className="size-5" />
                </Button>
                <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                  Members
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="block lg:invisible"
              side="right"
              sideOffset={5}
            >
              Members
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground active:bg-gray-200 lg:pr-3"
                href="/#"
                passHref
              >
                <Button
                  aria-label="Settings"
                  className="rounded-lg"
                  size="icon"
                  variant="ghost"
                >
                  <Settings className="size-5" />
                </Button>
                <span className="max-w-0 lg:max-w-full overflow-hidden ml-2">
                  Settings
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="block lg:invisible"
              side="right"
              sideOffset={5}
            >
              Settings
            </TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className="flex flex-row items-center rounded-lg hover:bg-accent hover:text-accent-foreground lg:pr-3"
                href=""
                onClick={handleClick}
                passHref
              >
                <Button
                  aria-label="Account"
                  className="mt-auto rounded-lg"
                  size="icon"
                  variant="ghost"
                >
                  <SignedIn>
                    <div
                      className="flex items-center overflow-hidden"
                      ref={userButtonRef}
                    >
                      <UserButton />
                    </div>
                  </SignedIn>
                </Button>
                {/* <UserButton /> */}
                <span className="max-w-0 lg:max-w-full overflow-hidden ml-4">
                  {user?.firstName || "Account"}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="block lg:invisible"
              side="right"
              sideOffset={5}
            >
              {user?.firstName || "Account"}
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </div>
  );
}

export { Navigation };
