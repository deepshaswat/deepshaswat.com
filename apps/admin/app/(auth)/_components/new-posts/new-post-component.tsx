"use client";

import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { NavBarPost } from "./navbar-post";
import { MetadataSidebar } from "./metadata-sidebar";

import { UploadComponent } from "@repo/ui";

const NewPostComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mainInputValue, setMainInputValue] = useState("");
  const [sidebarUrl, setSidebarUrl] = useState("");
  const [inputTimeIst, setInputTimeIst] = useState("23:00");
  const [inputExcerpt, setInputExcerpt] = useState("");
  const [inputDate, setInputDate] = useState<Date>(new Date());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputMetaDataTitle, setInputMetaDataTitle] = useState("");
  const [inputMetaDataDescription, setInputMetaDataDescription] = useState("");
  const [metadataImageUrl, setMetadataImageUrl] = useState("");
  const [metadataImageCaption, setMetadataImageCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [featureImageCaption, setFeatureImageCaption] = useState("");
  const [featureImageURL, setFeatureImageURL] = useState("");
  const [isFeatureFileUploadOpen, setIsFeatureFileUploadOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [featurePost, setFeaturePost] = useState(false);

  // const Editor = dynamic(() => import("./editor"), { ssr: false });
  const Editor = useMemo(
    () => dynamic(() => import("./editor"), { ssr: false }),
    []
  );

  const handleFeaturePost = () => {
    setFeaturePost((prev) => !prev);
    // setFeaturePost(!featurePost);
  };

  const handleEditorContentChange = (content: string) => {
    setEditorContent(content);
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleFileUpload = () => {
    setIsFileUploadOpen((prev) => !prev);
  };

  const toggleFeatureImageUpload = () => {
    setIsFeatureFileUploadOpen((prev) => !prev);
  };

  const handleMainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainInputValue(e.target.value);
  };

  const handleSidebarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSidebarUrl(e.target.value);
  };

  const handleTimeIstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTimeIst(e.target.value);
  };
  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputExcerpt(e.target.value);
  };

  const handleMetaDataTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputMetaDataTitle(e.target.value);
  };

  const handleMetaDataDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputMetaDataDescription(e.target.value);
  };

  // ToDo: Handle caption in image upload using text input when image is available
  const handleMetadataImageCaptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMetadataImageCaption(e.target.value);
  };

  const handleMetaDataImageChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      try {
        // Request presigned URL from the API route
        const { data } = await axios.post("/api/upload", {
          fileType: file.type,
        });

        const { uploadURL, s3URL } = data;

        // Upload file to S3 using the presigned URL
        await axios.put(uploadURL, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // Set the S3 URL as the image URL
        setMetadataImageUrl(s3URL);

        console.log("File uploaded successfully:", s3URL);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsSubmitting(false);
        setIsFileUploadOpen(false);
      }
    } else {
      onClose();
    }
  };

  const onClose = () => {
    setMetadataImageUrl("");
    setIsSubmitting(false);
    setIsFileUploadOpen(false);
  };

  const handleFeatureImageCaptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFeatureImageCaption(e.target.value);
  };

  const handleFeatureImageChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      try {
        // Request presigned URL from the API route
        const { data } = await axios.post("/api/upload", {
          fileType: file.type,
        });

        const { uploadURL, s3URL } = data;

        // Upload file to S3 using the presigned URL
        await axios.put(uploadURL, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // Set the S3 URL as the image URL
        setFeatureImageURL(s3URL);

        console.log("File uploaded successfully:", s3URL);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsSubmitting(false);
        setIsFeatureFileUploadOpen(false);
      }
    } else {
      onCloseFeatureImage();
    }
  };

  const onCloseFeatureImage = () => {
    setFeatureImageURL("");
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
              imageUrl={featureImageURL}
              isSubmitting={isSubmitting}
              onChange={handleFeatureImageChange}
              isFileUploadOpen={isFeatureFileUploadOpen}
              toggleFileUpload={toggleFeatureImageUpload}
              text='Add feature image'
              className='text-neutral-400 font-light !no-underline hover:text-neutral-200 mt-10'
              buttonVariant='link'
            />
          </div>
          <div>
            <input
              value={mainInputValue}
              onChange={handleMainInputChange}
              placeholder='Post title'
              className='w-full ml-12 mt-4 bg-transparent text-5xl font-semibold outline-none ring-0 placeholder:text-neutral-700'
            />
          </div>
          <div className='mt-8'>
            <Editor
              onChange={handleEditorContentChange}
              initialContent={editorContent}
              editable={true}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <MetadataSidebar
          inputUrl={sidebarUrl}
          onInputUrlChange={handleSidebarUrlChange}
          inputTimeIst={inputTimeIst}
          setInputTimeIst={handleTimeIstChange}
          setInputDate={setInputDate}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          inputExcerpt={inputExcerpt}
          setInputExcerpt={handleExcerptChange}
          inputMetaDataTitle={inputMetaDataTitle}
          setInputMetaDataTitle={handleMetaDataTitleChange}
          inputMetaDataDescription={inputMetaDataDescription}
          setInputMetaDataDescription={handleMetaDataDescriptionChange}
          metadataImageUrl={metadataImageUrl}
          isSubmitting={isSubmitting}
          onChange={handleMetaDataImageChange}
          isFileUploadOpen={isFileUploadOpen}
          toggleFileUpload={toggleFileUpload}
          featurePost={featurePost}
          setFeaturePost={handleFeaturePost}
        />
      )}
    </div>
  );
};

export { NewPostComponent };
