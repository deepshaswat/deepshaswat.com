"use client";

import type { Tags } from "@repo/actions";
import {
  dateTimeValidation,
  fetchAllTagsWithPostCount,
  PostStatus,
} from "@repo/actions";
import { Link as LinkIcon, Trash2, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import {
  selectDate,
  postMetadataState,
  postState,
  selectedTimeIst,
  errorDuplicateUrlState,
  tagsState,
  selectedTagsState,
  savePostErrorState,
  postDataState,
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

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

function getCharCountClass(length: number, limit: number): string {
  if (length === 0) return "";
  return length <= limit ? "text-green-500" : "text-red-500";
}

export function MetadataSidebar(): JSX.Element {
  const [post, setPost] = useRecoilState(postState);
  const [postFull] = useRecoilState(postDataState);
  const [metadata, setMetadata] = useRecoilState(postMetadataState);
  const [validationError, setValidationError] =
    useRecoilState(savePostErrorState);
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const url = reverseAndHyphenate(e.target.value);
    setPost({ ...post, postUrl: url });
    const canonicalUrl = `www.deepshaswat.com/${url}`;
    setMetadata({ ...metadata, canonicalUrl });
  };

  const handleExcerptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setPost((prev) => ({ ...prev, excerpt: e.target.value }));
  };

  const handleTimeIstChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInputTimeIst(e.target.value);
  };

  const handleMetaTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMetadata((prev) => ({
      ...prev,
      title: e.target.value,
      ogTitle: e.target.value,
      twitterTitle: e.target.value,
    }));
  };

  const handleMetaDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setMetadata((prev) => ({
      ...prev,
      description: e.target.value,
      ogDescription: e.target.value,
      twitterDescription: e.target.value,
    }));
  };

  const handleOgTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMetadata((prev) => ({
      ...prev,
      ogTitle: e.target.value,
    }));
  };

  const handleOgDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setMetadata((prev) => ({
      ...prev,
      ogDescription: e.target.value,
    }));
  };

  const handleTwitterTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMetadata((prev) => ({
      ...prev,
      twitterTitle: e.target.value,
    }));
  };

  const handleTwitterDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setMetadata((prev) => ({
      ...prev,
      twitterDescription: e.target.value,
    }));
  };

  const toggleFeaturePost = (): void => {
    setPost({ ...post, featured: !post.featured });
  };

  const handleFileUpload = async (file?: File): Promise<string | undefined> => {
    if (file) {
      setIsSubmitting(true);
      const controller = new AbortController();
      setAbortController(controller);

      try {
        const { data } = await axios.post<UploadResponse>(
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
      } catch {
        // Upload cancelled or failed
      } finally {
        setIsSubmitting(false);
        setAbortController(null);
        closeAllUploaders();
      }
    }
    return undefined;
  };

  const handleCancelUpload = (): void => {
    if (abortController) {
      abortController.abort();
      setIsSubmitting(false);
      setAbortController(null);
    }
  };

  const closeMetaImageUpload = (): void => {
    setIsMetaImageUploadOpen(false);
    setIsSubmitting(false);
    setMetadata((prev) => ({ ...prev, imageUrl: "" }));
  };

  const closeOgImageUpload = (): void => {
    setIsOgImageUploadOpen(false);
    setIsSubmitting(false);
    setMetadata((prev) => ({ ...prev, ogImage: "" }));
  };

  const closeTwitterImageUpload = (): void => {
    setIsTwitterImageUploadOpen(false);
    setIsSubmitting(false);
    setMetadata((prev) => ({ ...prev, twitterImage: "" }));
  };

  const closeAllUploaders = (): void => {
    setIsMetaImageUploadOpen(false);
    setIsOgImageUploadOpen(false);
    setIsTwitterImageUploadOpen(false);
    setIsSubmitting(false);
  };

  const handleMetaDataImageChange = async (file?: File): Promise<void> => {
    if (!file) {
      closeMetaImageUpload();
      return;
    }
    const url = await handleFileUpload(file);
    if (url) {
      setMetadata((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const handleOgImageChange = async (file?: File): Promise<void> => {
    if (!file) {
      closeOgImageUpload();
      return;
    }
    const url = await handleFileUpload(file);
    if (url) {
      setMetadata((prev) => ({ ...prev, ogImage: url }));
    }
  };

  const handleTwitterImageChange = async (file?: File): Promise<void> => {
    if (!file) {
      closeTwitterImageUpload();
      return;
    }
    const url = await handleFileUpload(file);
    if (url) {
      setMetadata((prev) => ({ ...prev, twitterImage: url }));
    }
  };

  useEffect(() => {
    const validateDate = async (): Promise<void> => {
      const result = await dateTimeValidation(inputDate, inputTimeIst);

      if (
        (postFull?.status === PostStatus.DRAFT ||
          postFull?.status === PostStatus.SCHEDULED) &&
        result.error
      ) {
        setValidationError(result.error);
      } else if (result.combinedDate) {
        setValidationError(null);
        const combinedDate = result.combinedDate;
        setPost((prev) => ({ ...prev, publishDate: combinedDate }));
      }
    };

    void validateDate();
  }, [inputDate, inputTimeIst, postFull?.status, setValidationError, setPost]);

  useEffect(() => {
    if (errorDuplicateUrl) {
      setTimeout(() => {
        setErrorDuplicateUrl(null);
      }, 5000);
    }
  }, [errorDuplicateUrl, setErrorDuplicateUrl]);

  const keywordCount = metadata.keywords
    ? metadata.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0).length
    : 0;

  const reverseAndHyphenate = (item: string): string => {
    const url = item.toLowerCase().split(" ").join("-");
    const trimmedItem = url.trim();
    return trimmedItem;
  };

  const handleTagsChange = (newTags: Tags[]): void => {
    setSelectedTags(newTags);

    setPost((prevPost) => ({
      ...prevPost,
      tags: newTags,
    }));
  };

  return (
    <div className="border-l-[1px] border-neutral-700 w-[400px] fixed right-0 top-0 bottom-0 z-40 shadow-lg p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Post settings</h2>

      <div className="space-y-4 mt-8">
        <div className="space-y-2">
          <Label className="text-[13px] text-neutral-200" htmlFor="PostUrl">
            Post URL
          </Label>
          <div className="flex items-center bg-neutral-700 border-2 border-transparent focus-within:border-green-500 rounded-md">
            <LinkIcon className="text-neutral-400 ml-2 size-4" />
            <input
              className="flex h-8 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              id="PostUrl"
              onChange={handleUrlChange}
              placeholder="Post URL"
              type="text"
              value={post.postUrl}
            />
          </div>

          {post.postUrl === "" && (
            <span className="text-[12px] text-neutral-500">
              www.deepshaswat.com/
            </span>
          )}
          {!errorDuplicateUrl && post.postUrl !== "" && (
            <span className="text-[12px] text-neutral-500">
              www.deepshaswat.com/{post.postUrl}/
            </span>
          )}
          {errorDuplicateUrl !== null && (
            <span className="text-red-500 text-sm mt-1">
              {errorDuplicateUrl}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <Label className="text-[13px] text-neutral-200" htmlFor="PublishDate">
            Publish Date
          </Label>
          <div className="flex flex-row items-center">
            <DatePicker date={inputDate} setDate={setInputDate} />
            <div className="flex flex-row items-center group">
              <div className="ml-2 flex items-center bg-neutral-700 group-hover:bg-neutral-900 border-none rounded-md">
                <input
                  className="flex h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 group-hover:bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  id="publishTime"
                  onChange={handleTimeIstChange}
                  placeholder="17:00"
                  type="time"
                  value={inputTimeIst}
                />
                <span className="text-neutral-400 items-center mr-4 text-[10px]">
                  IST
                </span>
              </div>
            </div>
          </div>
          {validationError ? (
            <span className="text-red-500 text-sm mt-1">{validationError}</span>
          ) : null}
        </div>

        <div>
          <Label className="text-[13px] text-neutral-200" htmlFor="Excerpt">
            Excerpt
          </Label>
          <Textarea
            className="flex mt-4 h-8 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="Excerpt"
            onChange={handleExcerptChange}
            placeholder="Write a short description of your post"
            value={post.excerpt}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 150 characters. You&apos;ve used{" "}
            <span className={getCharCountClass(post.excerpt.length, 250)}>
              {post.excerpt.length}
            </span>
            .
          </div>
        </div>
        {/* <div className='mt-4'> */}
        <TagsComponent
          newSelectedTags={handleTagsChange}
          oldSelectedTags={selectedTags}
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
            checked={post.featured}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=unchecked]:bg-neutral-200 data-[state=unchecked]:border-neutral-200"
            id="feature-post"
            onCheckedChange={toggleFeaturePost}
          />
        </div>
        <div className="mt-4">
          <Label className="text-2xl font-semibold text-neutral-200 ">
            SEO & Social
          </Label>
        </div>
        <Separator />
        <div>
          <Label className="text-[13px] text-neutral-200" htmlFor="SEOKeywords">
            SEO Keywords
          </Label>
          <Textarea
            className="flex mt-4 h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="SEOKeywords"
            onChange={(e) => {
              setMetadata((prev) => ({ ...prev, keywords: e.target.value }));
            }}
            placeholder="SEO Keywords"
            value={metadata.keywords}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 10 words (Max: 500 characters). <br /> You&apos;ve used{" "}
            <span className={getCharCountClass(keywordCount, 100)}>
              {keywordCount}
            </span>
            .
          </div>
        </div>
        <div className="space-y-2">
          <Label
            className="text-[13px] text-neutral-200"
            htmlFor="MetaDataTitle"
          >
            Meta Data Title
          </Label>
          <input
            className="flex mt-4 h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="MetaDataTitle"
            onChange={handleMetaTitleChange}
            placeholder="Meta Data Title"
            type="text"
            value={metadata.title}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 50 characters. You&apos;ve used{" "}
            <span className={getCharCountClass(metadata.title.length, 100)}>
              {metadata.title.length}
            </span>
            .
          </div>
        </div>
        <div>
          <Label
            className="text-[13px] text-neutral-200"
            htmlFor="MetaDataDescription"
          >
            Meta Data Description
          </Label>
          <Textarea
            className="flex mt-4 h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="MetaDataDescription"
            onChange={handleMetaDescriptionChange}
            placeholder="Meta Data Description"
            value={metadata.description}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 160 characters. You&apos;ve used{" "}
            <span
              className={getCharCountClass(metadata.description.length, 500)}
            >
              {metadata.description.length}
            </span>
            .
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Label
            className="text-[13px] text-neutral-200 mt-4"
            htmlFor="MetaDataImage"
          >
            Meta Data Image Upload
          </Label>
          <UploadComponent
            buttonVariant="metadata"
            imageUrl={metadata.imageUrl}
            isFileUploadOpen={isMetaImageUploadOpen}
            isSubmitting={isSubmitting}
            onCancel={handleCancelUpload}
            onChange={(file) => {
              void handleMetaDataImageChange(file);
            }}
            text="Add an image"
            toggleFileUpload={() => {
              setIsMetaImageUploadOpen((prev) => !prev);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[13px] text-neutral-200" htmlFor="OgTitle">
            OG Title
          </Label>
          <input
            className="flex mt-4 h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="OgTitle"
            onChange={handleOgTitleChange}
            placeholder="OG Title"
            type="text"
            value={metadata.ogTitle}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 50 characters. You&apos;ve used{" "}
            <span className={getCharCountClass(metadata.ogTitle.length, 100)}>
              {metadata.ogTitle.length}
            </span>
            .
          </div>
        </div>

        <div className="space-y-2">
          <Label
            className="text-[13px] text-neutral-200"
            htmlFor="OgDescription"
          >
            OG Description
          </Label>
          <Textarea
            className="flex mt-4 h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="OgDescription"
            onChange={handleOgDescriptionChange}
            placeholder="OG Description"
            value={metadata.ogDescription}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 160 characters. You&apos;ve used{" "}
            <span
              className={getCharCountClass(metadata.ogDescription.length, 500)}
            >
              {metadata.ogDescription.length}
            </span>
            .
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Label
            className="text-[13px] text-neutral-200 mt-4"
            htmlFor="OgImage"
          >
            OG Image URL
          </Label>
          <UploadComponent
            buttonVariant="metadata"
            imageUrl={metadata.ogImage}
            isFileUploadOpen={isOgImageUploadOpen}
            isSubmitting={isSubmitting}
            onCancel={handleCancelUpload}
            onChange={(file) => {
              void handleOgImageChange(file);
            }}
            text="Add an image"
            toggleFileUpload={() => {
              setIsOgImageUploadOpen((prev) => !prev);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label
            className="text-[13px] text-neutral-200"
            htmlFor="TwitterTitle"
          >
            Twitter Title
          </Label>
          <input
            className="flex mt-4 h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="TwitterTitle"
            onChange={handleTwitterTitleChange}
            placeholder="Twitter Title"
            type="text"
            value={metadata.twitterTitle}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 50 characters. You&apos;ve used{" "}
            <span
              className={getCharCountClass(metadata.twitterTitle.length, 60)}
            >
              {metadata.twitterTitle.length}
            </span>
            .
          </div>
        </div>

        <div className="space-y-2">
          <Label
            className="text-[13px] text-neutral-200"
            htmlFor="TwitterDescription"
          >
            Twitter Description
          </Label>
          <Textarea
            className="flex mt-4 h-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500"
            id="TwitterDescription"
            onChange={handleTwitterDescriptionChange}
            placeholder="Twitter Description"
            value={metadata.twitterDescription}
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 160 characters. You&apos;ve used{" "}
            <span
              className={getCharCountClass(
                metadata.twitterDescription.length,
                200,
              )}
            >
              {metadata.twitterDescription.length}
            </span>
            .
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Label
            className="text-[13px] text-neutral-200 mt-4"
            htmlFor="TwitterImage"
          >
            Twitter Image URL
          </Label>
          <UploadComponent
            buttonVariant="metadata"
            imageUrl={metadata.twitterImage}
            isFileUploadOpen={isTwitterImageUploadOpen}
            isSubmitting={isSubmitting}
            onCancel={handleCancelUpload}
            onChange={(file) => {
              void handleTwitterImageChange(file);
            }}
            text="Add an image"
            toggleFileUpload={() => {
              setIsTwitterImageUploadOpen((prev) => !prev);
            }}
          />
        </div>

        <div>
          <Button className="w-full mt-4" variant="destructive-outline">
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

function capitalizeFirstLetter(item: string): string {
  return item
    .split("-")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase(),
    )
    .join(" ");
}

export function TagsComponent({
  oldSelectedTags,
  newSelectedTags,
}: TagsProps): JSX.Element {
  const [tags, setTags] = useRecoilState(tagsState);
  const [currentSelectedTags, setCurrentSelectedTags] =
    useState<Tags[]>(oldSelectedTags);

  useEffect(() => {
    const fetchTags = async (): Promise<void> => {
      try {
        const tagOptions = await fetchAllTagsWithPostCount();
        setTags(tagOptions);
      } catch {
        // Error fetching tags
      }
    };

    void fetchTags();
  }, [setTags]);

  useEffect(() => {
    setCurrentSelectedTags(oldSelectedTags);
  }, [oldSelectedTags]);

  const handleTagChange = (values: string[]): void => {
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
      <MultiSelect onValueChange={handleTagChange} value={selectedTagIds}>
        <MultiSelectTrigger className="bg-neutral-700 border-2 border-transparent text-neutral-200">
          <MultiSelectValue
            className="text-neutral-200"
            maxDisplay={2}
            placeholder="Select tags"
          />
        </MultiSelectTrigger>

        <MultiSelectContent className="">
          <MultiSelectSearch
            className="border-neutral-700"
            placeholder="Search tags..."
          />
          <MultiSelectList>
            <MultiSelectGroup>
              {tags.map((tag) => (
                <MultiSelectItem className="" key={tag.id} value={tag.id}>
                  {capitalizeFirstLetter(tag.slug)}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
}
