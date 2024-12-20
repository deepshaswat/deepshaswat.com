"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useResetRecoilState, useRecoilState } from "recoil";
import { useMemo } from "react";
import { NavBarPost } from "./navbar-post";
import { MetadataSidebar } from "./metadata-sidebar";
import { UploadComponent } from "@repo/ui";
import {
  selectDate,
  postMetadataState,
  postState,
  selectedTimeIst,
  postIdState,
  postDataState,
} from "@repo/store";

const NewPostComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useRecoilState(postState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatureFileUploadOpen, setIsFeatureFileUploadOpen] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // reset state of metadata sidebar using recoil
  const resetMetadata = useResetRecoilState(postMetadataState);
  const resetPost = useResetRecoilState(postState);
  const resetSelectedTimeIst = useResetRecoilState(selectedTimeIst);
  const resetSelectDate = useResetRecoilState(selectDate);
  const resetPostFull = useResetRecoilState(postDataState);

  // reset state of all fields and uploaders of this page
  const resetState = () => {
    setIsSubmitting(false);
    setIsFeatureFileUploadOpen(false);
    setAbortController(null);

    // reset metadata sidebar state
    resetMetadata();
    resetPost();
    resetSelectedTimeIst();
    resetSelectDate();
    resetPostFull();
  };

  useEffect(() => {
    resetState();
  }, []);

  const Editor = useMemo(
    () => dynamic(() => import("./editor"), { ssr: false }),
    []
  );

  const handleEditorContentChange = (content: string) => {
    setPost((prev) => ({ ...prev, content }));
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleFeatureImageUpload = () => {
    setIsFeatureFileUploadOpen((prev) => !prev);
  };

  const handleMainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleFeatureImageChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      try {
        const { data } = await axios.post("/api/upload", {
          fileType: file.type,
        });
        const { uploadURL, s3URL } = data;
        await axios.put(uploadURL, file, {
          headers: { "Content-Type": file.type },
        });
        setPost((prev) => ({ ...prev, featureImage: s3URL }));
      } catch (error) {
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

  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
      setIsSubmitting(false);
      setAbortController(null);
    }
  };

  const onCloseFeatureImage = () => {
    setPost((prev) => ({ ...prev, featureImage: "" }));
    setIsSubmitting(false);
    setIsFeatureFileUploadOpen(false);
  };

  return (
    <div className='flex'>
      <div className={`flex-1 ${isOpen ? " mr-[400px]" : ""}`}>
        <NavBarPost isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className='lg:mx-[180px]'>
          <div className='ml-10 max-w-screen-md lg:max-w-screen-lg'>
            <UploadComponent
              imageUrl={post.featureImage}
              isSubmitting={isSubmitting}
              onChange={handleFeatureImageChange}
              isFileUploadOpen={isFeatureFileUploadOpen}
              toggleFileUpload={toggleFeatureImageUpload}
              text='Add feature image'
              className='text-neutral-400 font-light !no-underline hover:text-neutral-200 mt-10'
              buttonVariant='link'
              onCancel={handleCancelUpload}
            />
          </div>
          <div>
            <input
              value={post.title}
              onChange={handleMainInputChange}
              placeholder='Post title'
              className='w-full ml-12 mt-4 bg-transparent text-5xl font-semibold outline-none ring-0 placeholder:text-neutral-700'
            />
          </div>
          <div className='mt-8'>
            <Editor
              onChange={handleEditorContentChange}
              initialContent={post.content}
              editable={true}
            />
          </div>
        </div>
      </div>

      {isOpen && <MetadataSidebar />}
    </div>
  );
};

export { NewPostComponent };
