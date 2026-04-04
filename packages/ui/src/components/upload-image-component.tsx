"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@repo/ui/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { SingleImageDropzone } from "./single-image-dropzone";

interface UploadComponentProps {
  imageUrl: string;

  isFileUploadOpen: boolean;
  toggleFileUpload: (value: boolean) => void;
  isSubmitting: boolean;
  onChange: (file?: File) => void;

  buttonVariant?:
    | "metadata"
    | "default"
    | "destructive"
    | "destructive-outline"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "date"
    | null
    | undefined;
  text: string;
  className?: string;
  onCancel: () => void;
}

export const UploadComponent: React.FC<UploadComponentProps> = ({
  imageUrl,
  isFileUploadOpen,
  toggleFileUpload,
  isSubmitting,
  onChange,
  buttonVariant = "metadata",
  text,
  className,
  onCancel,
}: UploadComponentProps) => {
  return (
    <>
      {imageUrl ? (
        <SingleImageDropzone
          className={cn("w-full outline-none", className)}
          disabled={isSubmitting}
          onChange={onChange}
          value={imageUrl}
        />
      ) : (
        <Button
          className={cn("", className)}
          onClick={() => {
            toggleFileUpload(true);
          }}
          variant={buttonVariant}
        >
          <Plus className="mr-2 size-4" />
          {text}
        </Button>
      )}

      <Dialog onOpenChange={toggleFileUpload} open={isFileUploadOpen}>
        <DialogContent className="dark:bg-neutral-700">
          <DialogHeader>
            <DialogTitle>Select file to upload</DialogTitle>
          </DialogHeader>
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmitting}
            onChange={onChange}
            value={imageUrl}
          />
          {isSubmitting ? (
            <Button className="mt-2" onClick={onCancel} variant="destructive">
              <X className="mr-2 size-4" />
              Cancel Upload
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
