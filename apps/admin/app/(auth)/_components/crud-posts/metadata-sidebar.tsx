"use client";

import type { Tags } from "@repo/actions";
import {
  dateTimeValidation,
  fetchAllTagsWithPostCount,
  PostStatus,
} from "@repo/actions";
import {
  Link as LinkIcon,
  Trash2,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui";

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

interface CharacterCounterProps {
  value: string;
  recommended: number;
  max: number;
}

function CharacterCounter({
  value,
  recommended,
  max,
}: CharacterCounterProps): JSX.Element {
  const count = value ? value.length : 0;
  const getColor = (): string => {
    if (count === 0) return "text-muted-foreground";
    if (count > max) return "text-red-500";
    if (count > recommended) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <span className={`text-[12px] ${getColor()}`}>
      {count}/{recommended} (max {max})
    </span>
  );
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
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);

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
    <div className="border-l border-border w-[400px] fixed right-0 top-0 bottom-0 z-40 shadow-lg p-6 overflow-y-auto bg-card">
      <h2 className="text-2xl font-semibold mb-6 text-card-foreground">
        Post settings
      </h2>

      {/* Basic Info Section */}
      <div className="space-y-5">
        {/* Post URL */}
        <div className="space-y-2">
          <Label className="text-[13px] text-foreground" htmlFor="PostUrl">
            Post URL
          </Label>
          <div className="flex items-center bg-muted border-2 border-transparent focus-within:border-green-500 rounded-md">
            <LinkIcon className="text-muted-foreground ml-3 size-4" />
            <input
              className="flex h-10 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none bg-muted px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              id="PostUrl"
              onChange={handleUrlChange}
              placeholder="your-post-url"
              type="text"
              value={post.postUrl}
            />
          </div>
          <span className="text-[12px] text-muted-foreground block">
            {post.postUrl
              ? `www.deepshaswat.com/${post.postUrl}/`
              : "www.deepshaswat.com/"}
          </span>
          {errorDuplicateUrl !== null && (
            <span className="text-red-500 text-sm block">
              {errorDuplicateUrl}
            </span>
          )}
        </div>

        {/* Publish Date & Time */}
        <div className="space-y-2">
          <Label className="text-[13px] text-foreground" htmlFor="PublishDate">
            Publish Date & Time
          </Label>
          <div className="flex flex-row items-center gap-2">
            <DatePicker date={inputDate} setDate={setInputDate} />
            <div className="flex items-center bg-muted border-none rounded-md">
              <input
                className="flex h-10 w-24 rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none bg-muted px-3 py-2 text-sm"
                id="publishTime"
                onChange={handleTimeIstChange}
                placeholder="17:00"
                type="time"
                value={inputTimeIst}
              />
              <span className="text-muted-foreground mr-3 text-[10px]">
                IST
              </span>
            </div>
          </div>
          {validationError ? (
            <span className="text-red-500 text-sm">{validationError}</span>
          ) : null}
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[13px] text-foreground" htmlFor="Excerpt">
              Excerpt
            </Label>
            <CharacterCounter
              max={250}
              recommended={150}
              value={post.excerpt}
            />
          </div>
          <Textarea
            className="h-24 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm placeholder:text-muted-foreground bg-muted border-2 border-transparent focus-within:border-green-500 resize-none"
            id="Excerpt"
            onChange={handleExcerptChange}
            placeholder="Write a short description of your post..."
            value={post.excerpt}
          />
        </div>

        {/* Tags */}
        <TagsComponent
          newSelectedTags={handleTagsChange}
          oldSelectedTags={selectedTags}
        />

        {/* Featured Post Toggle */}
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
          <div className="flex flex-row items-center gap-3">
            <Star
              className="size-5"
              fill={post.featured ? "#22c55e" : "transparent"}
              stroke={post.featured ? "#22c55e" : "currentColor"}
            />
            <Label className="text-sm cursor-pointer" htmlFor="feature-post">
              Feature this post
            </Label>
          </div>
          <Switch
            checked={post.featured}
            className="data-[state=checked]:bg-green-500"
            id="feature-post"
            onCheckedChange={toggleFeaturePost}
          />
        </div>

        <Separator className="my-6" />

        {/* SEO Section - Collapsible */}
        <Collapsible onOpenChange={setIsSeoOpen} open={isSeoOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2">
            <span className="text-lg font-semibold text-foreground">
              SEO Settings
            </span>
            {isSeoOpen ? (
              <ChevronUp className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Meta Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  className="text-[13px] text-foreground"
                  htmlFor="MetaDataTitle"
                >
                  Meta Title
                </Label>
                <CharacterCounter
                  max={70}
                  recommended={50}
                  value={metadata.title}
                />
              </div>
              <input
                className="flex h-10 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm bg-muted border-2 border-transparent focus-within:border-green-500"
                id="MetaDataTitle"
                onChange={handleMetaTitleChange}
                placeholder="SEO title for search engines"
                type="text"
                value={metadata.title}
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  className="text-[13px] text-foreground"
                  htmlFor="MetaDataDescription"
                >
                  Meta Description
                </Label>
                <CharacterCounter
                  max={200}
                  recommended={160}
                  value={metadata.description}
                />
              </div>
              <Textarea
                className="h-20 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm bg-muted border-2 border-transparent focus-within:border-green-500 resize-none"
                id="MetaDataDescription"
                onChange={handleMetaDescriptionChange}
                placeholder="Brief description for search results..."
                value={metadata.description}
              />
            </div>

            {/* SEO Keywords */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  className="text-[13px] text-foreground"
                  htmlFor="SEOKeywords"
                >
                  Keywords
                </Label>
                <span
                  className={`text-[12px] ${keywordCount > 10 ? "text-yellow-500" : "text-green-500"}`}
                >
                  {keywordCount} words
                </span>
              </div>
              <Textarea
                className="h-16 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm bg-muted border-2 border-transparent focus-within:border-green-500 resize-none"
                id="SEOKeywords"
                onChange={(e) => {
                  setMetadata((prev) => ({
                    ...prev,
                    keywords: e.target.value,
                  }));
                }}
                placeholder="keyword1, keyword2, keyword3..."
                value={metadata.keywords}
              />
            </div>

            {/* Meta Image */}
            <div className="space-y-2">
              <Label className="text-[13px] text-foreground">
                Featured Image
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
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-4" />

        {/* Social Sharing Section - Collapsible */}
        <Collapsible onOpenChange={setIsSocialOpen} open={isSocialOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded-md px-2 -mx-2">
            <span className="text-lg font-semibold text-foreground">
              Social Sharing
            </span>
            {isSocialOpen ? (
              <ChevronUp className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Open Graph Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">
                Open Graph (Facebook, LinkedIn)
              </Label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-[13px] text-muted-foreground"
                    htmlFor="OgTitle"
                  >
                    OG Title
                  </Label>
                  <CharacterCounter
                    max={70}
                    recommended={50}
                    value={metadata.ogTitle}
                  />
                </div>
                <input
                  className="flex h-10 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm bg-muted border-2 border-transparent focus-within:border-green-500"
                  id="OgTitle"
                  onChange={handleOgTitleChange}
                  placeholder="Title for social sharing"
                  type="text"
                  value={metadata.ogTitle}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-[13px] text-muted-foreground"
                    htmlFor="OgDescription"
                  >
                    OG Description
                  </Label>
                  <CharacterCounter
                    max={200}
                    recommended={160}
                    value={metadata.ogDescription}
                  />
                </div>
                <Textarea
                  className="h-20 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm bg-muted border-2 border-transparent focus-within:border-green-500 resize-none"
                  id="OgDescription"
                  onChange={handleOgDescriptionChange}
                  placeholder="Description for social sharing..."
                  value={metadata.ogDescription}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] text-muted-foreground">
                  OG Image
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
            </div>

            <Separator className="my-4" />

            {/* Twitter Card Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">
                Twitter Card
              </Label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-[13px] text-muted-foreground"
                    htmlFor="TwitterTitle"
                  >
                    Twitter Title
                  </Label>
                  <CharacterCounter
                    max={70}
                    recommended={50}
                    value={metadata.twitterTitle}
                  />
                </div>
                <input
                  className="flex h-10 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm bg-muted border-2 border-transparent focus-within:border-green-500"
                  id="TwitterTitle"
                  onChange={handleTwitterTitleChange}
                  placeholder="Title for Twitter"
                  type="text"
                  value={metadata.twitterTitle}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    className="text-[13px] text-muted-foreground"
                    htmlFor="TwitterDescription"
                  >
                    Twitter Description
                  </Label>
                  <CharacterCounter
                    max={200}
                    recommended={160}
                    value={metadata.twitterDescription}
                  />
                </div>
                <Textarea
                  className="h-20 w-full rounded-md text-foreground ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm bg-muted border-2 border-transparent focus-within:border-green-500 resize-none"
                  id="TwitterDescription"
                  onChange={handleTwitterDescriptionChange}
                  placeholder="Description for Twitter..."
                  value={metadata.twitterDescription}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] text-muted-foreground">
                  Twitter Image
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
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-6" />

        {/* Actions */}
        <div className="pt-2">
          <Button className="w-full" variant="destructive-outline">
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
    <div className="space-y-2">
      <Label className="text-[13px] text-foreground">Tags</Label>
      <MultiSelect onValueChange={handleTagChange} value={selectedTagIds}>
        <MultiSelectTrigger className="bg-muted border-2 border-transparent text-foreground hover:border-border focus:border-green-500">
          <MultiSelectValue
            className="text-foreground"
            maxDisplay={3}
            placeholder="Select tags..."
          />
        </MultiSelectTrigger>

        <MultiSelectContent>
          <MultiSelectSearch
            className="border-border"
            placeholder="Search tags..."
          />
          <MultiSelectList>
            <MultiSelectGroup>
              {tags.map((tag) => (
                <MultiSelectItem key={tag.id} value={tag.id}>
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
