"use client";

import type { PartialBlock } from "@blocknote/core";
import type { DefaultReactSuggestionItem } from "@blocknote/react";
import {
  insertOrUpdateBlockForSlashMenu,
  filterSuggestionItems,
} from "@blocknote/core/extensions";
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
import { FaYoutube, FaMarkdown, FaLightbulb } from "react-icons/fa";
import { toast } from "sonner";
import { blocknoteSchema } from "./schema";

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
    insertOrUpdateBlockForSlashMenu(editor, {
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
    insertOrUpdateBlockForSlashMenu(editor, {
      type: "markdown",
    });
  },
  group: "EMBEDS",
  icon: <FaMarkdown />,
  aliases: ["markdown", "md"],
  subtext: "Used to add a markdown editor block.",
});

const insertCallout = (
  editor: typeof blocknoteSchema.BlockNoteEditor,
): DefaultReactSuggestionItem => ({
  title: "Callout",
  onItemClick: () => {
    insertOrUpdateBlockForSlashMenu(editor, {
      type: "callout",
    });
  },
  group: "Media",
  icon: <FaLightbulb />,
  aliases: ["callout", "call"],
  subtext: "Used to add a callout block.",
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
  insertCallout(editor),
  insertDivider(editor),
];

interface UploadResponse {
  uploadURL: string;
  s3URL: string;
}

// The editable BlockNote editor fails to resolve node positions when the
// initial content carries explicit block `id`s (getPos() returns undefined, so
// custom blocks like the callout throw "RangeError: Position undefined out of
// range"). Strip the `id`s (BlockNote regenerates them), ensure every text run
// has a `styles` object, and recurse into children before handing content to
// the editor. Read-only rendering tolerates the raw shape, but the editor does
// not — see the sanitisation used by the working stockbook editor.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- BlockNote content is dynamically typed JSON
function sanitizeBlock(block: any): any {
  if (!block || typeof block !== "object") return block;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- id intentionally dropped
  const { id, ...rest } = block;
  if (Array.isArray(rest.content)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- BlockNote inline content
    rest.content = rest.content.map((item: any) =>
      item && item.type === "text" && !item.styles
        ? { ...item, styles: {} }
        : item,
    );
  }
  if (Array.isArray(rest.children)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- recursive sanitisation
    rest.children = rest.children.map((child: any) => sanitizeBlock(child));
  }
  return rest;
}

// Safely parse JSON content, returning undefined if invalid
function parseInitialContent(
  content: string | undefined,
): PartialBlock[] | undefined {
  if (!content) return undefined;

  try {
    const parsed: unknown = JSON.parse(content);
    // Verify it's a non-empty array (BlockNote expects array of blocks)
    if (Array.isArray(parsed) && parsed.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- sanitised BlockNote blocks
      return parsed.map((b) => sanitizeBlock(b)) as PartialBlock[];
    }
    return undefined;
  } catch {
    // If not valid JSON, convert plain text to a paragraph block
    if (content.trim()) {
      return [
        {
          type: "paragraph",
          content: [{ type: "text", text: content, styles: {} }],
        },
      ];
    }
    return undefined;
  }
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
    initialContent: parseInitialContent(initialContent),
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
