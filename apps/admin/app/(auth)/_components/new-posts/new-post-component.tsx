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
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [featureImage, setFeatureImage] = useState<File | undefined>(undefined);
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

  const handleMetaDataImageChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      console.log("File uploaded successfully");
      console.log(file?.name);
    }
    // ToDo: Handle file add to S3

    onClose();
  };

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    setIsFileUploadOpen(false);
  };

  const handleFeatureImageChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFeatureImage(file);
      console.log("File uploaded successfully");
      console.log(file?.name);
    }
    // ToDo: Handle file add to S3

    onCloseFeatureImage();
  };

  const onCloseFeatureImage = () => {
    setFeatureImage(undefined);
    setIsSubmitting(false);
    setIsFeatureFileUploadOpen(false);
  };

  return (
    <div className='flex'>
      <div className={`flex-1 ${isOpen ? " mr-[400px]" : ""}`}>
        <NavBarPost isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className='lg:mx-[180px]'>
          <div className='ml-10 max-w-screen-xl'>
            <UploadComponent
              file={featureImage}
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
          file={file}
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
