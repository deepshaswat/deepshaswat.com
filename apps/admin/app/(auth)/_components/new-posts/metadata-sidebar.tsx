"use client";

import React, { useEffect, useState } from "react";
import { Link as LinkIcon, Trash2, Plus, Star } from "lucide-react";

import Link from "next/link";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  selectDate,
  postMetadataState,
  postState,
  selectedTagsState,
  selectedTimeIst,
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

import { dateTimeValidation, fetchAllTagsWithPostCount } from "@repo/actions";
import axios from "axios";

export function MetadataSidebar() {
  const [post, setPost] = useRecoilState(postState);
  const [metadata, setMetadata] = useRecoilState(postMetadataState);
  const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
  const [error, setError] = useState<string | null>("");
  const [inputDate, setInputDate] = useRecoilState(selectDate);
  const [inputTimeIst, setInputTimeIst] = useRecoilState(selectedTimeIst);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, postUrl: e.target.value });
    setMetadata({ ...metadata, canonicalUrl: e.target.value });
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
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMetadata({ ...metadata, description: e.target.value });
  };

  const handleOgTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, ogTitle: e.target.value });
  };

  const handleOgDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMetadata({ ...metadata, ogDescription: e.target.value });
  };

  const handleOgImageChange = async (file?: File) => {
    const url = await handleFileUpload(file);
    setMetadata({ ...metadata, ogImage: url });
  };

  const handleTwitterTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, twitterTitle: e.target.value });
  };

  const handleTwitterDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMetadata({ ...metadata, twitterDescription: e.target.value });
  };

  const handleTwitterImageChange = async (file?: File) => {
    const url = await handleFileUpload(file);
    setMetadata({ ...metadata, twitterImage: url });
  };

  const toggleFeaturePost = () => {
    setPost({ ...post, featured: !post.featured });
  };

  const toggleFileUpload = () => {
    setIsFileUploadOpen((prev) => !prev);
  };

  const handleFileUpload = async (file?: File) => {
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
        return s3URL;
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

  const handleMetaDataImageChange = async (file?: File) => {
    const url = await handleFileUpload(file);
    setMetadata({ ...metadata, imageUrl: url });
  };

  const onClose = () => {
    // setMetadata({ ...metadata, imageUrl: "" });
    setIsSubmitting(false);
    setIsFileUploadOpen(false);
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

  return (
    <div className='border-l-[1px] border-neutral-700 w-[400px] fixed right-0 top-0 bottom-0 z-40 shadow-lg p-6 overflow-y-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Post settings</h2>

      <div className='space-y-4 mt-8'>
        <div className='space-y-2'>
          <Label htmlFor='PostUrl' className='text-[13px] text-neutral-200'>
            Post URL
          </Label>
          <div className='flex items-center bg-neutral-700 border-2 border-transparent focus-within:border-green-500 rounded-md'>
            <LinkIcon className='text-neutral-400 ml-2 size-4' />
            <input
              id='PostUrl'
              type='text'
              placeholder='Post URL'
              value={post.postUrl}
              onChange={handleUrlChange}
              className='flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>

          {!post.postUrl && (
            <span className='text-[12px] text-neutral-500'>
              www.deepshaswat.com/
            </span>
          )}
          {post.postUrl && (
            <span className='text-[12px] text-neutral-500'>
              www.deepshaswat.com/{post.postUrl}/
            </span>
          )}
        </div>
        <div className='flex flex-col gap-2 mb-4'>
          <Label htmlFor='PublishDate' className='text-[13px] text-neutral-200'>
            Publish Date
          </Label>
          <div className='flex flex-row items-center'>
            <DatePicker date={inputDate} setDate={setInputDate} />
            <div className='flex flex-row items-center group'>
              <div className='ml-2 flex items-center bg-neutral-700 group-hover:bg-neutral-900 border-none rounded-md'>
                <input
                  id='publishTime'
                  type='text'
                  placeholder='17:00'
                  value={inputTimeIst}
                  onChange={handleTimeIstChange}
                  className='flex h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 group-hover:bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                />
                <span className='text-neutral-400 items-center mr-4 text-[10px]'>
                  IST
                </span>
              </div>
            </div>
          </div>
          {error && <span className='text-red-500 text-sm mt-1'>{error}</span>}
        </div>
        <div className='mt-4'>
          <Tags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
        <div>
          <Label htmlFor='Excerpt' className='text-[13px] text-neutral-200'>
            Excerpt
          </Label>
          <Textarea
            id='Excerpt'
            placeholder='Write a short description of your post'
            value={post.excerpt}
            onChange={handleExcerptChange}
            className='flex mt-4 h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500'
          />
        </div>
        <div className='flex items-center justify-between space-x-2 bg-neutral-600 p-4 rounded-md '>
          <div className='flex flex-row items-center gap-2'>
            <Star
              className='size-4 '
              fill={post.featured ? "white" : "transparent"}
            />
            <Label htmlFor='feature-post'>Feature this post</Label>
          </div>
          <Switch
            id='feature-post'
            checked={post.featured}
            onCheckedChange={toggleFeaturePost}
            className='data-[state=checked]:bg-green-500'
          />
        </div>
        <div className='mt-4'>
          <Label className='text-2xl font-semibold text-neutral-200 '>
            SEO & Social
          </Label>
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label
            htmlFor='MetaDataTitle'
            className='text-[13px] text-neutral-200'
          >
            Meta Data Title
          </Label>
          <input
            id='MetaDataTitle'
            type='text'
            placeholder='Meta Data Title'
            value={metadata.title}
            onChange={handleMetaTitleChange}
            className='flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500'
          />
        </div>
        <div>
          <Label
            htmlFor='MetaDataDescription'
            className='text-[13px] text-neutral-200'
          >
            Meta Data Description
          </Label>
          <Textarea
            id='Excerpt'
            placeholder='Meta Data Description'
            value={metadata.description}
            onChange={handleMetaDescriptionChange}
            className='flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500'
          />
          <div className='text-neutral-500 text-[12px]'>
            Recommended: 140 characters. You've used{" "}
            <span
              className={
                metadata.description.length === 0
                  ? ""
                  : metadata.description.length <= 140
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {metadata.description.length}
            </span>
            .
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Label
            htmlFor='MetaDataDescription'
            className='text-[13px] text-neutral-200 mt-4'
          >
            Meta Data Image Upload
          </Label>
          <UploadComponent
            imageUrl={metadata.imageUrl}
            isSubmitting={isSubmitting}
            onChange={handleMetaDataImageChange}
            isFileUploadOpen={isFileUploadOpen}
            toggleFileUpload={toggleFileUpload}
            text='Add an image'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='OgTitle' className='text-[13px] text-neutral-200'>
            OG Title
          </Label>
          <input
            id='OgTitle'
            type='text'
            placeholder='OG Title'
            value={metadata.ogTitle}
            onChange={handleOgTitleChange}
            className='flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500'
          />
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='OgDescription'
            className='text-[13px] text-neutral-200'
          >
            OG Description
          </Label>
          <Textarea
            id='OgDescription'
            placeholder='OG Description'
            value={metadata.ogDescription}
            onChange={handleOgDescriptionChange}
            className='flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500'
          />
        </div>

        <div className='flex flex-col gap-4'>
          <Label
            htmlFor='OgImage'
            className='text-[13px] text-neutral-200 mt-4'
          >
            OG Image URL
          </Label>
          <UploadComponent
            imageUrl={metadata.ogImage}
            isSubmitting={isSubmitting}
            onChange={handleOgImageChange}
            isFileUploadOpen={isFileUploadOpen}
            toggleFileUpload={toggleFileUpload}
            text='Add an image'
          />
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='TwitterTitle'
            className='text-[13px] text-neutral-200'
          >
            Twitter Title
          </Label>
          <input
            id='TwitterTitle'
            type='text'
            placeholder='Twitter Title'
            value={metadata.twitterTitle}
            onChange={handleTwitterTitleChange}
            className='flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500'
          />
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='TwitterDescription'
            className='text-[13px] text-neutral-200'
          >
            Twitter Description
          </Label>
          <Textarea
            id='TwitterDescription'
            placeholder='Twitter Description'
            value={metadata.twitterDescription}
            onChange={handleTwitterDescriptionChange}
            className='flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700 border-2 border-transparent focus-within:border-green-500'
          />
        </div>

        <div className='flex flex-col gap-4'>
          <Label
            htmlFor='TwitterImage'
            className='text-[13px] text-neutral-200 mt-4'
          >
            Twitter Image URL
          </Label>
          <UploadComponent
            imageUrl={metadata.twitterImage}
            isSubmitting={isSubmitting}
            onChange={handleTwitterImageChange}
            isFileUploadOpen={isFileUploadOpen}
            toggleFileUpload={toggleFileUpload}
            text='Add an image'
          />
        </div>

        <div>
          <Button variant='destructive-outline' className='w-full mt-4'>
            <Trash2 className='mr-2 size-4' /> Delete Post
          </Button>
        </div>
      </div>
    </div>
  );
}
interface TagsProps {
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
}

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

export const Tags: React.FC<TagsProps> = ({
  selectedTags,
  setSelectedTags,
}) => {
  // ToDo: Add a server action to fetch the data from db
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tagOptions = await fetchAllTagsWithPostCount();
      const formattedTags = tagOptions.map((tagOptions) => ({
        value: tagOptions.slug,
        label: capitalizeFirstLetter(tagOptions.slug),
      }));
      setTags(formattedTags);
    };

    fetchTags();
  }, []);

  return (
    <div className='gap-4 mt-4'>
      <h1 className='text-[13px]  mb-4'>Tags</h1>
      <MultiSelect onValueChange={setSelectedTags} defaultValue={selectedTags}>
        <MultiSelectTrigger className='w-96 '>
          <MultiSelectValue placeholder='Select tags' />
        </MultiSelectTrigger>
        <MultiSelectContent className='bg-neutral-800 text-neutral-200'>
          <MultiSelectSearch placeholder='Input to search' />
          <MultiSelectList>
            <MultiSelectGroup className='bg-neutral-800'>
              {tags.map((tag) => (
                <MultiSelectItem
                  key={tag.value}
                  value={tag.value}
                  className='bg-neutral-800 text-neutral-300'
                >
                  {tag.label}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
};
