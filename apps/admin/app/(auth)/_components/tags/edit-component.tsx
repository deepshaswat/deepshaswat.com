"use client";

import { updateTagAction, deleteTagAction } from "@repo/actions";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

function reverseAndHyphenate(item: string): string {
  return item.toLowerCase().split(" ").join("-");
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

interface TagInterface {
  id: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  posts?: { id: string }[];
}

function EditComponent({
  id,
  slug,
  description,
  imageUrl,
}: TagInterface): JSX.Element {
  const router = useRouter();
  const [tagDescription, setTagDescription] = useState(description);
  const tagId = id;
  const [tagImageUrl, setTagImageUrl] = useState(imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputSlug, setInputSlug] = useState(slug);
  const isEmpty = slug === "";
  // eslint-disable-next-line react/hook-use-state -- error value is unused, only setter is needed
  const [_error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await deleteTagAction(slug);
    } catch {
      // Failed to delete tag
    } finally {
      setIsDeleting(false);
      router.push("/tags");
    }
  };

  const handleSlugNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInputSlug(reverseAndHyphenate(e.target.value));
  };

  const handleTagDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setTagDescription(e.target.value);
  };

  const handleTagImageChange = async (file?: File): Promise<void> => {
    if (file) {
      setIsSubmitting(true);
      try {
        const { data } = await axios.post<UploadResponse>("/api/upload", {
          fileType: file.type,
        });

        const { uploadURL, s3URL } = data;

        await axios.put(uploadURL, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        setTagImageUrl(s3URL);
      } catch {
        // Error uploading file
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onCloseTagImage();
    }
  };

  const onCloseTagImage = (): void => {
    setTagImageUrl("");
    setIsSubmitting(false);
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    setError("");

    const result = await updateTagAction({
      id: tagId,
      slug: inputSlug,
      description: tagDescription,
      imageUrl: tagImageUrl,
    });

    setIsSubmitting(false);

    if ("error" in result) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Failed to update tag",
      );
    } else {
      setInputSlug(result.slug);
      router.push(`/tags/${result.slug}`);
    }
  };

  // const tag = await fetchTagDetails(slug);

  // console.log(tag);

  // //Handle case where blog post is not found
  // if (tag === null) {
  //   notFound();
  // }

  return (
    <div className="m-8  lg:ml-[156px] lg:mr-[156px]">
      <div className="">
        <div className="flex flex-row items-center justify-between mb-4 lg:mb-0 ">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-neutral-200 hover:text-neutral-100"
                    href="/tags"
                  >
                    Tags
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-normal text-neutral-500">
                    Edit tag
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className=" gap-20 justify-start">
            <Button
              className="rounded-sm items-center"
              onClick={() => {
                void handleSubmit();
              }}
              variant="default"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Label className="text-3xl font-semibold" htmlFor="">
          {capitalizeFirstLetter(inputSlug)}
        </Label>
        <div className=" bg-neutral-900 p-5 rounded-lg mt-5 ">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2">
              <div className="mb-4 space-y-2">
                <Label
                  className="text-[13px] text-neutral-200"
                  htmlFor="SlugName"
                >
                  Slug
                </Label>
                <div className=" items-center bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                  <input
                    className=" h-8  w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    id="SlugName"
                    onChange={handleSlugNameChange}
                    type="text"
                    value={inputSlug}
                  />
                </div>

                {!isEmpty ? (
                  <span className="text-[12px] text-neutral-500">
                    www.deepshaswat.com/tags/{inputSlug}/
                  </span>
                ) : null}
                {isEmpty ? (
                  <span className="text-[12px] text-neutral-500">
                    www.deepshaswat.com/tags/
                  </span>
                ) : null}
              </div>

              <div className="mt-4 space-y-2">
                <Label
                  className="text-[13px] text-neutral-200"
                  htmlFor="TagDescription"
                >
                  Description
                </Label>
                <Textarea
                  className=" mt-4 h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-800 border-2 border-transparent focus-within:border-green-500"
                  id="TagDescription"
                  onChange={handleTagDescriptionChange}
                  value={tagDescription}
                />
                <div className="text-neutral-500 text-[12px]">
                  Maximum: 500 characters. You&apos;ve used{" "}
                  <span
                    className={
                      tagDescription?.length === 0 ? "" : "text-green-500"
                    }
                  >
                    {tagDescription?.length}
                  </span>
                  .
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <Label className="text-sm text-neutral-200" htmlFor="TagImage">
                Tag image
              </Label>
              <SingleImageDropzone
                className="outline-none mt-2"
                disabled={isSubmitting}
                onChange={(file) => {
                  void handleTagImageChange(file);
                }}
                value={tagImageUrl}
              />
            </div>
          </div>
        </div>
        <Button
          className="mt-10 text-neutral-200"
          disabled={isDeleting}
          onClick={() => {
            void handleDelete();
          }}
          size="lg"
          variant="destructive"
        >
          {isDeleting ? "Deleting..." : "Delete Tag"}
        </Button>
      </div>
    </div>
  );
}

export default EditComponent;
