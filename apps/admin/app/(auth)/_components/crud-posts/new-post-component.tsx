"use client";

import {
  selectDate,
  postMetadataState,
  postState,
  selectedTimeIst,
  postIdState,
  postDataState,
  tagsState,
  selectedTagsState,
} from "@repo/store";
import { UploadComponent } from "@repo/ui";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { useResetRecoilState, useRecoilState } from "recoil";
import { MetadataSidebar } from "./metadata-sidebar";
import { NavBarPost } from "./navbar-post";

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

function NewPostComponent(): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatureFileUploadOpen, setIsFeatureFileUploadOpen] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const [post, setPost] = useRecoilState(postState);
  const [_postMetadata, setPostMetadata] = useRecoilState(postMetadataState);
  const resetMetadata = useResetRecoilState(postMetadataState);
  const resetPost = useResetRecoilState(postState);
  const resetSelectedTimeIst = useResetRecoilState(selectedTimeIst);
  const resetSelectDate = useResetRecoilState(selectDate);
  const resetPostFull = useResetRecoilState(postDataState);
  const resetPostId = useResetRecoilState(postIdState);
  const resetTags = useResetRecoilState(tagsState);
  const resetSelectedTags = useResetRecoilState(selectedTagsState);

  // reset state of all fields and uploaders of this page on mount
  useEffect(() => {
    setIsSubmitting(false);
    setIsFeatureFileUploadOpen(false);
    setAbortController(null);

    resetPostFull();
    resetMetadata();
    resetPost();
    resetSelectedTimeIst();
    resetSelectDate();
    resetPostId();
    resetTags();
    resetSelectedTags();
  }, [
    resetPost,
    resetPostFull,
    resetPostId,
    resetSelectedTimeIst,
    resetSelectDate,
    resetMetadata,
    resetTags,
    resetSelectedTags,
  ]);

  const Editor = useMemo(
    () => dynamic(() => import("./editor"), { ssr: false }),
    [],
  );

  const handleEditorContentChange = (content: string): void => {
    setPost((prev) => ({ ...prev, content }));
  };

  const toggleSidebar = (): void => {
    setIsOpen((prev) => !prev);
  };

  const toggleFeatureImageUpload = (): void => {
    setIsFeatureFileUploadOpen((prev) => !prev);
  };

  const handleMainInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPost((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleFeatureImageChange = async (file?: File): Promise<void> => {
    if (file) {
      setIsSubmitting(true);
      try {
        const { data } = await axios.post<UploadResponse>("/api/upload", {
          fileType: file.type,
        });
        const { uploadURL, s3URL } = data;
        await axios.put(uploadURL, file, {
          headers: { "Content-Type": file.type },
        });
        setPost((prev) => ({ ...prev, featureImage: s3URL }));
        setPostMetadata((prev) => ({ ...prev, imageUrl: s3URL }));
        setPostMetadata((prev) => ({ ...prev, twitterImage: s3URL }));
        setPostMetadata((prev) => ({ ...prev, ogImage: s3URL }));
      } catch (error) {
        // eslint-disable-next-line no-console -- Error logging for debugging file upload failures
        console.error("Error uploading file:", error);
      } finally {
        setIsSubmitting(false);
        setAbortController(null);
        setIsFeatureFileUploadOpen(false);
      }
    } else {
      onCloseFeatureImage();
    }
  };

  const handleCancelUpload = (): void => {
    if (abortController) {
      abortController.abort();
      setIsSubmitting(false);
      setAbortController(null);
    }
  };

  const onCloseFeatureImage = (): void => {
    setPost((prev) => ({ ...prev, featureImage: "" }));
    setIsSubmitting(false);
    setIsFeatureFileUploadOpen(false);
  };

  return (
    <div className="flex">
      <div className={`flex-1 ${isOpen ? " mr-[400px]" : ""}`}>
        <NavBarPost isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className="lg:mx-[180px]">
          <div className="ml-10 max-w-screen-md lg:max-w-screen-lg">
            <UploadComponent
              buttonVariant="link"
              className="text-neutral-400 font-light !no-underline hover:text-neutral-200 mt-10"
              imageUrl={post.featureImage}
              isFileUploadOpen={isFeatureFileUploadOpen}
              isSubmitting={isSubmitting}
              onCancel={handleCancelUpload}
              onChange={(file) => {
                void handleFeatureImageChange(file);
              }}
              text="Add feature image"
              toggleFileUpload={toggleFeatureImageUpload}
            />
          </div>
          <div>
            <input
              className="w-full ml-12 mt-4 bg-transparent text-5xl font-semibold outline-none ring-0 placeholder:text-neutral-700"
              onChange={handleMainInputChange}
              placeholder="Post title"
              value={post.title}
            />
          </div>
          <div className="mt-8">
            <Editor
              editable
              initialContent={post.content}
              onChange={handleEditorContentChange}
            />
          </div>
        </div>
      </div>

      {isOpen ? <MetadataSidebar /> : null}
    </div>
  );
}

export { NewPostComponent };
