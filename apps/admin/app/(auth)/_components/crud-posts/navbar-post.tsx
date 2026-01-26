"use client";

import type { PostType } from "@repo/actions";
import { createAuthor, createPost, updatePost } from "@repo/actions";
import {
  postState,
  postMetadataState,
  postIdState,
  postDataState,
  errorDuplicateUrlState,
  savePostErrorState,
} from "@repo/store";
import {
  Button,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import {
  ChevronLeft,
  PanelRightOpen,
  PanelRightClose,
  Save,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
function renderSaveButtonContent(
  isSaving: boolean,
  isSavingSuccess: boolean,
  savePostError: string | null,
): JSX.Element {
  if (isSaving && !isSavingSuccess) {
    return (
      <>
        <Loader2 className="size-4 mr-1 animate-spin" />
        Saving...
      </>
    );
  }
  if (savePostError) {
    return (
      <span className="flex flex-row items-center text-red-500">
        <AlertTriangle className="size-4 mr-1" />
        Error
      </span>
    );
  }
  if (isSavingSuccess) {
    return (
      <span className="flex flex-row items-center text-green-500">
        <Check className="size-4 mr-1" />
        Saved
      </span>
    );
  }
  return (
    <>
      <Save className="size-4 mr-1" />
      Save
    </>
  );
}

export function NavBarPost({
  isOpen,
  toggleSidebar,
}: NavBarPostProps): JSX.Element {
  const router = useRouter();

  const metadata = useRecoilValue(postMetadataState);
  const postFull = useRecoilValue(postDataState);
  const post = useRecoilValue(postState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [errorDuplicateUrl, setErrorDuplicateUrl] = useRecoilState(
    errorDuplicateUrlState,
  );

  const savePostError = useRecoilValue(savePostErrorState);

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSuccess, setIsSavingSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDisabled = post.title === "" || post.postUrl === "";

  useEffect(() => {
    if (postFull) {
      setPostId(postFull.id);
    }
  }, [postFull, setPostId]);

  useEffect(() => {
    // Error state updated - handled by UI
  }, [errorDuplicateUrl]);

  const handleSave = async (): Promise<void> => {
    if (isDisabled) return;
    setErrorDuplicateUrl(null);
    setIsSaving(true);
    const user = await createAuthor();

    const data: PostType = {
      ...post,
      metaData: {
        ...metadata,
        authorName: user.name ?? "",
      },
      authorId: user.id ?? "",
      tags: post.tags,
    };

    if (postId) {
      const result = await updatePost(data, postId);
      setIsSaving(false);
      if ("error" in result) {
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
      if ("error" in result) {
        setErrorDuplicateUrl(result.error ?? "Duplicate URL");
      } else if ("post" in result && result.post) {
        setPostId(result.post.id);
        setIsSavingSuccess(true);
        setTimeout(() => {
          setIsSavingSuccess(false);
        }, 3000);
        router.push(`/editor/${result.post.id}`);
      }
    }
  };

  const handlePublish = async (): Promise<void> => {
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
            className="flex flex-row items-center text-sm rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
            href="/posts"
            passHref
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
              className="flex flex-row items-center text-sm rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
              href="/preview"
              passHref
            >
              Preview
            </Link>
            <Button
              className="flex flex-row items-center text-sm text-green-500 rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
              disabled={isDisabled}
              onClick={() => {
                void handlePublish();
              }}
              size="sm"
              variant="link"
            >
              Publish
            </Button>

            <PublishDialog
              onOpenChange={setIsDialogOpen}
              value={isDialogOpen}
            />

            <TooltipProvider>
              <Tooltip>
                <div className="inline-block">
                  {" "}
                  {/* Wrapper div to prevent button nesting */}
                  <TooltipTrigger asChild>
                    <Button
                      aria-label="Save post"
                      className="flex z-50 items-center"
                      disabled={isDisabled}
                      onClick={() => {
                        void handleSave();
                      }}
                      variant="ghost"
                    >
                      {renderSaveButtonContent(
                        isSaving,
                        isSavingSuccess,
                        savePostError,
                      )}
                    </Button>
                  </TooltipTrigger>
                </div>
                <TooltipContent>
                  {isDisabled ? <p>Title and URL are required</p> : null}
                  {!isDisabled ? <p>Click to save</p> : null}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            aria-label="Toggle sidebar"
            className="flex z-50 items-center"
            onClick={toggleSidebar}
            size="icon"
            variant="ghost"
          >
            {!isOpen ? <PanelRightOpen className="size-5" /> : null}
            {isOpen ? <PanelRightClose className="size-5" /> : null}
          </Button>
        </div>
      </nav>
    </div>
  );
}
