"use client";

import axios from "axios";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
}

const Editor = ({ onChange, initialContent }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File) => {
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

      // Return the S3 URL for rendering in the editor
      return s3URL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => {
          onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        }}
      ></BlockNoteView>
    </div>
  );
};

export default Editor;
