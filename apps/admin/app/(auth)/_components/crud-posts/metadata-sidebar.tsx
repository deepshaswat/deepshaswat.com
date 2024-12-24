"use client";

import React, { useEffect, useState } from "react";
import { Link as LinkIcon, Trash2, Star } from "lucide-react";

import Link from "next/link";
import { useRecoilState } from "recoil";

import {
  selectDate,
  postMetadataState,
  postState,
  selectedTimeIst,
  errorDuplicateUrlState,
  tagsState,
  selectedTagsState,
  savePostErrorState,
} from "@repo/store";

import {
  Label,
  DatePicker,
  Button,
  Textarea,
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  UploadComponent,
  Switch,
  Separator,
} from "@repo/ui";

import {
  dateTimeValidation,
  fetchAllTagsWithPostCount,
  Tags,
} from "@repo/actions";
import axios from "axios";

export function MetadataSidebar() {
  const [post, setPost] = useRecoilState(postState);
  const [metadata, setMetadata] = useRecoilState(postMetadataState);
  const [error, setError] = useRecoilState(savePostErrorState);
  const [errorDuplicateUrl, setErrorDuplicateUrl] = useRecoilState(
    errorDuplicateUrlState,
  );
  const [inputDate, setInputDate] = useRecoilState(selectDate);
  const [inputTimeIst, setInputTimeIst] = useRecoilState(selectedTimeIst);
  const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMetaImageUploadOpen, setIsMetaImageUploadOpen] = useState(false);
  const [isOgImageUploadOpen, setIsOgImageUploadOpen] = useState(false);
  const [isTwitterImageUploadOpen, setIsTwitterImageUploadOpen] =
    useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = reverseAndHyphenate(e.target.value);
    setPost({ ...post, postUrl: url });
    const canonicalUrl = "www.deepshaswat.com/" + url;
    setMetadata({ ...metadata, canonicalUrl: canonicalUrl });
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, excerpt: e.target.value });
  };

  const handleTimeIstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTimeIst(e.target.value);
  };

  const handleMetaTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, title: e.target.value });
  };

  const handleMetaDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMetadata({ ...metadata, description: e.target.value });
  };

  const handleOgTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, ogTitle: e.target.value });
  };

  const handleOgDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMetadata({ ...metadata, ogDescription: e.target.value });
  };

  const handleTwitterTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, twitterTitle: e.target.value });
  };

  const handleTwitterDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMetadata({ ...metadata, twitterDescription: e.target.value });
  };

  const toggleFeaturePost = () => {
    setPost({ ...post, featured: !post.featured });
  };

  const handleFileUpload = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      const controller = new AbortController();
      setAbortController(controller);

      try {
        const { data } = await axios.post(
          "/api/upload",
          {
            fileType: file.type,
          },
          {
            signal: controller.signal,
          },
        );

        const { uploadURL, s3URL } = data;

        await axios.put(uploadURL, file, {
          headers: {
            "Content-Type": file.type,
          },
          signal: controller.signal,
        });

        return s3URL;
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Upload cancelled");
        } else {
          console.error("Error uploading file:", error);
        }
      } finally {
        setIsSubmitting(false);
        setAbortController(null);
        closeAllUploaders();
      }
    }
  };

  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
      setIsSubmitting(false);
      setAbortController(null);
    }
  };

  // Separate close handlers for each uploader
  const closeMetaImageUpload = () => {
    setIsMetaImageUploadOpen(false);
    setIsSubmitting(false);
    setMetadata({ ...metadata, imageUrl: "" });
  };

  const closeOgImageUpload = () => {
    setIsOgImageUploadOpen(false);
    setIsSubmitting(false);
    setMetadata({ ...metadata, ogImage: "" });
  };

  const closeTwitterImageUpload = () => {
    setIsTwitterImageUploadOpen(false);
    setIsSubmitting(false);
    setMetadata({ ...metadata, twitterImage: "" });
  };

  // Helper function to close all uploaders
  const closeAllUploaders = () => {
    setIsMetaImageUploadOpen(false);
    setIsOgImageUploadOpen(false);
    setIsTwitterImageUploadOpen(false);
    setIsSubmitting(false);
  };

  // Modified handlers for each type of upload
  const handleMetaDataImageChange = async (file?: File) => {
    if (!file) {
      closeMetaImageUpload();
      return;
    }
    const url = await handleFileUpload(file);
    setMetadata({ ...metadata, imageUrl: url });
  };

  const handleOgImageChange = async (file?: File) => {
    if (!file) {
      closeOgImageUpload();
      return;
    }
    const url = await handleFileUpload(file);
    setMetadata({ ...metadata, ogImage: url });
  };

  const handleTwitterImageChange = async (file?: File) => {
    if (!file) {
      closeTwitterImageUpload();
      return;
    }
    const url = await handleFileUpload(file);
    setMetadata({ ...metadata, twitterImage: url });
  };

  useEffect(() => {
    const validateDate = async () => {
      const result = await dateTimeValidation(inputDate, inputTimeIst);

      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        const combinedDate = result.combinedDate as Date;
        setPost({ ...post, publishDate: combinedDate });
      }
    };

    validateDate();
  }, [inputDate, inputTimeIst]);

  useEffect(() => {
    if (errorDuplicateUrl) {
      setTimeout(() => {
        setErrorDuplicateUrl(null);
      }, 5000);
    }
  }, [errorDuplicateUrl]);

  const keywordCount = metadata.keywords
    ? metadata.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0).length
    : 0;

  const reverseAndHyphenate = (item: string) => {
    const url = item.toLowerCase().split(" ").join("-");
    const trimmedItem = url.trim();
    return trimmedItem;
  };

  const handleTagsChange = (tags: Tags[]) => {
    // First update selectedTags state
    setSelectedTags(tags);

    // Then update post.tags state
    setPost((prevPost) => ({
      ...prevPost,
      tags: tags, // Directly set the new tags instead of appending
    }));
  };

  return (
    <div className="border-l-[1px] border-neutral-700 w-[400px] fixed right-0 top-0 bottom-0 z-40 shadow-lg p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Post settings</h2>

      <div className="space-y-4 mt-8">
        <div className="space-y-2">
          <Label htmlFor="PostUrl" className="text-[13px] text-neutral-200">
            Post URL
          </Label>
          <div className="flex items-center bg-neutral-700 border-2 border-transparent focus-within:border-green-500 rounded-md">
            <LinkIcon className="text-neutral-400 ml-2 size-4" />
            <input
              id="PostUrl"
              type="text"
              placeholder="Post URL"
              value={post.postUrl}
              onChange={handleUrlChange}
              className="flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {!post.postUrl && (
            <span className="text-[12px] text-neutral-500">
              www.deepshaswat.com/
            </span>
          )}
          {!errorDuplicateUrl && post.postUrl && (
            <span className="text-[12px] text-neutral-500">
              www.deepshaswat.com/{post.postUrl}/
            </span>
          )}
          {errorDuplicateUrl && (
            <span className="text-red-500 text-sm mt-1">
              {errorDuplicateUrl}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="PublishDate" className="text-[13px] text-neutral-200">
            Publish Date
          </Label>
          <div className="flex flex-row items-center">
            <DatePicker date={inputDate} setDate={setInputDate} />
            <div className="flex flex-row items-center group">
              <div className="ml-2 flex items-center bg-neutral-700 group-hover:bg-neutral-900 border-none rounded-md">
                <input
                  id="publishTime"
                  type="time"
                  placeholder="17:00"
                  value={inputTimeIst}
                  onChange={handleTimeIstChange}
                  className="flex h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 group-hover:bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-neutral-400 items-center mr-4 text-[10px]">
                  IST
                </span>
              </div>
            </div>
          </div>
          {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>

        <div>
          <Label htmlFor="Excerpt" className="text-[13px] text-neutral-200">
            Excerpt
          </Label>
          <Textarea
            id="Excerpt"
            placeholder="Write a short description of your post"
            value={post.excerpt}
            onChange={handleExcerptChange}
            className="flex mt-4 h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 150 characters. You've used{" "}
            <span
              className={
                post.excerpt.length === 0
                  ? ""
                  : post.excerpt.length <= 250
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {post.excerpt.length}
            </span>
            .
          </div>
        </div>
        {/* <div className='mt-4'> */}
        <TagsComponent
          oldSelectedTags={selectedTags}
          newSelectedTags={handleTagsChange}
        />
        {/* </div> */}
        <div className="flex items-center justify-between space-x-2 bg-neutral-700 p-4 rounded-md ">
          <div className="flex flex-row items-center gap-2">
            <Star
              className="size-5"
              fill={post.featured ? "green" : "transparent"}
              stroke={post.featured ? "green" : "white"}
            />
            <Label htmlFor="feature-post">Feature this post</Label>
          </div>
          <Switch
            id="feature-post"
            checked={post.featured}
            onCheckedChange={toggleFeaturePost}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        <div className="mt-4">
          <Label className="text-2xl font-semibold text-neutral-200 ">
            SEO & Social
          </Label>
        </div>
        <Separator />
        <div>
          <Label htmlFor="SEOKeywords" className="text-[13px] text-neutral-200">
            SEO Keywords
          </Label>
          <Textarea
            id="SEOKeywords"
            placeholder="SEO Keywords"
            value={metadata.keywords}
            onChange={(e) =>
              setMetadata((prev) => ({ ...prev, keywords: e.target.value }))
            }
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 10 words (Max: 500 characters). <br /> You've used{" "}
            <span
              className={
                keywordCount === 0
                  ? ""
                  : metadata.keywords.length <= 100
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {keywordCount}
            </span>
            .
          </div>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="MetaDataTitle"
            className="text-[13px] text-neutral-200"
          >
            Meta Data Title
          </Label>
          <input
            id="MetaDataTitle"
            type="text"
            placeholder="Meta Data Title"
            value={metadata.title}
            onChange={handleMetaTitleChange}
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 50 characters. You've used{" "}
            <span
              className={
                metadata.title.length === 0
                  ? ""
                  : metadata.title.length <= 100
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {metadata.title.length}
            </span>
            .
          </div>
        </div>
        <div>
          <Label
            htmlFor="MetaDataDescription"
            className="text-[13px] text-neutral-200"
          >
            Meta Data Description
          </Label>
          <Textarea
            id="MetaDataDescription"
            placeholder="Meta Data Description"
            value={metadata.description}
            onChange={handleMetaDescriptionChange}
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 160 characters. You've used{" "}
            <span
              className={
                metadata.description.length === 0
                  ? ""
                  : metadata.description.length <= 500
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {metadata.description.length}
            </span>
            .
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Label
            htmlFor="MetaDataImage"
            className="text-[13px] text-neutral-200 mt-4"
          >
            Meta Data Image Upload
          </Label>
          <UploadComponent
            imageUrl={metadata.imageUrl}
            isSubmitting={isSubmitting}
            onChange={handleMetaDataImageChange}
            isFileUploadOpen={isMetaImageUploadOpen}
            toggleFileUpload={() => setIsMetaImageUploadOpen((prev) => !prev)}
            onCancel={handleCancelUpload}
            text="Add an image"
            buttonVariant="metadata"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="OgTitle" className="text-[13px] text-neutral-200">
            OG Title
          </Label>
          <input
            id="OgTitle"
            type="text"
            placeholder="OG Title"
            value={metadata.ogTitle}
            onChange={handleOgTitleChange}
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 50 characters. You've used{" "}
            <span
              className={
                metadata.ogTitle.length === 0
                  ? ""
                  : metadata.ogTitle.length <= 100
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {metadata.ogTitle.length}
            </span>
            .
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="OgDescription"
            className="text-[13px] text-neutral-200"
          >
            OG Description
          </Label>
          <Textarea
            id="OgDescription"
            placeholder="OG Description"
            value={metadata.ogDescription}
            onChange={handleOgDescriptionChange}
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 160 characters. You've used{" "}
            <span
              className={
                metadata.ogDescription.length === 0
                  ? ""
                  : metadata.ogDescription.length <= 500
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {metadata.ogDescription.length}
            </span>
            .
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Label
            htmlFor="OgImage"
            className="text-[13px] text-neutral-200 mt-4"
          >
            OG Image URL
          </Label>
          <UploadComponent
            imageUrl={metadata.ogImage}
            isSubmitting={isSubmitting}
            onChange={handleOgImageChange}
            isFileUploadOpen={isOgImageUploadOpen}
            toggleFileUpload={() => setIsOgImageUploadOpen((prev) => !prev)}
            onCancel={handleCancelUpload}
            text="Add an image"
            buttonVariant="metadata"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="TwitterTitle"
            className="text-[13px] text-neutral-200"
          >
            Twitter Title
          </Label>
          <input
            id="TwitterTitle"
            type="text"
            placeholder="Twitter Title"
            value={metadata.twitterTitle}
            onChange={handleTwitterTitleChange}
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 50 characters. You've used{" "}
            <span
              className={
                metadata.twitterTitle.length === 0
                  ? ""
                  : metadata.twitterTitle.length <= 60
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {metadata.twitterTitle.length}
            </span>
            .
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="TwitterDescription"
            className="text-[13px] text-neutral-200"
          >
            Twitter Description
          </Label>
          <Textarea
            id="TwitterDescription"
            placeholder="Twitter Description"
            value={metadata.twitterDescription}
            onChange={handleTwitterDescriptionChange}
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 160 characters. You've used{" "}
            <span
              className={
                metadata.twitterDescription.length === 0
                  ? ""
                  : metadata.twitterDescription.length <= 200
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {metadata.twitterDescription.length}
            </span>
            .
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Label
            htmlFor="TwitterImage"
            className="text-[13px] text-neutral-200 mt-4"
          >
            Twitter Image URL
          </Label>
          <UploadComponent
            imageUrl={metadata.twitterImage}
            isSubmitting={isSubmitting}
            onChange={handleTwitterImageChange}
            isFileUploadOpen={isTwitterImageUploadOpen}
            toggleFileUpload={() =>
              setIsTwitterImageUploadOpen((prev) => !prev)
            }
            onCancel={handleCancelUpload}
            text="Add an image"
            buttonVariant="metadata"
          />
        </div>

        <div>
          <Button variant="destructive-outline" className="w-full mt-4">
            <Trash2 className="mr-2 size-4" /> Delete Post
          </Button>
        </div>
      </div>
    </div>
  );
}
interface TagsProps {
  oldSelectedTags: Tags[];
  newSelectedTags: (value: Tags[]) => void;
}

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

// TagsComponent
export const TagsComponent: React.FC<TagsProps> = ({
  oldSelectedTags,
  newSelectedTags,
}) => {
  const [tags, setTags] = useRecoilState(tagsState);
  const [currentSelectedTags, setCurrentSelectedTags] =
    useState<Tags[]>(oldSelectedTags);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagOptions = await fetchAllTagsWithPostCount();
        setTags(tagOptions);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [setTags]);

  useEffect(() => {
    setCurrentSelectedTags(oldSelectedTags);
  }, [oldSelectedTags]);

  const handleTagChange = (values: string[]) => {
    const updatedTags = values
      .map((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        if (!tag) return null;
        return {
          id: tag.id,
          slug: tag.slug,
          description: tag.description,
          imageUrl: tag.imageUrl,
          posts: tag.posts,
        };
      })
      .filter((tag): tag is Tags => tag !== null);

    setCurrentSelectedTags(updatedTags);
    newSelectedTags(updatedTags);
  };

  const selectedTagIds = currentSelectedTags.map((tag) => tag.id);

  return (
    <div className="space-y-4">
      <Label className="text-[13px] mb-4 block">Tags</Label>
      <MultiSelect value={selectedTagIds} onValueChange={handleTagChange}>
        <MultiSelectTrigger className="bg-neutral-700 border-2 border-transparent focus:border-green-500">
          <MultiSelectValue placeholder="Select tags" />
        </MultiSelectTrigger>
        <MultiSelectContent className="bg-neutral-800">
          <MultiSelectSearch
            placeholder="Search tags..."
            className="border-neutral-700"
          />
          <MultiSelectList>
            <MultiSelectGroup>
              {tags.map((tag) => (
                <MultiSelectItem
                  key={tag.id}
                  value={tag.id}
                  className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  {capitalizeFirstLetter(tag.slug)}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
};
