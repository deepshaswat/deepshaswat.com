"use client";

import React, { useEffect, useState } from "react";
import { Link as LinkIcon } from "lucide-react";

import Link from "next/link";
import { useRecoilValue } from "recoil";

import { selectDate } from "@repo/store";

import { Input, Label, DatePicker, MultiSelect, Textarea } from "@repo/ui";
import { dateTimeValidation } from "../../../../actions/date-time";

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
}: MetadataSidebarProps) {
  const isEmpty = inputUrl === "";
  const [error, setError] = useState<string | null>("");
  const inputDate = useRecoilValue(selectDate);

  useEffect(() => {
    setError("");
    const validateDate = async () => {
      const result = await dateTimeValidation(inputDate, inputTimeIst);
      console.log("combines: " + result.combinedDate);
      if (result.error) {
        setError(result.error ?? null);
      } else {
        console.log("Combined Date and Time:", result.combinedDate);
        setInputDate(result.combinedDate as Date);
      }
    };
    validateDate();
  }, [inputDate, inputTimeIst]);
  return (
    <div className='border-l-[1px] border-neutral-700  w-[400px] fixed right-0 top-0 bottom-0 z-40 shadow-lg p-6 overflow-y-auto '>
      <h2 className='text-2xl font-semibold mb-4'>Post settings</h2>

      <div className='space-y-4 mt-8'>
        <div className='space-y-2'>
          <Label htmlFor='PorlUrl' className='text-[13px] text-neutral-200'>
            Post URL
          </Label>
          <div className='flex items-center bg-neutral-700 border-2 border-transparent focus-within:border-green-500 rounded-md'>
            <LinkIcon className='text-neutral-400 ml-2 size-4' />
            <input
              id='PostUrl'
              type='text'
              placeholder='Post URL'
              value={inputUrl}
              onChange={onInputUrlChange}
              className='flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-700 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>

          {!isEmpty && (
            <span className='text-[12px] text-muted text-neutral-500'>
              www.deepshaswat.com/{inputUrl}/
            </span>
          )}
          {isEmpty && (
            <span className='text-[12px] text-muted text-neutral-500'>
              www.deepshaswat.com/
            </span>
          )}
        </div>
        <div className='flex flex-col gap-2 mb-4'>
          <Label htmlFor='PublishDate' className='text-[13px] text-neutral-200'>
            Publish Date
          </Label>
          <div className='flex flex-row items-center'>
            <DatePicker />
            <div className='flex flex-row items-center group '>
              <div className='ml-2 flex items-center bg-neutral-700 group-hover:bg-neutral-900 border-none rounded-md'>
                <input
                  id='publishTime'
                  type='text'
                  placeholder='00:00'
                  value={inputTimeIst}
                  onChange={setInputTimeIst}
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
            placeholder=''
            value={inputExcerpt}
            onChange={setInputExcerpt}
            className='flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50  bg-neutral-700 border-2 border-transparent focus-within:border-green-500 '
          />
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
    <div className='gap-4 mt-4'>
      <h1 className='text-[13px]  mb-4'>Tags</h1>
      <MultiSelect
        options={tags}
        onValueChange={setSelectedTags}
        defaultValue={selectedTags}
        placeholder=''
        variant='inverted'
        animation={0}
        maxCount={10}
        className='w-full bg-neutral-700 hover:bg-neutral-900 ring-0 outline-none focus:ring-0 focus:outline-none'
      />
    </div>
  );
};
