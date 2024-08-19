"use client";

import React, { useEffect, useState } from "react";
import { Link as LinkIcon, Trash2, Plus, Star } from "lucide-react";

import Link from "next/link";
import { useRecoilValue } from "recoil";

import { selectDate } from "@repo/store";

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
} from "@repo/ui";

import { dateTimeValidation } from "@repo/actions";

interface MetadataSidebarProps {
  inputUrl: string;
  onInputUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputTimeIst: string;
  setInputTimeIst: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setInputDate: (date: Date) => void;
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
  inputExcerpt: string;
  setInputExcerpt: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  inputMetaDataTitle: string;
  setInputMetaDataTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMetaDataDescription: string;
  setInputMetaDataDescription: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  metadataImageUrl: string;
  isSubmitting: boolean;
  onChange: (file?: File) => void;
  isFileUploadOpen: boolean;
  toggleFileUpload: (value: boolean) => void;
  featurePost: boolean;
  setFeaturePost: () => void;
}

export function MetadataSidebar({
  inputUrl,
  onInputUrlChange,
  inputTimeIst,
  setInputTimeIst,
  setInputDate,
  selectedTags,
  setSelectedTags,
  inputExcerpt,
  setInputExcerpt,
  inputMetaDataTitle,
  setInputMetaDataTitle,
  inputMetaDataDescription,
  setInputMetaDataDescription,
  metadataImageUrl,
  isSubmitting,
  onChange,
  isFileUploadOpen,
  toggleFileUpload,
  featurePost,
  setFeaturePost,
}: MetadataSidebarProps) {
  const isEmpty = inputUrl === "";
  const [error, setError] = useState<string | null>("");
  const inputDate = useRecoilValue(selectDate);

  useEffect(() => {
    setError("");
    const validateDate = async () => {
      const result = await dateTimeValidation(inputDate, inputTimeIst);

      if (result.error) {
        setError(result.error ?? null);
      } else {
        setInputDate(result.combinedDate as Date);
      }
    };
    validateDate();
  }, [inputDate, inputTimeIst]);

  return (
    <div className="border-l-[1px] border-neutral-700  w-[400px] fixed right-0 top-0 bottom-0 z-40 shadow-lg p-6 overflow-y-auto ">
      <h2 className="text-2xl font-semibold mb-4">Post settings</h2>

      <div className="space-y-4 mt-8">
        <div className="space-y-2">
          <Label htmlFor="PorlUrl" className="text-[13px] text-neutral-200">
            Post URL
          </Label>
          <div className="flex items-center bg-neutral-700 border-2 border-transparent focus-within:border-green-500 rounded-md">
            <LinkIcon className="text-neutral-400 ml-2 size-4" />
            <input
              id="PostUrl"
              type="text"
              placeholder="Post URL"
              value={inputUrl}
              onChange={onInputUrlChange}
              className="flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {!isEmpty && (
            <span className="text-[12px] text-neutral-500">
              www.deepshaswat.com/{inputUrl}/
            </span>
          )}
          {isEmpty && (
            <span className="text-[12px]  text-neutral-500">
              www.deepshaswat.com/
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="PublishDate" className="text-[13px] text-neutral-200">
            Publish Date
          </Label>
          <div className="flex flex-row items-center">
            <DatePicker />
            <div className="flex flex-row items-center group ">
              <div className="ml-2 flex items-center bg-neutral-700 group-hover:bg-neutral-900 border-none rounded-md">
                <input
                  id="publishTime"
                  type="text"
                  placeholder="00:00"
                  value={inputTimeIst}
                  onChange={setInputTimeIst}
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
        <div className="mt-4">
          <Tags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
        <div>
          <Label htmlFor="Excerpt" className="text-[13px] text-neutral-200">
            Excerpt
          </Label>
          <Textarea
            id="Excerpt"
            placeholder=""
            value={inputExcerpt}
            onChange={setInputExcerpt}
            className="flex mt-4 h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50  bg-neutral-700 border-2 border-transparent focus-within:border-green-500 "
          />
        </div>
        <div className="flex items-center justify-between space-x-2 bg-neutral-600 p-4 rounded-md">
          <div className="flex flex-row items-center gap-2">
            <Star
              className="size-4 "
              fill={featurePost ? "white" : "transparent"}
            />
            <Label htmlFor="feature-post">Feature this post</Label>
          </div>
          <Switch
            id="feature-post"
            checked={featurePost}
            onCheckedChange={setFeaturePost}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="MetaDataTitle"
            className="text-[13px] text-neutral-200"
          >
            Meta Data Title
          </Label>
          <div className="flex items-center bg-neutral-700 border-2 border-transparent focus-within:border-green-500 rounded-md">
            <input
              id="PostUrl"
              type="text"
              placeholder="Title"
              value={inputMetaDataTitle}
              onChange={setInputMetaDataTitle}
              className="flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="text-neutral-500 text-[12px]">
            Recommended: 60 characters. You've used{" "}
            <span
              className={
                inputMetaDataTitle.length === 0
                  ? ""
                  : inputMetaDataTitle.length <= 60
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {inputMetaDataTitle.length}
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
            id="Excerpt"
            placeholder=""
            value={inputMetaDataDescription}
            onChange={setInputMetaDataDescription}
            className="flex mt-4 h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50  bg-neutral-700 border-2 border-transparent focus-within:border-green-500 "
          />
          <div className="text-neutral-500 text-[12px]">
            Recommended: 140 characters. You've used{" "}
            <span
              className={
                inputMetaDataDescription.length === 0
                  ? ""
                  : inputMetaDataDescription.length <= 140
                    ? "text-green-500"
                    : "text-red-500"
              }
            >
              {inputMetaDataDescription.length}
            </span>
            .
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <Label
            htmlFor="MetaDataDescription"
            className="text-[13px] text-neutral-200 mt-4"
          >
            Meta Data Image Upload
          </Label>
          <UploadComponent
            imageUrl={metadataImageUrl}
            isSubmitting={isSubmitting}
            onChange={onChange}
            isFileUploadOpen={isFileUploadOpen}
            toggleFileUpload={toggleFileUpload}
            text="Add an image"
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
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
}

export const Tags: React.FC<TagsProps> = ({
  selectedTags,
  setSelectedTags,
}) => {
  // ToDo: Add a server action to fetch the data from db
  const tagOptions = ["react", "angular", "vue", "svelte", "ember"];
  const tags = tagOptions.map((tagOptions) => ({
    value: tagOptions.toLowerCase(),
    label: tagOptions.charAt(0).toUpperCase() + tagOptions.slice(1),
  }));

  return (
    <div className="gap-4 mt-4">
      <h1 className="text-[13px]  mb-4">Tags</h1>
      <MultiSelect onValueChange={setSelectedTags} defaultValue={selectedTags}>
        <MultiSelectTrigger className="w-96 ">
          <MultiSelectValue placeholder="Select tags" />
        </MultiSelectTrigger>
        <MultiSelectContent className="bg-neutral-800 text-neutral-200">
          <MultiSelectSearch placeholder="Input to search" />
          <MultiSelectList>
            <MultiSelectGroup className="bg-neutral-800">
              {tags.map((tag) => (
                <MultiSelectItem
                  key={tag.value}
                  value={tag.value}
                  className="bg-neutral-800 text-neutral-300"
                >
                  {tag.label}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
      {/* 
        Removed the MultiSelectSingle component and added the MultiSelect component from Nyxb UI
      */}
      {/* <MultiSelectSingle
        options={tags}
        onValueChange={setSelectedTags}
        defaultValue={selectedTags}
        placeholder=''
        variant='inverted'
        animation={0}
        maxCount={10}
        className='w-full bg-neutral-700 hover:bg-neutral-900 ring-0 outline-none focus:ring-0 focus:outline-none'
      /> */}
    </div>
  );
};
