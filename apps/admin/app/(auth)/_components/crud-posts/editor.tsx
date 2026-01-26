"use client";

import type { PartialBlock } from "@blocknote/core";
import type { DefaultReactSuggestionItem } from "@blocknote/react";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
  filterSuggestionItems,
} from "@blocknote/core";
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
import { Markdown, Youtube, Callout, Divider } from "@repo/ui";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    youtube: Youtube,
    markdown: Markdown,
    callout: Callout,
    divider: Divider,
  },
});

const insertYoutube = (
  editor: typeof schema.BlockNoteEditor,
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
  editor: typeof schema.BlockNoteEditor,
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

const insertCallout = (
  editor: typeof schema.BlockNoteEditor,
): DefaultReactSuggestionItem => ({
  title: "Callout",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "callout",
    });
  },
  group: "Media",
  icon: <FaLightbulb />,
  aliases: ["callout", "call"],
  subtext: "Used to add a callout block.",
});

const insertDivider = (
  editor: typeof schema.BlockNoteEditor,
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
  editor: typeof schema.BlockNoteEditor,
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

function Editor({
  onChange,
  initialContent,
  editable,
}: EditorProps): JSX.Element {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File): Promise<string> => {
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

      return s3URL;
    } catch {
      throw new Error("File upload failed");
    }
  };

  const editor = useCreateBlockNote({
    // comment the initialContent to avoid the error on Markdown to Blocks
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,

    uploadFile: handleUpload,
    schema,
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

export default Editor;
