"use client";

import type { DefaultReactSuggestionItem } from "@blocknote/react";
import { insertOrUpdateBlock, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import axios from "axios";
import { Minus } from "lucide-react";
import { useTheme } from "next-themes";
import { FaYoutube, FaMarkdown } from "react-icons/fa";
import { toast } from "sonner";
import { blocknoteSchema } from "./schema";
import { parseBlockNoteContent } from "./content-utils";

export interface BlockNoteEditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  uploadEndpoint?: string;
}

const insertYoutube = (
  editor: typeof blocknoteSchema.BlockNoteEditor,
): DefaultReactSuggestionItem => ({
  title: "Youtube",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "youtube",
    });
  },
  group: "EMBEDS",
  icon: <FaYoutube />,
  aliases: ["youtube", "yt"],
  subtext: "Used to embed a youtube video.",
});

const insertMarkdown = (
  editor: typeof blocknoteSchema.BlockNoteEditor,
): DefaultReactSuggestionItem => ({
  title: "Markdown",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "markdown",
    });
  },
  group: "EMBEDS",
  icon: <FaMarkdown />,
  aliases: ["markdown", "md"],
  subtext: "Used to add a markdown editor block.",
});

const insertDivider = (
  editor: typeof blocknoteSchema.BlockNoteEditor,
): DefaultReactSuggestionItem => ({
  title: "Divider",
  onItemClick: () => {
    const block = editor.getTextCursorPosition().block;
    editor.insertBlocks([{ type: "divider" }], block, "before");
  },
  group: "Other",
  icon: <Minus />,
  aliases: ["divider", "line"],
  subtext: "Insert a horizontal divider.",
});

const getCustomSlashMenuItems = (
  editor: typeof blocknoteSchema.BlockNoteEditor,
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertYoutube(editor),
  insertMarkdown(editor),
  insertDivider(editor),
];

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

export function BlockNoteEditor({
  onChange,
  initialContent,
  editable = true,
  uploadEndpoint = "/api/upload",
}: BlockNoteEditorProps): JSX.Element {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File): Promise<string> => {
    // Handle clipboard images which may have generic names
    const fileType = file.type || "image/png";

    // Validate file type
    if (!fileType.startsWith("image/")) {
      toast.error("Only image files are supported");
      throw new Error("Only image files are supported");
    }

    const toastId = toast.loading("Uploading image...");

    try {
      const { data } = await axios.post<UploadResponse>(uploadEndpoint, {
        fileType,
      });

      const { uploadURL, s3URL } = data;

      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": fileType,
        },
      });

      toast.success("Image uploaded successfully", { id: toastId });
      return s3URL;
    } catch (error) {
      toast.error("Failed to upload image", { id: toastId });
      throw new Error("File upload failed");
    }
  };

  const editor = useCreateBlockNote({
    initialContent: parseBlockNoteContent(initialContent),
    uploadFile: handleUpload,
    schema: blocknoteSchema,
  });

  return (
    <div>
      <BlockNoteView
        data-theming-css-demo
        editable={editable}
        editor={editor}
        onChange={() => {
          onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        }}
        slashMenu={false}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      >
        <SuggestionMenuController
          getItems={(query) =>
            Promise.resolve(
              filterSuggestionItems(getCustomSlashMenuItems(editor), query),
            )
          }
          triggerCharacter="/"
        />
      </BlockNoteView>
    </div>
  );
}

export default BlockNoteEditor;
