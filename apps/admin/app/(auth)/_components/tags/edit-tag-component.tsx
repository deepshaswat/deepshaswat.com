"use client";

import { useState } from "react";
import { Button, Label, SingleImageDropzone, Textarea } from "@repo/ui";
import axios from "axios";

interface Tag {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

interface EditTagComponentProps {
  tag: Tag;
}

const reverseAndHyphenate = (item: string) => {
  return item.toLowerCase().split(" ").join("-");
};

export default function EditTagComponent({ tag }: EditTagComponentProps) {
  const [tagDescription, setTagDescription] = useState(tag.description);
  const [tagImageUrl, setTagImageUrl] = useState<string | undefined>(
    tag.imageUrl,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputUrl, setInputUrl] = useState(tag.name);
  const [inputSlug, setInputSlug] = useState(tag.slug);
  const isEmpty = inputUrl === "";

  const handleTagNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    if (inputSlug === "") {
      setInputSlug(reverseAndHyphenate(e.target.value));
    }
  };

  const handleSlugNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSlug(reverseAndHyphenate(e.target.value));
  };

  const handleTagDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTagDescription(e.target.value);
  };

  const handleTagImageChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      // setTagImage(file);
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
        setTagImageUrl(s3URL);

        console.log("File uploaded successfully:", s3URL);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onCloseTagImage();
    }
  };

  const onCloseTagImage = () => {
    setTagImageUrl(undefined);
    setIsSubmitting(false);
  };

  return (
    <div>
      <Label htmlFor="" className="text-3xl font-semibold">
        {inputUrl}
      </Label>
      <div className=" bg-neutral-900 p-5 rounded-lg mt-5 ">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <div className="mb-4 space-y-2">
              <Label htmlFor="TagName" className="text-[13px] text-neutral-200">
                Name
              </Label>
              <div className=" items-center bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                <input
                  id="TagName"
                  type="text"
                  value={inputUrl}
                  onChange={handleTagNameChange}
                  className=" h-8 pl-10  rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div className="mb-4 space-y-2">
              <Label
                htmlFor="SlugName"
                className="text-[13px] text-neutral-200"
              >
                Slug
              </Label>
              <div className=" items-center bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                <input
                  id="SlugName"
                  type="text"
                  value={inputSlug}
                  onChange={handleSlugNameChange}
                  className=" h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {!isEmpty && (
                <span className="text-[12px] text-neutral-500">
                  www.deepshaswat.com/tags/{inputSlug}/
                </span>
              )}
              {isEmpty && (
                <span className="text-[12px] text-neutral-500">
                  www.deepshaswat.com/tags/
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Label
                htmlFor="TagDescription"
                className="text-[13px] text-neutral-200"
              >
                Description
              </Label>
              <Textarea
                id="TagDescription"
                value={tagDescription}
                onChange={handleTagDescriptionChange}
                className=" mt-4 h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-800 border-2 border-transparent focus-within:border-green-500"
              />
              <div className="text-neutral-500 text-[12px]">
                Maximum: 500 characters. You've used{" "}
                <span
                  className={
                    tagDescription.length === 0 ? "" : "text-green-500"
                  }
                >
                  {tagDescription.length}
                </span>
                .
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <Label htmlFor="TagImage" className="text-sm text-neutral-200">
              Tag image
            </Label>
            <SingleImageDropzone
              className="outline-none mt-2"
              disabled={isSubmitting}
              value={tagImageUrl}
              onChange={handleTagImageChange}
            />
          </div>
        </div>
      </div>
      <Button
        variant={"destructive"}
        className="mt-10 text-neutral-200"
        size={"lg"}
      >
        Delete tag
      </Button>
    </div>
  );
}
