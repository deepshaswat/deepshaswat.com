"use client";

import React from "react";
import { Plus } from "lucide-react";

import { cn } from "@repo/ui/utils";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  SingleImageDropzone,
} from "@repo/ui";

interface UploadComponentProps {
  file: File | undefined;
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
}

export const UploadComponent: React.FC<UploadComponentProps> = ({
  file,
  isFileUploadOpen,
  toggleFileUpload,
  isSubmitting,
  onChange,
  buttonVariant = "metadata",
  text,
  className,
}: UploadComponentProps) => {
  return (
    <>
      <Button
        variant={buttonVariant}
        className={cn("", className)}
        onClick={() => toggleFileUpload(true)}
      >
        <Plus className="mr-2 size-4" />
        {text}
      </Button>
      <Dialog open={isFileUploadOpen} onOpenChange={toggleFileUpload}>
        <DialogContent className="dark:bg-neutral-700">
          <DialogHeader>
            <DialogTitle>Select file to upload</DialogTitle>
          </DialogHeader>
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmitting}
            value={file}
            onChange={onChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
