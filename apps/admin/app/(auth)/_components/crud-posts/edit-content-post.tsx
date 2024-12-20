"use client";

import { fetchTagsFromTagOnPost, PostListType } from "@repo/actions";
import { postDataState, postIdState } from "@repo/store";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useResetRecoilState, useRecoilState } from "recoil";
import { NavBarPost } from "./navbar-post";
import { MetadataSidebar } from "./metadata-sidebar";
import { UploadComponent } from "@repo/ui";
import {
  selectDate,
  postMetadataState,
  postState,
  selectedTimeIst,
} from "@repo/store";
import { usePathname } from "next/navigation";

const capitalizeFirstLetter = (item: string) => {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase()
    )
    .join(" ");
};

export const EditContentPost = ({
  initialPost,
}: {
  initialPost: PostListType;
}) => {
  const [postFull, setPostFull] = useRecoilState(postDataState);

  const [post, setPost] = useRecoilState(postState); // add value of initialPost to post
  const [metadata, setMetadata] = useRecoilState(postMetadataState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [inputDate, setInputDate] = useRecoilState(selectDate);
  const [inputTimeIst, setInputTimeIst] = useRecoilState(selectedTimeIst);
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatureFileUploadOpen, setIsFeatureFileUploadOpen] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const resetState = () => {
    setIsSubmitting(false);
    setIsFeatureFileUploadOpen(false);
    setAbortController(null);
  };

  useEffect(() => {
    resetState();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagOptions = await fetchTagsFromTagOnPost({
          postId: initialPost.id,
        });
        // console.log("Fetched tags:", tagOptions);
        setTags(tagOptions.map((tag) => capitalizeFirstLetter(tag)));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [setTags]);

  useEffect(() => {
    setPostFull(initialPost);

    const initializeDateAndTime = (publishDate: Date) => {
      // Extract the date portion
      setInputDate(publishDate);

      // Extract the time portion in HH:mm format
      const formattedTime = publishDate.toISOString().slice(11, 16); // e.g., "14:30"
      setInputTimeIst(formattedTime);
    };

    initializeDateAndTime(initialPost.publishDate || new Date());

    setPost({
      title: initialPost.title,
      content: initialPost.content,
      featureImage: initialPost.featureImage || "",
      postUrl: initialPost.postUrl,
      publishDate: initialPost.publishDate,
      excerpt: initialPost.excerpt,
      featured: initialPost.featured,
      tags: tags,
      authors: initialPost.author.id,
    });

    setMetadata({
      title: initialPost.metadataTitle,
      description: initialPost.metadataDescription,
      imageUrl: initialPost.metadataImageUrl || "",
      keywords: initialPost.metadataKeywords || "",
      authorName: initialPost.metadataAuthorName || "",
      canonicalUrl: initialPost.metadataCanonicalUrl || "",
      ogTitle: initialPost.metadataOgTitle || "",
      ogDescription: initialPost.metadataOgDescription || "",
      ogImage: initialPost.metadataOgImage || "",
      twitterCard: initialPost.metadataTwitterCard || "",
      twitterTitle: initialPost.metadataTwitterTitle || "",
      twitterDescription: initialPost.metadataTwitterDescription || "",
      twitterImage: initialPost.metadataTwitterImage || "",
    });

    setPostId(initialPost.id);
  }, [initialPost, setPostFull, setPost, setMetadata, tags, setPostId]);

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
