"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import {
  ChevronLeft,
  PanelRightOpen,
  PanelRightClose,
  Save,
  Check,
  Loader2,
  AlertTriangle,
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
  savePostErrorState,
  selectDate,
  selectedTimeIst,
} from "@repo/store";
import { createAuthor, createPost, updatePost } from "@repo/actions";
import { PostType } from "@repo/actions";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import PublishDialog from "./publish-dialog-component";

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
  const router = useRouter();

  const metadata = useRecoilValue(postMetadataState);
  const postFull = useRecoilValue(postDataState);
  const post = useRecoilValue(postState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [errorDuplicateUrl, setErrorDuplicateUrl] = useRecoilState(
    errorDuplicateUrlState
  );

  const savePostError = useRecoilValue(savePostErrorState);

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSuccess, setIsSavingSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDisabled = post.title === "" || post.postUrl === "";

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
    setIsSaving(true);
    const user = await createAuthor();

    const data: PostType = {
      ...post,
      metaData: {
        ...metadata,
        authorName: user?.name ?? "",
      },
      authorId: user?.id ?? "",
      tags: post.tags,
    };

    if (postId) {
      const result = await updatePost(data, postId);
      setIsSaving(false);
      if (result && "error" in result) {
        setErrorDuplicateUrl(result.error ?? "Duplicate URL");
      } else {
        setIsSavingSuccess(true);
        setTimeout(() => {
          setIsSavingSuccess(false);
        }, 3000);
        // router.push(`/editor/${postId}`);
      }
    } else {
      const result = await createPost(data);
      setIsSaving(false);
      if (result && "error" in result) {
        setErrorDuplicateUrl(result.error ?? "Duplicate URL");
      } else if (result && "post" in result && result.post) {
        setPostId(result.post.id);
        setIsSavingSuccess(true);
        setTimeout(() => {
          setIsSavingSuccess(false);
        }, 3000);
        router.push(`/editor/${result.post.id}`);
      }
    }
  };

  const handlePublish = async () => {
    if (isDisabled) return;
    await handleSave();
    setIsDialogOpen(true);
  };

  // useEffect(() => {}, [setIsDialogOpen]);

  return (
    <div className="ml-auto mt-5 mr-2 lg:m-5">
      <nav className="w-full flex flex-row justify-between ml-2">
        <div className="flex flex-row gap-2 lg:gap-10 items-center">
          <Link
            href="/posts"
            passHref
            className="flex flex-row items-center text-sm rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
          >
            <ChevronLeft className="size-4 mr-3" />
            Posts
          </Link>
          <Label className="flex flex-row items-center text-sm font-light text-neutral-400 rounded-sm hover:bg-neutral-700 p-2">
            {postId ? "Drafts" : "New Post"}
          </Label>
        </div>

        {/* Right-aligned section */}
        <div className="flex flex-row items-center gap-2 mr-2">
          <div className="flex flex-row gap-4 items-center">
            <Link
              href="/preview"
              passHref
              className="flex flex-row items-center text-sm rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
            >
              Preview
            </Link>
            <Button
              onClick={handlePublish}
              variant="link"
              size="sm"
              className="flex flex-row items-center text-sm text-green-500 rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
              disabled={isDisabled}
            >
              Publish
            </Button>

            <PublishDialog
              value={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            />

            <TooltipProvider>
              <Tooltip>
                <div className="inline-block">
                  {" "}
                  {/* Wrapper div to prevent button nesting */}
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      aria-label="Save post"
                      onClick={handleSave}
                      className="flex z-50 items-center"
                      disabled={isDisabled}
                    >
                      {isSaving && !isSavingSuccess ? (
                        <>
                          <Loader2 className="size-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : savePostError ? (
                        <span className="flex flex-row items-center text-red-500">
                          <AlertTriangle className="size-4 mr-1" />
                          Error
                        </span>
                      ) : !isSaving && !isSavingSuccess && !savePostError ? (
                        <>
                          <Save className="size-4 mr-1" />
                          Save
                        </>
                      ) : (
                        <span className="flex flex-row items-center text-green-500">
                          <Check className="size-4 mr-1" />
                          Saved
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                </div>
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
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            className="flex z-50 items-center"
          >
            {!isOpen && <PanelRightOpen className="size-5" />}
            {isOpen && <PanelRightClose className="size-5" />}
          </Button>
        </div>
      </nav>
    </div>
  );
}
