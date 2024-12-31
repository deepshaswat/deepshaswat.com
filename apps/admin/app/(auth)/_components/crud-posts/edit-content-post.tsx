"use client";

import { fetchTagsFromTagOnPost, PostListType, Tags } from "@repo/actions";
import { postDataState, postIdState } from "@repo/store";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { NavBarPost } from "./navbar-post";
import { UploadComponent } from "@repo/ui";
import {
  selectDate,
  postMetadataState,
  postState,
  selectedTimeIst,
  selectedTagsState,
} from "@repo/store";
import { usePathname } from "next/navigation";
import { MetadataSidebar } from "./metadata-sidebar";

const capitalizeFirstLetter = (item: string) => {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase(),
    )
    .join(" ");
};

export const EditContentPost = ({
  initialPost,
}: {
  initialPost: PostListType;
}) => {
  const pathname = usePathname();

  // Recoil States
  const [postFull, setPostFull] = useRecoilState(postDataState);
  const [post, setPost] = useRecoilState(postState);
  const [metadata, setMetadata] = useRecoilState(postMetadataState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [inputDate, setInputDate] = useRecoilState(selectDate);
  const [inputTimeIst, setInputTimeIst] = useRecoilState(selectedTimeIst);

  // Local States
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatureFileUploadOpen, setIsFeatureFileUploadOpen] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [tags, setTags] = useState<Tags[]>([]);
  const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);

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
        setTags(
          tagOptions.map((tag) => ({
            id: tag.tag.id,
            description: tag.tag.description ?? "",
            imageUrl: tag.tag.imageUrl ?? "",
            slug: tag.tag.slug,
            posts: tag.tag.posts,
          })),
        );
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [setTags]);

  useEffect(() => {
    if (pathname.includes("/editor/")) {
      setPostFull(initialPost);

      const initializeDateAndTime = (publishDate: Date) => {
        // Extract the date portion
        setInputDate(publishDate);

        // Extract the time portion in HH:mm format

        const istTime = new Date(publishDate.getTime() + 5.5 * 60 * 60 * 1000);
        const hours = istTime.getUTCHours().toString().padStart(2, "0");
        const minutes = istTime.getUTCMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
        setInputTimeIst(formattedTime);
        // console.log("formattedTime", formattedTime);
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

      setSelectedTags(post.tags);

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
    }
  }, [
    initialPost,
    setPostFull,
    setPost,
    setMetadata,
    tags,
    setPostId,
    setTags,
    pathname,
    setSelectedTags,
    setInputDate,
    setInputTimeIst,
  ]);

  const Editor = useMemo(
    () => dynamic(() => import("./editor"), { ssr: false }),
    [],
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
        setMetadata((prev) => ({ ...prev, imageUrl: s3URL }));
        setMetadata((prev) => ({ ...prev, twitterImage: s3URL }));
        setMetadata((prev) => ({ ...prev, ogImage: s3URL }));
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
    <div className="flex">
      <div className={`flex-1 ${isOpen ? " mr-[400px]" : ""}`}>
        <NavBarPost isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className="lg:mx-[180px]">
          <div className="ml-10 max-w-screen-md lg:max-w-screen-lg">
            <UploadComponent
              imageUrl={post.featureImage}
              isSubmitting={isSubmitting}
              onChange={handleFeatureImageChange}
              isFileUploadOpen={isFeatureFileUploadOpen}
              toggleFileUpload={toggleFeatureImageUpload}
              text="Add feature image"
              className="text-neutral-400 font-light !no-underline hover:text-neutral-200 mt-10"
              buttonVariant="link"
              onCancel={handleCancelUpload}
            />
          </div>
          <div>
            <input
              value={post.title}
              onChange={handleMainInputChange}
              placeholder="Post title"
              className="w-full ml-12 mt-4 bg-transparent text-5xl font-semibold outline-none ring-0 placeholder:text-neutral-700"
            />
          </div>
          <div className="mt-8">
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
