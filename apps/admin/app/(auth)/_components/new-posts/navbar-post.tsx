"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
  ChevronLeft,
  PanelRightOpen,
  PanelRightClose,
  Save,
} from "lucide-react";

import { Button, Input, Label } from "@repo/ui";
import { postState, postMetadataState, postIdState } from "@repo/store";
import { createAuthor, createPost, updatePost } from "@repo/actions";
import { PostType } from "@repo/actions";
import { useRecoilState, useRecoilValue } from "recoil";

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
  const isDisabled = post.postUrl === "";
  const [postId, setPostId] = useRecoilState(postIdState);

  const handleSave = async () => {
    console.log("Save");
    //check if post or metadata is not empty
    if (isDisabled) return;

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
      console.log(result);
    } else {
      const result = await createPost(data);
      if (result && "id" in result) {
        setPostId(result.id);
      }
      console.log(result);
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
            Drafts
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
