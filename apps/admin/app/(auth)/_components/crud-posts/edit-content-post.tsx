"use client";

import type { PostListType, Tags } from "@repo/actions";
import { fetchTagsFromTagOnPost } from "@repo/actions";
import {
  postDataState,
  postIdState,
  selectDate,
  postMetadataState,
  postState,
  selectedTimeIst,
  selectedTagsState,
} from "@repo/store";
import axios from "axios";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import { UploadComponent } from "@repo/ui";
import { NavBarPost } from "./navbar-post";
import { MetadataSidebar } from "./metadata-sidebar";

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

export function EditContentPost({
  initialPost,
}: {
  initialPost: PostListType;
}): JSX.Element {
  const pathname = usePathname();

  // Recoil States
  const [, setPostFull] = useRecoilState(postDataState);
  const [post, setPost] = useRecoilState(postState);
  const [, setMetadata] = useRecoilState(postMetadataState);
  const [, setPostId] = useRecoilState(postIdState);
  const [, setInputDate] = useRecoilState(selectDate);
  const [, setInputTimeIst] = useRecoilState(selectedTimeIst);

  // Local States
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatureFileUploadOpen, setIsFeatureFileUploadOpen] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [tags, setTags] = useState<Tags[]>([]);
  const [, setSelectedTags] = useRecoilState(selectedTagsState);

  const resetState = (): void => {
    setIsSubmitting(false);
    setIsFeatureFileUploadOpen(false);
    setAbortController(null);
  };

  useEffect(() => {
    resetState();
  }, []);

  useEffect(() => {
    const loadTags = async (): Promise<void> => {
      try {
        const tagOptions = await fetchTagsFromTagOnPost({
          postId: initialPost.id,
        });
        setTags(
          tagOptions.map((tag) => ({
            id: tag.tag.id,
            description: tag.tag.description ?? "",
            imageUrl: tag.tag.imageUrl ?? "",
            slug: tag.tag.slug,
            posts: tag.tag.posts,
          })),
        );
      } catch {
        // Error fetching tags
      }
    };
    void loadTags();
  }, [initialPost.id]);

  useEffect(() => {
    if (pathname.includes("/editor/")) {
      setPostFull(initialPost);

      const initializeDateAndTime = (publishDate: Date): void => {
        setInputDate(publishDate);

        const istTime = new Date(publishDate.getTime() + 5.5 * 60 * 60 * 1000);
        const hours = istTime.getUTCHours().toString().padStart(2, "0");
        const minutes = istTime.getUTCMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
        setInputTimeIst(formattedTime);
      };

      initializeDateAndTime(initialPost.publishDate ?? new Date());

      setPost({
        title: initialPost.title,
        content: initialPost.content,
        featureImage: initialPost.featureImage ?? "",
        postUrl: initialPost.postUrl,
        publishDate: initialPost.publishDate,
        excerpt: initialPost.excerpt,
        featured: initialPost.featured,
        tags,
        authors: initialPost.author.id,
      });

      setSelectedTags(tags);

      setMetadata({
        title: initialPost.metadataTitle,
        description: initialPost.metadataDescription,
        imageUrl: initialPost.metadataImageUrl,
        keywords: initialPost.metadataKeywords,
        authorName: initialPost.metadataAuthorName,
        canonicalUrl: initialPost.metadataCanonicalUrl,
        ogTitle: initialPost.metadataOgTitle,
        ogDescription: initialPost.metadataOgDescription,
        ogImage: initialPost.metadataOgImage,
        twitterCard: initialPost.metadataTwitterCard,
        twitterTitle: initialPost.metadataTwitterTitle,
        twitterDescription: initialPost.metadataTwitterDescription,
        twitterImage: initialPost.metadataTwitterImage,
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
        setMetadata((prev) => ({ ...prev, imageUrl: s3URL }));
        setMetadata((prev) => ({ ...prev, twitterImage: s3URL }));
        setMetadata((prev) => ({ ...prev, ogImage: s3URL }));
      } catch {
        // Error uploading file
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
