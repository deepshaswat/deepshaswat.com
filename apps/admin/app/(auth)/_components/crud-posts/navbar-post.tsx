"use client";

import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  ChevronLeft,
  PanelRightOpen,
  PanelRightClose,
  Save,
} from "lucide-react";

import {
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import {
  postState,
  postMetadataState,
  postIdState,
  postDataState,
  errorDuplicateUrlState,
} from "@repo/store";
import { createAuthor, createPost, updatePost } from "@repo/actions";
import { PostType } from "@repo/actions";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";

interface NavBarPostProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

/**
 *
 *  ToDo:
 * 1. Clicking on the "Drafts" label should navigate to the Posts page. And save the content of the input field to the drafts.
 * 2. Clicking on the "Preview" link should navigate to the Preview page.
 * 3. Clicking on the "Publish" link should navigate to the Pre-publish page.
 *
 */

export function NavBarPost({ isOpen, toggleSidebar }: NavBarPostProps) {
  const metadata = useRecoilValue(postMetadataState);
  const post = useRecoilValue(postState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [errorDuplicateUrl, setErrorDuplicateUrl] = useRecoilState(
    errorDuplicateUrlState,
  );

  const isDisabled = post.title === "" || post.postUrl === "";
  const postFull = useRecoilValue(postDataState);
  const router = useRouter();

  useEffect(() => {
    if (postFull) {
      setPostId(postFull?.id ?? null);
    }
  }, [postFull, setPostId]);

  useEffect(() => {
    if (errorDuplicateUrl) {
      console.log("Error state updated:", errorDuplicateUrl);
    }
  }, [errorDuplicateUrl]);

  const handleSave = async () => {
    if (isDisabled) return;
    setErrorDuplicateUrl(null);

    const user = await createAuthor();

    const data: PostType = {
      ...post,
      metaData: {
        ...metadata,
        authorName: user?.name ?? "",
      },
      authorId: user?.id ?? "",
    };

    if (postId) {
      const result = await updatePost(data, postId);
      if (result && "error" in result) {
        setErrorDuplicateUrl(result.error);
      } else {
        router.push(`/editor/${postId}`);
      }
    } else {
      const result = await createPost(data);
      if (result && "error" in result) {
        setErrorDuplicateUrl(result.error);
      } else if (result && "id" in result) {
        setPostId(result.id);
        router.push(`/editor/${result.id}`);
      }
    }
  };

  return (
    <div className="ml-auto mt-5 mr-2 lg:m-5 ">
      <nav className="w-full flex flex-row justify-between ml-2">
        <div className="flex flex-row gap-2 lg:gap-10  items-center">
          <Link
            href="/posts"
            passHref
            className="flex flex-row items-center text-sm rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
          >
            <ChevronLeft className="size-4 mr-3" />
            Posts
          </Link>
          <Label className="flex flex-row items-center text-sm font-light text-neutral-400 rounded-sm hover:bg-neutral-700  p-2">
            {postId ? "Drafts" : "New Post"}
          </Label>
        </div>

        {/* Right-aligned section */}
        <div className="flex flex-row items-center gap-2 mr-2">
          <div className="flex flex-row gap-4  items-center ">
            <Link
              href="/preview"
              passHref
              className="flex flex-row items-center text-sm rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
            >
              Preview
            </Link>
            <Link
              href="/pre-publish"
              passHref
              className="flex flex-row items-center text-sm text-green-500 rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
            >
              Publish
            </Link>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    // size='icon'
                    aria-label="SideBarMenu"
                    onClick={handleSave}
                    className="flex z-50 items-center "
                    disabled={isDisabled}
                  >
                    <Save className="size-4 mr-1" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isDisabled && <p>Title and URL are required</p>}
                  {!isDisabled && <p>Click to save</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="SideBarMenu"
            onClick={toggleSidebar}
            className="flex z-50 items-center "
          >
            {!isOpen && <PanelRightOpen className="size-5  " />}
            {isOpen && <PanelRightClose className="size-5 " />}
          </Button>
        </div>
      </nav>
    </div>
  );
}
