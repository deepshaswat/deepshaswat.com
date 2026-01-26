"use client";

import { createTagAction } from "@repo/actions";
import axios from "axios";
import { useRouter } from "next/navigation";
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

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

function reverseAndHyphenate(item: string): string {
  return item.toLowerCase().split(" ").join("-");
}

function NewTag(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputSlug, setInputSlug] = useState("");
  const [tagImageUrl, setTagImageUrl] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const [slugError, setSlugError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  // eslint-disable-next-line react/hook-use-state -- Button color state for future visual feedback
  const [_saveButtonColor, setSaveButtonColor] = useState("secondary");
  const router = useRouter();
  const [_isPending, startTransition] = useTransition();

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

  const handleSave = (): void => {
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
        router.push(`/tags/${inputSlug}`);
        setSaveButtonColor("green");
      } else {
        setSaveButtonColor("red");
      }

      setIsSubmitting(false);
      setTimeout(() => {
        setSaveButtonColor("secondary");
      }, 3000);
    });
  };

  return (
    <div className="m-4 md:m-8 lg:mx-auto lg:max-w-5xl">
      <div className="mb-5">
        <div className="flex flex-row items-center justify-between mb-4">
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
                  New tag
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button
            className="rounded-sm"
            disabled={isSubmitting}
            onClick={handleSave}
            variant="default"
          >
            {/* {isSubmitting ? "Saving..." : "Save"} */}
            Save
          </Button>
        </div>
        <h1 className="text-3xl font-semibold">New tag</h1>
      </div>

      <div className="bg-neutral-900 rounded-lg p-4 lg:p-6 ">
        <div className="flex flex-col lg:flex-row!important lg:overflow-hidden gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-neutral-200" htmlFor="SlugName">
                Slug
              </Label>
              <input
                className={`w-full h-10 rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm border-2 ${
                  slugError ? "border-red-500" : "border-transparent"
                } focus:border-green-500 focus:outline-none`}
                id="SlugName"
                onChange={handleSlugNameChange}
                type="text"
                value={inputSlug}
              />
              <span className="text-xs text-neutral-500">
                www.deepshaswat.com/tags/{inputSlug || ""}
              </span>
              {slugError ? (
                <div className="text-red-500 text-sm mt-1">{slugError}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label
                className="text-sm text-neutral-200"
                htmlFor="TagDescription"
              >
                Description
              </Label>
              <Textarea
                className={`w-full min-h-[100px] rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm border-2 ${
                  descriptionError ? "border-red-500" : "border-transparent"
                } focus:border-green-500 focus:outline-none`}
                id="TagDescription"
                onChange={handleTagDescriptionChange}
                value={tagDescription}
              />
              <div className="text-xs text-neutral-500">
                Maximum: 500 characters. You&apos;ve used{" "}
                <span
                  className={
                    tagDescription.length === 0 ? "" : "text-green-500"
                  }
                >
                  {tagDescription.length}
                </span>
                .
              </div>
              {descriptionError ? (
                <div className="text-red-500 text-sm mt-1">
                  {descriptionError}
                </div>
              ) : null}
            </div>
          </div>

          <div className="">
            <Label
              className="text-sm text-neutral-200 mb-2 block"
              htmlFor="TagImage"
            >
              Tag image
            </Label>
            <SingleImageDropzone
              className="w-full h-[200px] outline-none"
              disabled={isSubmitting}
              onChange={(file) => {
                void handleTagImageChange(file);
              }}
              value={tagImageUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTag;
