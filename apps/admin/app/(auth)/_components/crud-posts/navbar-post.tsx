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
  Dialog,
  DialogContent,
  BlockNoteRenderer,
} from "@repo/ui";
import {
  ChevronLeft,
  PanelRightOpen,
  PanelRightClose,
  Save,
  Check,
  Loader2,
  AlertTriangle,
  Eye,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);
  const isDisabled = post.title === "" || post.postUrl === "";

  // Auto-save refs
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUnsavedChanges = useRef(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (postFull) {
      setPostId(postFull.id);
    }
  }, [postFull, setPostId]);

  useEffect(() => {
    // Error state updated - handled by UI
  }, [errorDuplicateUrl]);

  // Auto-save: 5-second debounce on content/title changes
  useEffect(() => {
    // Skip initial load (when Recoil atoms are first populated)
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Only auto-save existing posts (new posts need manual first save)
    if (!postId) return;

    hasUnsavedChanges.current = true;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (hasUnsavedChanges.current && post.title && post.postUrl) {
        void handleAutoSave();
      }
    }, 5000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.title, post.content, postId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleAutoSave = useCallback(async (): Promise<void> => {
    if (isDisabled || !postId) return;
    hasUnsavedChanges.current = false;
    setIsSaving(true);

    const user = await createAuthor();
    const data: PostType = {
      ...post,
      metaData: { ...metadata, authorName: user.name ?? "" },
      authorId: user.id ?? "",
      tags: post.tags,
    };

    const result = await updatePost(data, postId);
    setIsSaving(false);
    if (!("error" in result)) {
      setIsSavingSuccess(true);
      setTimeout(() => {
        setIsSavingSuccess(false);
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, metadata, postId, isDisabled]);

  const handleSave = async (): Promise<void> => {
    if (isDisabled) return;
    hasUnsavedChanges.current = false;
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
            <Button
              className="flex flex-row items-center text-sm rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
              disabled={isDisabled}
              onClick={() => {
                setIsPreviewOpen(true);
              }}
              size="sm"
              variant="ghost"
            >
              <Eye className="size-4 mr-1" />
              Preview
            </Button>

            {postFull?.isNewsletter === true &&
              String(postFull.status) === "PUBLISHED" && (
                <Button
                  className="flex flex-row items-center text-sm text-blue-400 rounded-sm hover:bg-neutral-700 active:bg-gray-200 p-2"
                  onClick={() => {
                    setIsResendDialogOpen(true);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Send className="size-4 mr-1" />
                  Resend
                </Button>
              )}

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

            {isResendDialogOpen && (
              <PublishDialog
                mode="resend"
                onOpenChange={setIsResendDialogOpen}
                value={isResendDialogOpen}
              />
            )}

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

      {/* Inline Preview Dialog */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) setIsPreviewOpen(false);
        }}
        open={isPreviewOpen}
      >
        <DialogContent className="fixed w-full h-full bg-neutral-900 border-none flex flex-col !max-w-none !max-h-none overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <Button
              className="text-neutral-400 hover:text-white"
              onClick={() => {
                setIsPreviewOpen(false);
              }}
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to editor
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">Preview</span>
              <Eye className="size-4 text-neutral-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-8 py-10">
              {Boolean(post.featureImage) && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <Image
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover"
                    height={600}
                    src={post.featureImage}
                    width={1200}
                  />
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {post.title || "Untitled"}
              </h1>

              <div className="border-t border-neutral-700 mb-8" />

              <div className="prose prose-invert prose-lg max-w-none">
                <BlockNoteRenderer
                  className="text-neutral-200"
                  content={post.content}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 px-6 py-4">
            <div className="max-w-4xl mx-auto flex gap-4">
              {String(postFull?.status) === "PUBLISHED" && (
                <Button
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-4"
                  onClick={() => {
                    window.open(
                      `https://deepshaswat.com/${post.postUrl}`,
                      "_blank",
                    );
                  }}
                  variant="ghost"
                >
                  Open on site
                </Button>
              )}
              <Button
                className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white"
                onClick={() => {
                  setIsPreviewOpen(false);
                }}
                variant="ghost"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
