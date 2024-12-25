"use client";

import axios from "axios";

import { useState, useTransition } from "react";

import {
  Button,
  Label,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  SingleImageDropzone,
  Textarea,
} from "@repo/ui";

import { createTagAction } from "@repo/actions";
import { useRouter } from "next/navigation";

const reverseAndHyphenate = (item: string) => {
  return item.toLowerCase().split(" ").join("-");
};

const NewTag = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputSlug, setInputSlug] = useState("");
  const [tagImageUrl, setTagImageUrl] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const isEmpty = inputSlug === "";
  const [slugError, setSlugError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [saveButtonColor, setSaveButtonColor] = useState("secondary");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSlugNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSlug(reverseAndHyphenate(e.target.value));
  };

  const handleTagDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTagDescription(e.target.value);
  };

  const handleTagImageChange = async (file?: File) => {
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
    setTagImageUrl("");
    setIsSubmitting(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setSlugError("");
    setDescriptionError("");

    startTransition(async () => {
      const result = await createTagAction({
        slug: inputSlug,
        description: tagDescription,
        imageUrl: tagImageUrl,
      });

      if (result.success) {
        console.log("Tag created successfully:", result);
        router.push(`/tags/${inputSlug}`);
        setSaveButtonColor("green");
      } else {
        setSaveButtonColor("red");
        // if (result.error?.slug) {
        //   setSlugError(result.error.slug || "");
        // }
        // if (result.error?.description) {
        //   setDescriptionError(result.error.description);
        // }
      }

      setIsSubmitting(false);
      setTimeout(() => setSaveButtonColor("secondary"), 3000);
    });
  };

  return (
    <div className='m-4 md:m-8 lg:mx-auto lg:max-w-5xl'>
      <div className='mb-5'>
        <div className='flex flex-row items-center justify-between mb-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/tags'
                  className='text-neutral-200 hover:text-neutral-100'
                >
                  Tags
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='font-normal text-neutral-500'>
                  New tag
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button
            variant={"default"}
            className='rounded-sm'
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {/* {isSubmitting ? "Saving..." : "Save"} */}
            Save
          </Button>
        </div>
        <h1 className='text-3xl font-semibold'>New tag</h1>
      </div>

      <div className='bg-neutral-900 rounded-lg p-4 lg:p-6 '>
        <div className='flex flex-col lg:flex-row!important lg:overflow-hidden gap-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='SlugName' className='text-sm text-neutral-200'>
                Slug
              </Label>
              <input
                id='SlugName'
                type='text'
                value={inputSlug}
                onChange={handleSlugNameChange}
                className={`w-full h-10 rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm border-2 ${
                  slugError ? "border-red-500" : "border-transparent"
                } focus:border-green-500 focus:outline-none`}
              />
              <span className='text-xs text-neutral-500'>
                www.deepshaswat.com/tags/{inputSlug || ""}
              </span>
              {slugError && (
                <div className='text-red-500 text-sm mt-1'>{slugError}</div>
              )}
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='TagDescription'
                className='text-sm text-neutral-200'
              >
                Description
              </Label>
              <Textarea
                id='TagDescription'
                value={tagDescription}
                onChange={handleTagDescriptionChange}
                className={`w-full min-h-[100px] rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm border-2 ${
                  descriptionError ? "border-red-500" : "border-transparent"
                } focus:border-green-500 focus:outline-none`}
              />
              <div className='text-xs text-neutral-500'>
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
              {descriptionError && (
                <div className='text-red-500 text-sm mt-1'>
                  {descriptionError}
                </div>
              )}
            </div>
          </div>

          <div className=''>
            <Label
              htmlFor='TagImage'
              className='text-sm text-neutral-200 mb-2 block'
            >
              Tag image
            </Label>
            <SingleImageDropzone
              className='w-full h-[200px] outline-none'
              disabled={isSubmitting}
              value={tagImageUrl}
              onChange={handleTagImageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTag;
